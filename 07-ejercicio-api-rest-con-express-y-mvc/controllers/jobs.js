import { JobModel} from "../models/job.js";

export class JobController{

  static async getAll(req,res){
    const {text, title, level, technology, offset, limit} = req.query
    const jobs = await JobModel.getAll({text, title, level, technology, offset, limit})
    return res.json(jobs)
  }

  static async getById(req,res){
    const {id} = req.params
    const job = await JobModel.getById(id, res)
    return res.job
  }

  static async create(req,res){
    let {titulo, empresa, ubicacion, descripcion, data, content} = req.body
    const newJobs = await JobModel.create({titulo, empresa, ubicacion, descripcion, data, content})
    
    return res.status(201).json(newJobs)
  }

  static async update(req,res){
    const {id} = req.params
    let {titulo, empresa, ubicacion, descripcion, data, content} = req.body
    const newJobs = await JobModel.update(id, {titulo, empresa, ubicacion, descripcion, data, content})
    return res.status(202).json(newJobs)
  }

  static async patch(req,res){
    const {id} = req.params
    let {titulo, empresa, ubicacion, descripcion, data, content} = req.body
    const newJobs = await JobModel.patch(id, {titulo, empresa, ubicacion, descripcion, data, content})
    return res.status(202).json(newJobs)
  }

  static async delete(req,res){
    const {id} = req.params
    const response = await JobModel.delete(id, res)
    return response
  }
}
