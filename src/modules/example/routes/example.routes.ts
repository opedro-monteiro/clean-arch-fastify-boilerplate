import { FastifyInstance } from 'fastify'
import { exampleController } from '../controllers/example.controller'

export async function exampleRoutes(app: FastifyInstance) {
  app.register(exampleController, { prefix: '/example' })
}
