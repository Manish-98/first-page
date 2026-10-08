import { describe, expect, it } from 'vitest'
import { createCv } from './cv'

describe('createCv', () => {
  it('normalizes valid author input into a CV model', () => {
    expect(createCv(' Ada Lovelace ', ' Mathematician ')).toEqual({ name: 'Ada Lovelace', headline: 'Mathematician' })
  })

  it('rejects an empty headline', () => {
    expect(() => createCv('Ada Lovelace', ' ')).toThrow('Headline is required.')
  })
})
