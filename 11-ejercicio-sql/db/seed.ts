import db from './database'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Leer jobs.json
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const jobsPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'jobs.json')
const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'))

// Crear 3 tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

// Preparar statements
const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTech = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

// Transaccion para insertar datos
const seedTransaction = db.transaction((jobsData) => {
  for (const job of jobsData) {
    insertJob.run(
      job.id,
      job.title,
      job.company,
      job.location,
      job.description,
      job.modality,
      job.level
    )

    for (const tech of job.technologies) {
      insertTech.run(job.id, tech)
    }

    const contentId = crypto.randomUUID()
    insertContent.run(
      contentId,
      job.id,
      job.content.description,
      job.content.responsibilities,
      job.content.requirements,
      job.content.about
    )
  }
})

seedTransaction(jobs)

console.log('Tablas creadas y datos insertados correctamente')