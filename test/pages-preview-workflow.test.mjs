import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('Pages preview workflow provides distinct per-PR deployments', async () => {
  const workflow = await readFile('.github/workflows/pages-preview.yml', 'utf8')
  assert.match(workflow, /pull_request:/)
  assert.match(workflow, /preview-branch: gh-pages/)
  assert.match(workflow, /umbrella-dir: pr-preview/)
  assert.match(workflow, /action: auto/)
  assert.match(workflow, /wait-for-pages-deployment: true/)
  assert.match(workflow, /types: \\[opened, reopened, synchronize, closed\\]/)
})
