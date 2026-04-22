import {test, describe, before, after } from 'node:test';
import assert  from 'node:assert';
import  app from './app.js';
import e from 'express';

let server
const PORT = 3456
const BASE_URL = `http://localhost:${PORT}`

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())
    server.on('error', reject)
  })
})

after(() => {
  return new Promise((resolve, reject) => {
  server.close((err) => {
    if(err) return reject(err)
    resolve()
  })
  })
})

describe('GET /jobs', () => {
  test('Debe devolver un array de trabajos y con status 200', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200), 'Status debe ser 200'

    const json = await response.json()
    assert.ok(Array.isArray(json), 'Respuesta debe ser un array')
  })

  test('Debe devolver trabajos para una tecnología específica', async () => {
    const tech = 'python'
    const response = await fetch(`${BASE_URL}/jobs?technology=${tech}`)
    assert.strictEqual(response.status, 200), 'Status debe ser 200'

    const json = await response.json()
    assert.ok( 
      json.some(job => (job.data.technology).includes(tech)),
      `Todos los trabajos deben ser de la tecnología ${tech}`

    )
  })

  test('Debe devolver el limite de la peticion', async () => {
    const limit = 5
    const response = await fetch(`${BASE_URL}/jobs?limit=${limit}`)
    assert.strictEqual(response.status, 200), 'Status debe ser 200'
    
    const json = await response.json()

    assert.ok(json.length === limit, `La cantidad de trabajos devueltos debe ser ${limit}`)

  })

  test ('Debe devolver el offset de la peticion', async () => {
    const offset = 2
    const response = await fetch(`${BASE_URL}/jobs?offset=${offset}`)
    assert.strictEqual(response.status, 200), 'Status debe ser 200'

    const json = await response.json()
    assert.ok(json.length > 0, 'Debe devolver trabajos a partir del offset')
  })

})

describe('POST /jobs', () => {
  test('Debe crear un nuevo trabajo y devolverlo con status 201', async () => {
    const newJob = {
    titulo: "Ingeniero DevOps",
    empresa: "CloudTech",
    ubicacion: "Remoto",
    descripcion: "Buscamos un ingeniero DevOps con experiencia en contenedores y orquestación.",
    data: {
      technology: ["docker", "kubernetes", "aws"],
      modalidad: "remoto",
      nivel: "senior"
    },
    content: {
      description: "CloudTech está buscando un Ingeniero DevOps...",
      responsibilities: "- Gestionar infraestructura cloud...",
      requirements: "- Experiencia con Docker y Kubernetes...",
      about: "CloudTech es una empresa líder en soluciones cloud..."
    }
  }

    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newJob)
    })
    
    const json = await response.json()
    assert.strictEqual(response.status, 201, 'Status debe ser 201');
    console.log("🛑 RESPUESTA DE GET BY ID:", response.status);
    
    assert.ok(json.id, 'El trabajo creado debe tener un ID')
    assert.strictEqual(json.titulo, newJob.titulo, 'El título del trabajo creado debe coincidir con el enviado')
  })
})

describe('GET /jobs/:id', () => {
  test('Debe devolver un trabajo específico por ID con status 200', async () => {
    
    const idReal = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'; 

    const response = await fetch(`${BASE_URL}/jobs/${idReal}`);
    console.log("🛑 RESPUESTA DE GET BY ID:", response.status);

    assert.strictEqual(response.status, 200, 'Status debe ser 200');

    const json = await response.json();
    assert.strictEqual(json.id, idReal, 'El ID del trabajo devuelto debe coincidir con el solicitado');
  });
});

describe('PUT /jobs/:id', () => {
  test('Debe actualizar completamente un trabajo existente y devolverlo con status 204', async () => {
    const idReal = 'e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d';
    const updatedJob = {
      titulo: "Ingeniero DevOps Senior",
      empresa: "CloudTech",
      ubicacion: "Remoto",
      descripcion: "Buscamos un ingeniero DevOps senior con experiencia en contenedores y orquestación.",
      data: {
        technology: ["docker", "kubernetes", "aws"],
        modalidad: "remoto",
        nivel: "senior"
      },
      content: {
        description: "CloudTech está buscando un Ingeniero DevOps Senior...",
        responsibilities: "- Gestionar infraestructura cloud...",
        requirements: "- Experiencia con Docker y Kubernetes...",
        about: "CloudTech es una empresa líder en soluciones cloud..."
      }
    };
    const prueba = await fetch(`${BASE_URL}/jobs/${idReal}`);
    const response = await fetch(`${BASE_URL}/jobs/${idReal}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedJob)
    });
    assert.strictEqual(response.status, 204, 'Status debe ser 204');
    console.log("🛑 RESPUESTA DE GET BY ID:", response.status);

    const responseGet = await fetch(`${BASE_URL}/jobs/${idReal}`);
    const json = await responseGet.json(); 
    assert.strictEqual(json.titulo, updatedJob.titulo, 'El título del trabajo actualizado debe coincidir con el enviado');
    assert.strictEqual(json.id, idReal, 'El ID del trabajo actualizado debe coincidir con el solicitado');
  });
});

describe('PATH /jobs/:id', () => {
  test('Debe actualizar parcialmente un trabajo existente y devolverlo con status 204', async () => {
    const idReal = 'e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d';
    const partialUpdate = {
      titulo: "Ingeniero DevOps Semi-Senior",
      empresa: "CloudTech",
    };
    const oldjob = await fetch(`${BASE_URL}/jobs/${idReal}`);
    const response = await fetch(`${BASE_URL}/jobs/${idReal}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(partialUpdate)
    });
    assert.strictEqual(response.status, 204, 'Status debe ser 204');
    
    console.log("🛑 RESPUESTA DE GET BY ID:", response.status);

    const responseGet = await fetch(`${BASE_URL}/jobs/${idReal}`);
    const json = await responseGet.json();
    
    assert.strictEqual(json.titulo, partialUpdate.titulo, 'El título del trabajo actualizado debe coincidir con el enviado');
    assert.strictEqual(json.empresa, partialUpdate.empresa, 'La empresa del trabajo actualizado debe coincidir con el enviado');
    assert.strictEqual(oldjob.descripcion, responseGet.descripcion, 'La descripción del trabajo no actualizado debe permanecer igual');
    assert.strictEqual(oldjob.ubicacion, responseGet.ubicacion, 'La ubicación del trabajo no actualizada debe permanecer igual');

    
  });
});

describe('DELETE /jobs/:id', () => {
  test('Debe eliminar un trabajo existente y devolver status 204', async () => {
    const idReal = 'e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d';
    const response = await fetch(`${BASE_URL}/jobs/${idReal}`, {
      method: 'DELETE'
    });
    assert.strictEqual(response.status, 204, 'Status debe ser 204');
    console.log("🛑 RESPUESTA DE GET BY ID:", response.status);

    const responseGet = await fetch(`${BASE_URL}/jobs/${idReal}`);

  });
});
