import fs from 'fs'
import path from 'path'

const basePath = path.resolve('src', 'modules')

const templates = {
  entity: (name: string) => `export interface ${name}Entity {
  id: string
  name: string
  email: string
}
`,

  schema: (name: string) => `import { z } from 'zod'

export const create${name}Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export type Create${name}Dto = z.infer<typeof create${name}Schema>
`,

  repository: (name: string) => `import { ${name}Entity } from '../entities/${name.toLowerCase()}.entity'

export class ${name}Repository {
  private ${name.toLowerCase()}s: ${name}Entity[] = []

  findAll(): ${name}Entity[] {
    return this.${name.toLowerCase()}s
  }

  create(${name.toLowerCase()}: ${name}Entity): ${name}Entity {
    this.${name.toLowerCase()}s.push(${name.toLowerCase()})
    return ${name.toLowerCase()}
  }
}
`,

  service: (name: string) => `import { ${name}Repository } from '../repositories/${name.toLowerCase()}.repository'
import { Create${name}Dto } from '../schemas/${name.toLowerCase()}.schema'
import { randomUUID } from 'crypto'

export class ${name}Service {
  private repo = new ${name}Repository()

  getAll() {
    return this.repo.findAll()
  }

  create(data: Create${name}Dto) {
    const ${name.toLowerCase()} = {
      id: randomUUID(),
      ...data,
    }
    return this.repo.create(${name.toLowerCase()})
  }
}
`,

  controller: (name: string) => `import { FastifyRequest, FastifyReply } from 'fastify'
import { ${name}Service } from '../services/${name.toLowerCase()}.service'
import { create${name}Schema } from '../schemas/${name.toLowerCase()}.schema'

export class ${name}Controller {
  private service = new ${name}Service()

  getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    const data = this.service.getAll()
    reply.send(data)
  }

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = await create${name}Schema.parseAsync(req.body)
    const result = this.service.create(body)
    reply.code(201).send(result)
  }
}
`,

  routes: (name: string) => `import { FastifyInstance } from 'fastify'
import { ${name}Controller } from '../controllers/${name.toLowerCase()}.controller'

export async function ${name.toLowerCase()}Routes(app: FastifyInstance) {
  const controller = new ${name}Controller()

  app.get('/${name.toLowerCase()}', controller.getAll)
  app.post('/${name.toLowerCase()}', controller.create)
}
`,
}

function createFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content)
  console.log(`✓ Created ${filePath}`)
}

function generateModule(nameRaw: string) {
  const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1).toLowerCase()
  const folder = path.join(basePath, nameRaw.toLowerCase())

  const structure = [
    'controllers',
    'entities',
    'repositories',
    'routes',
    'schemas',
    'services',
  ]

  const dirToTemplateMap: Record<string, keyof typeof templates> = {
    controllers: 'controller',
    entities: 'entity',
    repositories: 'repository',
    routes: 'routes',
    schemas: 'schema',
    services: 'service',
  }

  structure.forEach((dir) => {
    const dirPath = path.join(folder, dir)
    fs.mkdirSync(dirPath, { recursive: true })

    const fileName = `${nameRaw.toLowerCase()}.${dirToTemplateMap[dir]}.ts`
    const filePath = path.join(dirPath, fileName)

    const templateKey = dirToTemplateMap[dir]
    const template = templates[templateKey]

    if (template) {
      const content = template(name)
      createFile(filePath, content)
    }
  })
}

const args = process.argv.slice(2)

if (args[0] === 'generate' && args[1]) {
  generateModule(args[1])
} else {
  console.error('❌ Use: fastify-clean generate <moduleName>')
}

export { generateModule }
