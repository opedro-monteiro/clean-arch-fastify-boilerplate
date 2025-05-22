import { generateModule } from './core/generateModule'

const args = process.argv.slice(2)

if (args[0] === 'generate' && args[1]) {
  generateModule(args[1])
}
