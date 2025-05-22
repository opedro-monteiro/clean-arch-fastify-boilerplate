import { Example } from '../entities/example.entity'

export class ExampleRepository {
  private data: Example[] = []

  async create(example: Example): Promise<void> {
    this.data.push(example)
  }

  async findAll(): Promise<Example[]> {
    return this.data
  }
}
