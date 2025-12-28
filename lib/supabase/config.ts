function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const supabaseConfig = {
  get url() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_URL')
  },
  get publishableKey() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  },
}
