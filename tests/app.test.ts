import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app.js'

const { isDatabaseReady } = vi.hoisted(() => ({
  isDatabaseReady: vi.fn<() => Promise<boolean>>(),
}))

vi.mock('../src/health/service.js', () => ({ isDatabaseReady }))

describe('health endpoints', () => {
  beforeEach(() => {
    isDatabaseReady.mockReset().mockResolvedValue(true)
  })

  it('reports liveness without calling the database', async () => {
    // Arrange
    const app = createApp()

    // Act
    const response = await app.request('/health/live')

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
    expect(isDatabaseReady).not.toHaveBeenCalled()
    expect(response.headers.get('x-request-id')).toBeTruthy()
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('reports readiness when the database is available', async () => {
    // Arrange
    const app = createApp()

    // Act
    const response = await app.request('/health/ready')

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('hides database errors when readiness fails', async () => {
    // Arrange
    isDatabaseReady.mockResolvedValue(false)
    const app = createApp()

    // Act
    const response = await app.request('/health/ready')

    // Assert
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ status: 'unavailable' })
  })

  it('returns a structured not-found response', async () => {
    // Arrange
    const app = createApp()

    // Act
    const response = await app.request('/missing')

    // Assert
    expect(response.status).toBe(404)
    expect(await response.json()).toMatchObject({
      title: 'Not Found',
      status: 404,
      requestId: response.headers.get('x-request-id'),
    })
  })

  it('does not expose unexpected error details', async () => {
    // Arrange
    const app = createApp()
    app.get('/error', () => {
      throw new Error('secret-value')
    })

    // Act
    const response = await app.request('/error')

    // Assert
    expect(response.status).toBe(500)
    expect(await response.text()).not.toContain('secret-value')
  })
})
