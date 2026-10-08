import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('Vite application has a browser entry point', async () => {
  const html = await readFile('index.html', 'utf8')
  assert.match(html, /src\\/main\\.tsx/)
})
