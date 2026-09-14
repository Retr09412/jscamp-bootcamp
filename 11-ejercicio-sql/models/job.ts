import crypto from 'node:crypto'
import db from '../db/database'
import type { CreateJobDTO, Job, JobFilters, UpdateJobDTO } from '../types'

export class JobModel {
  // Mapear rows planos → Job con estructura anidada
  private static mapRowsToJobs(rows: any[]): Job[] {
    const map = new Map<string, Job>()
    for (const row of rows) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          title: row.title,
          company: row.company,
          location: row.location,
          description: row.description,
          data: {
            technology: [],
            modality: row.modality,
            level: row.level
          },
          content: row.content_description ? {
            description: row.content_description,
            responsibilities: row.responsibilities,
            requirements: row.requirements,
            about: row.about
          } : undefined
        })
      }
      if (row.technology) {
        map.get(row.id)!.data.technology.push(row.technology)
      }
    }
    return Array.from(map.values())
  }

  // Obtener todos los jobs con filtros opcionales y paginación
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // Un detalle: El JOIN de abajo genera una fila por cada tecnología del job. Si aplicamos LIMIT sobre el JOIN, contamos filas y no jobs.
    // La solución es hacer una subconsulta que elige primero los ids de jobs de la página, y el JOIN externo recupera esos jobs con todas sus tecnologías
    const jobConditions: string[] = []
    const jobParams: any[] = []
    let techCondition = ''
    const techParams: string[] = []

    if (filters?.modality) {
      jobConditions.push('modality = ?')
      jobParams.push(filters.modality)
    }
    if (filters?.level) {
      jobConditions.push('level = ?')
      jobParams.push(filters.level)
    }
    if (filters?.tech) {
      techCondition = 'AND j.id IN (SELECT job_id FROM job_technologies WHERE technology = ?)'
      techParams.push(filters.tech)
    }

    const limit = filters?.limit ?? 50
    const offset = filters?.offset ?? 0

    const sql = `
      SELECT 
        j.id, j.title, j.company, j.location, j.description, j.modality, j.level,
        jt.technology,
        jc.description as content_description, jc.responsibilities, jc.requirements, jc.about
      FROM jobs j
      LEFT JOIN job_technologies jt ON j.id = jt.job_id
      LEFT JOIN job_content jc ON j.id = jc.job_id
      WHERE j.id IN (
        -- LIMIT/OFFSET van aquí para contar jobs (1 fila por job), no filas del JOIN
        SELECT id FROM jobs
        ${jobConditions.length ? 'WHERE ' + jobConditions.join(' AND ') : ''}
        LIMIT ? OFFSET ?
      )
      ${techCondition}
    `

    // Los parámetros se pasan en el mismo orden en que aparecen los '?' en el SQL
    const rows = db.prepare(sql).all(...jobParams, limit, offset, ...techParams)
    return this.mapRowsToJobs(rows)
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | null> {
    const sql = `
      SELECT 
        j.id, j.title, j.company, j.location, j.description, j.modality, j.level,
        jt.technology,
        jc.description as content_description, jc.responsibilities, jc.requirements, jc.about
      FROM jobs j
      LEFT JOIN job_technologies jt ON j.id = jt.job_id
      LEFT JOIN job_content jc ON j.id = jc.job_id
      WHERE j.id = ?
    `

    const rows = db.prepare(sql).all(id)
    if (rows.length === 0) return null
    return this.mapRowsToJobs(rows)[0]
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const id = crypto.randomUUID()
    const { title, company, location, description, data, content } = input
    const { technology, modality, level } = data

    const transaction = db.transaction(() => {
      // 1. Insertar job principal
      db.prepare(`
        INSERT INTO jobs (id, title, company, location, description, modality, level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, company, location, description, modality, level)

      // 2. Insertar tecnologías
      const insertTech = db.prepare(`
        INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)
      `)
      for (const tech of technology) {
        insertTech.run(id, tech)
      }

      // 3. Insertar contenido (si existe)
      if (content) {
        const contentId = crypto.randomUUID()
        db.prepare(`
          INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(contentId, id, content.description, content.responsibilities, content.requirements, content.about)
      }
    })

    transaction()
    const job = await this.getById(id)
    if (!job) throw new Error('Error creating job')
    return job
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const existing = await this.getById(id)
    if (!existing) return null;

    const { title, company, location, description, data, content } = input
    const updates: string[] = []
    const params: any[] = []

    if (title !== undefined) { updates.push('title = ?'); params.push(title) }
    if (company !== undefined) { updates.push('company = ?'); params.push(company) }
    if (location !== undefined) { updates.push('location = ?'); params.push(location) }
    if (description !== undefined) { updates.push('description = ?'); params.push(description) }
    if (data?.modality !== undefined) { updates.push('modality = ?'); params.push(data.modality) }
    if (data?.level !== undefined) { updates.push('level = ?'); params.push(data.level) }

    if (updates.length > 0) {
      params.push(id)
      db.prepare(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`).run(...params)
    }

    // Actualizar tecnologías si vienen en el input
    if (data?.technology !== undefined) {
      db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)
      const insertTech = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')
      for (const tech of data.technology) {
        insertTech.run(id, tech)
      }
    }

    // Actualizar contenido si viene en el input
    if (content !== undefined) {
      // Con UPDATE normal falla si la fila no existe (por ejemplo un job creado sin content).
      // Con UPSERT buscamos el id existente, y el INSERT lo crea o lo actualiza.
      const existing = db.prepare('SELECT id FROM job_content WHERE job_id = ?').get(id) as { id: string } | undefined
      const contentId = existing?.id ?? crypto.randomUUID()
      db.prepare(`
        INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          description = excluded.description,
          responsibilities = excluded.responsibilities,
          requirements = excluded.requirements,
          about = excluded.about
      `).run(contentId, id, content.description, content.responsibilities, content.requirements, content.about)
    }

    return this.getById(id)
  }
}