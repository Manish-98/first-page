import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const domainRoot = new URL('../src/domain/', import.meta.url)

test('domain use case has no UI, browser, AI, or PDF dependencies', async () => {
  const files = await readdir(domainRoot)
  const forbidden = /from ['\"][^'\"]*(ui|browser|ai|pdf)[^'\"]*['\"]|from ['\"](react|react-dom|vite|window|document)/i
  for (const file of files.filter((name) => name.endsWith('.ts'))) {
    const source = await readFile(new URL(file, domainRoot), 'utf8')
    assert.doesNotMatch(source, forbidden, file)
  }
})

test('domain rejects an invalid empty name while preserving pure boundaries', async () => {
  const source = await readFile(new URL('../src/domain/cv.ts', import.meta.url), 'utf8')
  assert.match(source, /Name is required/)
  assert.doesNotMatch(source, /document|window|React|pdf|ai/i)
})
