import { JobModel} from "../models/job.js";
import { validatePartialJob, validateJob } from "../schemas/jobs.js";

export class JobController{

  static async getAll(req,res){
    const {text, title, level, technology, offset, limit} = req.query
    const jobs = await JobModel.getAll({text, title, level, technology, offset, limit})
    return res.status(200).json(jobs)
  }



  static async getById(req,res){
    const {id} = req.params
    const job = await JobModel.getById(id)
    if(!job) return res.status(404).json({message: 'Job not found'}   )
    return res.status(200).json(job)
  }

static async create(req, res) {
    const result = validateJob(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    try {
      const nuevoTrabajo = await JobModel.create({ input: result.data });
      return res.status(201).json(nuevoTrabajo);
    } catch (error) {
      return res.status(500).json({ 
        mensaje: "El servidor explotó", 
        razonExacta: error.message 
      });
    }
  }

  static async update(req,res){
    const {id} = req.params
    const result = validatePartialJob(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const oldJob = await JobModel.getById(id)
    if (!oldJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const newJobs = await JobModel.update(id, {input: result.data})
    return res.status(204).json(newJobs)
  }

  static async patch(req,res){
    const {id} = req.params
    const result = validatePartialJob(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    const oldJob = await JobModel.getById(id)
    if (!oldJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const newJobs = await JobModel.patch(id, {input: result.data})
    return res.status(204).json(newJobs)
  }

  static async delete(req,res){
    const {id} = req.params
    const oldJob = await JobModel.getById(id)
    if (!oldJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const response = await JobModel.delete(id)
    return res.status(204).json(response)
  }
}
