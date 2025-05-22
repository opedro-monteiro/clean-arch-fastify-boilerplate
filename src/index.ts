#!/usr/bin/env node
import { Command } from 'commander';
import { generateModule } from './core/generateModule'; // Exemplo de função

const program = new Command();

program
  .name('fastify-clean')
  .description('CLI para gerar módulos com clean architecture e Fastify')
  .version('1.0.0');

program
  .command('generate <name>')
  .description('Gera um novo módulo com estrutura padrão')
  .action((name) => {
    generateModule(name.toLowerCase())
  })

program.parse(process.argv)