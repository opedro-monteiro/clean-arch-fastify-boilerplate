
import type { FastifyTypedInstance } from './types'

export async function routes(app: FastifyTypedInstance) {
    app.register(bookRoutes, { prefix: '/api/v1' })
}
