import { createHash } from 'node:crypto'

const SALT = process.env.ANONYMOUS_ID_SALT || 'ironizi-default-salt'
const FREE_ROAST_LIMIT = 3

export function generateAnonymousId(ip: string): string {
  return createHash('sha256').update(`${SALT}:${ip}`).digest('hex').slice(0, 32)
}

export function isWithinFreeLimit(roastCount: number): boolean {
  return roastCount < FREE_ROAST_LIMIT
}

export const FREE_LIMIT = FREE_ROAST_LIMIT
