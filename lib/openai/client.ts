import OpenAI from 'openai'

function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const openai = new OpenAI({
  apiKey: getEnvVar('OPENAI_API_KEY'),
})

export const MODEL_VERSION = 'gpt-4o-mini'
