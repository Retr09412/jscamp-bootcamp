import jobs from '../data/jobs.json' with { type: 'json' }
import { DEFAULTS } from '../config.js';
import crypto from 'crypto'
import { json } from 'stream/consumers';


export class JobModel {
  
  static async getAll({text, title, level, technology, offset = DEFAULTS.LIMIT_PAGINATION,  limit = DEFAULTS.LIMIT_OFFSET}){
    let filteredJobs = jobs;
    
    if(text){
      const searchTerm = text.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm)
      )
    }
    
    if(title){
      const searchTitle = title.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.titulo.toLowerCase().includes(searchTitle)
      )
    }
    
    if(level){
      const searchLevel = level.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.data.nivel.toLowerCase().includes(searchLevel)
      )
    }
    
    if(technology){
      const searchTechnology = technology.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.data.technology.toLowerCase().includes(searchTechnology)
      )
    }
    
    const limitNumber = Number(offset);
    const offsetNumber = Number(limit);

    const paginationJobs = filteredJobs.slice(offsetNumber, limitNumber + offsetNumber)

    return paginationJobs

  }
  
  // No necesitamos el res porque ya lo estamos manejando en el controller
  static async getById(id) {
    let filterId = jobs;
    const searchId = id;

    if(id){
      filterId = filterId.find(job => job.id === searchId)
      return filterId
    }
  }
  

  static async create ({titulo, empresa, ubicacion, descripcion, data, content}){
    const newJob = {
      id: crypto.randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }
    jobs.push(newJob)
    console.log('TRABAJO CREADO ID:', newJob.id)
    return newJob
  }

  static async update (id, { titulo, empresa, ubicacion, descripcion, data, content}){
    const jobIndex = jobs.findIndex(job => job.id === id);
    jobs[jobIndex] = {
      id,
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }
    console.log('ID DEL TRABAJO ACTUALIZADO:', jobs[jobIndex].id)
    return jobs[jobIndex]
  }

  static async patch (id, { titulo, empresa, ubicacion, descripcion, data, content}){
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      console.log('ID DEL TRABAJO NO ENCONTRADO:', id)
      return null
    }
    jobs[jobIndex] = {
      id,
      titulo: titulo || jobs[jobIndex].titulo,
      empresa: empresa || jobs[jobIndex].empresa,
      ubicacion: ubicacion || jobs[jobIndex].ubicacion,
      descripcion: descripcion || jobs[jobIndex].descripcion,
      data: data || jobs[jobIndex].data,
      content: content || jobs[jobIndex].content
    }
    console.log('ID DEL TRABAJO ACTUALIZADO:', jobs[jobIndex].id)
    return jobs[jobIndex]

  }


  static async delete (id){
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      console.log('ID DEL TRABAJO NO ENCONTRADO:', id)
      return null
    }
    jobs.splice(jobIndex, 1)
    console.log('ID DEL TRABAJO ELIMINADO:', id)
    return {message: 'Job deleted'}
  }
}
