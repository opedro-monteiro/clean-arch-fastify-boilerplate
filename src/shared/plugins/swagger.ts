import { jsonSchemaTransform } from "fastify-type-provider-zod"
import { env } from "../../config/env"

export const swaggerOptions = {
    swagger: {
        info: {
            title: 'Clean Fastify API',
            description: 'API documentation',
            version: '1.0.0'
        },
        host: 'localhost:3333',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        servers: [
            {
                url: env.BASE_URL,
                description: 'Local',
            },
        ],
    },
    transform: jsonSchemaTransform,
}