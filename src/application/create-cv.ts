import { createCv, type Cv } from '../domain/cv'

export function createCvDraft(name: string, headline: string): Cv {
  return createCv(name, headline)
}
