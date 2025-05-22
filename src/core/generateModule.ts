import fs from 'fs'
import path from 'path'

const baseDir = path.resolve('src/modules')

const folders = [
  'controllers',
  'entities',
  'repositories',
  'routes',
  'schemas',
  'services',
]

const templates: Record<string, (name: string) => string> = {
  controllers: (name) => `export class ${name}Controller {
  async example() {
    return { message: '${name} works!' }
  }
}`,
  entities: (name) => `export interface ${name}Entity {
  id: string
  // define properties
}`,
  repositories: (name) => `export class ${name}Repository {
  // your database logic here
}`,
  routes: (name) => `import { FastifyInstance } from 'fastify'
import { ${name}Controller } from '../controllers/${name}.controller'

export async function ${name}Routes(app: FastifyInstance) {
  const controller = new ${name}Controller()
  app.get('/${name.toLowerCase()}', controller.example)
}`,
  schemas: (name) => `import { z } from 'zod'

export const ${name}Schema = z.object({
  // define schema
})`,
  services: (name) => `export class ${name}Service {
  // business logic
}`,
}

export function generateModule(moduleName: string) {
  const moduleDir = path.join(baseDir, moduleName)

  if (fs.existsSync(moduleDir)) {
    console.error(`❌ Módulo "${moduleName}" já existe.`)
    return
  }

  fs.mkdirSync(moduleDir, { recursive: true })

  folders.forEach((folder) => {
    const folderPath = path.join(moduleDir, folder)
    fs.mkdirSync(folderPath, { recursive: true })

    const fileName = `${moduleName}.${folder.slice(0, -1)}.ts`
    const filePath = path.join(folderPath, fileName)
    const content = templates[folder](capitalize(moduleName))

    fs.writeFileSync(filePath, content)
  })

  console.log(`✅ Módulo "${moduleName}" criado com sucesso.`)
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
