import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('documented development commands match package scripts', async () => {
  const readme = await readFile('README.md', 'utf8')
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))
  for (const command of ['dev', 'build', 'preview', 'format:check', 'lint', 'typecheck', 'test']) {
    assert.ok(pkg.scripts[command], command + ' script is missing')
    assert.match(readme, new RegExp('npm (run )?' + command.replace(':', '\\:')))
  }
  assert.doesNotMatch(readme, /API_KEY|SECRET|TOKEN|PASSWORD/)
})
