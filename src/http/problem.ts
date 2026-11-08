import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export function problemResponse(c: Context, status: ContentfulStatusCode, title: string) {
  return c.json(
    {
      type: 'about:blank',
      title,
      status,
      instance: c.req.path,
      requestId: c.get('requestId'),
    },
    status,
    { 'Content-Type': 'application/problem+json' },
  )
}
