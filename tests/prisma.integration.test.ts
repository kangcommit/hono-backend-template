import { afterAll, describe, expect, it } from 'vitest'
import { prisma } from '../src/db/prisma.js'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('PostgreSQL integration', () => {
  it('executes a query through the Prisma adapter', async () => {
    // Act
    const rows = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1::int AS value`

    // Assert
    expect(rows).toEqual([{ value: 1 }])
  })
})
