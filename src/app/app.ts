import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
    type ZodTypeProvider,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'
import { swaggerOptions } from '../shared/plugins/swagger'
import { routes } from './routes/routes'

export async function buildApp() {
    const app = fastify({
        logger: {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss',
                    ignore: 'pid,hostname',
                },
            },
        },
    }).withTypeProvider<ZodTypeProvider>()

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    app.register(fastifyCors, {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })

    app.register(fastifySwagger, swaggerOptions)
    app.register(fastifySwaggerUi, {
        routePrefix: '/docs',
    })

    app.register(routes)

    return app
}