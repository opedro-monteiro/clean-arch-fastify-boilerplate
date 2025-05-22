import { Example } from '../entities/example.entity'
import { ExampleRepository } from '../repositories/example.repository'
import { CreateExampleDTO } from '../schemas/example.schema'
import { randomUUID } from 'node:crypto'

export class ExampleService {
  constructor(private readonly repository: ExampleRepository) {}

  async create(data: CreateExampleDTO): Promise<Example> {
    const example: Example = {
      id: randomUUID(),
      name: data.name,
      createdAt: new Date(),
    }

    await this.repository.create(example)
    return example
  }

  async list(): Promise<Example[]> {
    return this.repository.findAll()
  }
}
