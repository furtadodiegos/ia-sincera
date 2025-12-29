import { GoogleGenerativeAI } from '@google/generative-ai'

function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const genAI = new GoogleGenerativeAI(getEnvVar('GEMINI_API_KEY'))

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

export const MODEL_VERSION = 'gemini-2.5-flash'
