import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createCv } from '../src/domain/cv'

const domainRoot = new URL('../src/domain/', import.meta.url)

test('domain use case creates the expected model', () => {
  assert.deepEqual(createCv(' Ada Lovelace ', ' Mathematician '), { name: 'Ada Lovelace', headline: 'Mathematician' })
})

test('domain rejects an invalid empty name without browser or infrastructure dependencies', () => {
  assert.throws(() => createCv(' ', 'Engineer'), /Name is required/)
})

test('domain modules do not import UI, browser, AI, or PDF dependencies', async () => {
  const forbidden = /from ['\"][^'\"]*(ui|browser|ai|pdf)[^'\"]*['\"]|from ['\"](react|react-dom|vite)/i
  for (const file of (await readdir(domainRoot)).filter((name) => name.endsWith('.ts'))) {
    const source = await readFile(new URL(file, domainRoot), 'utf8')
    assert.doesNotMatch(source, forbidden, file)
  }
})
