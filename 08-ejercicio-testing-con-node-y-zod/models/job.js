import { DEFAULTS } from '../config.js';
import crypto from 'crypto'
import { json } from 'stream/consumers';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jobs = require('../data/jobs.json');

export class JobModel {
  


  static async getAll({text, title, level, technology, offset = DEFAULTS.LIMIT_OFFSET,  limit = DEFAULTS.LIMIT_PAGINATION}){
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
        job.data.nivel.some(nivel => nivel.toLowerCase().includes(searchLevel))
      )
    }
    
    if(technology){
      const searchTechnology = technology.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        Array.isArray(job.data.technology) ? job.data.technology.some(tech => tech.toLowerCase().includes(searchTechnology)) : searchTechnology === job.data.technology.toLowerCase()
      )
    }
    
    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);

    const paginationJobs = filteredJobs.slice(offsetNumber, limitNumber + offsetNumber)

    return paginationJobs

  }
  
  static async getById(id) {
    return jobs.find(job => job.id === id);
  }
  

  static async create ({input}){
    const newJob = {
      id: crypto.randomUUID(),
      ...input
    }
    jobs.push(newJob)
    console.log('TRABAJO CREADO ID:', newJob.id)
    return newJob
  }

  static async update (id, {input}){
    const jobIndex = jobs.findIndex(job => job.id === id);
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...input

    }
    console.log('ID DEL TRABAJO ACTUALIZADO:', jobs[jobIndex].id)
    return jobs[jobIndex]
  }

  static async patch (id, {input}){
    const jobIndex = jobs.findIndex(job => job.id === id);
    if (jobIndex === -1) {
      console.log('ID DEL TRABAJO NO ENCONTRADO:', id)
      return res.status(404).json({message: 'Job not found'})
    }
    jobs[jobIndex] = {
      id,
      ...jobs[jobIndex],
      ...input
    }
    console.log('ID DEL TRABAJO ACTUALIZADO:', jobs[jobIndex].id)
    return jobs[jobIndex]

  }


  static async delete (id){
    const jobIndex = jobs.findIndex(job => job.id === id);
    jobs.splice(jobIndex, 1)
    console.log('ID DEL TRABAJO ELIMINADO:', id)
    return {message: 'Job deleted'}
  }
}
