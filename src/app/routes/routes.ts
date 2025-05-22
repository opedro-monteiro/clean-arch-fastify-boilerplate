import { FastifyInstance } from 'fastify'
import { exampleRoutes } from '../../modules/example/routes/example.routes'

export async function routes(app: FastifyInstance) {
    app.register(exampleRoutes, { prefix: '/api/v1' })
}
