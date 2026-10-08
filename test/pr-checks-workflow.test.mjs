import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('PR workflow exposes separate quality checks', async () => {
  const workflow = await readFile('.github/workflows/pr-checks.yml', 'utf8')
  for (const name of ['format:', 'lint:', 'typecheck:', 'test:', 'build:']) assert.ok(workflow.includes('  ' + name))
  for (const command of ['npm run format:check', 'npm run lint', 'npm run typecheck', 'npm test', 'npm run build']) assert.ok(workflow.includes(command))
  assert.ok(workflow.includes('pull_request:'))
})
