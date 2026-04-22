import * as z from "zod";



const jobSchema = z.object({
  titulo: 
    z.string(
    {
      required_error: "El titulo del trabajo es requerido", 
      invalid_type_error: "El titulo debe ser un texto"
    })
    .min(3, {message: "EL titulo del trabajo debe tener al menos 3 caracteres"})
    .max(100, {message: "El titulo del trabajo no puede tener mas de 100 caracteres"})
  ,
  empresa: 
    z.string()
    .min(1, {message: "La empresa es requerida"}),
  ubicacion: 
    z.string()
    .min(1, {message: "La ubicación es requerida"}),
  descripcion: 
    z.string()
    .optional(),
  content: z.object({
    description: z.string().optional(),
    responsibilities: z.string().optional(),
    requirements: z.string().optional(),
    about: z.string().optional()
  }).optional(),
  data: z.object({
    technology: z.array(z.string()).optional(),
    modalidad: z.string().optional(),
    nivel: z.string().optional(),
  })
    
});

export function validateJob(input) {
  return jobSchema.safeParse(input);
}

export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input);
}
