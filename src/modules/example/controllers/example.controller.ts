import { FastifyInstance } from 'fastify'
import { ExampleRepository } from '../repositories/example.repository'
import { ExampleService } from '../services/example.service'
import { createExampleSchema } from '../schemas/example.schema'

export async function exampleController(app: FastifyInstance) {
  const repository = new ExampleRepository()
  const service = new ExampleService(repository)

  app.post('/example', async (request, reply) => {
    const body = createExampleSchema.parse(request.body)
    const result = await service.create(body)
    return reply.code(201).send(result)
  })

  app.get('/example', async (request, reply) => {
    const result = await service.list()
    return reply.send(result)
  })
}
