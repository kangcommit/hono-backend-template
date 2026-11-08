import { checkDatabaseConnection } from './repository.js'

export async function isDatabaseReady() {
  try {
    await checkDatabaseConnection()
    return true
  } catch {
    return false
  }
}
