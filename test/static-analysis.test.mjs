import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('static-analysis commands are separate and strict', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))
  assert.equal(pkg.scripts.format, 'prettier --write .')
  assert.equal(pkg.scripts['format:check'], 'prettier --check .')
  assert.equal(pkg.scripts.lint, 'eslint .')
  assert.equal(pkg.scripts.typecheck, 'tsc --noEmit')
  assert.match(pkg.scripts.test, /test/)
  assert.match(pkg.scripts.build, /vite build/)
})
