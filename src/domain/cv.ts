export type Cv = Readonly<{ name: string; headline: string }>

export function createCv(name: string, headline: string): Cv {
  const normalizedName = name.trim()
  const normalizedHeadline = headline.trim()
  if (!normalizedName) throw new Error('Name is required.')
  if (!normalizedHeadline) throw new Error('Headline is required.')
  return Object.freeze({ name: normalizedName, headline: normalizedHeadline })
}
