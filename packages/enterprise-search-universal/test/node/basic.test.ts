/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import 'cross-fetch/polyfill'
import test from 'tape'
import * as http from 'http'
import { AbortController } from 'node-abort-controller'
import { Client } from '../../src/client'

type ServerHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void
function buildServer (handler: ServerHandler): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler)
    server.listen(0, () => {
      resolve(server)
    })
  })
}

test('Basic', async t => {
  t.plan(6)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'GET')
    t.equal(req.url, '/')
    t.equal(req.headers.authorization, 'token')
    const reg = /^[a-z]{1,}=[a-z0-9\.\-]{1,}(?:,[a-z]{1,}=[a-z0-9\.\-]+)*$/ // eslint-disable-line
    // @ts-expect-error
    t.ok(reg.test(req.headers['x-elastic-client-meta']))
    t.ok(req.headers['x-elastic-client-meta']?.includes('jsu'))
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.transportRequest<{ hello: string }>({ method: 'GET', path: '/' })
  t.same(response, { hello: 'world' })
  server.close()
})

test('Disable meta header', async t => {
  t.plan(2)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.headers['x-elastic-client-meta'], undefined)
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token',
    enableMetaHeader: false
  })

  const response = await client.transportRequest<{ hello: string }>({ method: 'GET', path: '/' })
  t.same(response, { hello: 'world' })
  server.close()
})

test('Abort a request', async t => {
  t.plan(1)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    setTimeout(() => {
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ hello: 'world' }))
    }, 1000)
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const controller = new AbortController()
  setTimeout(() => controller.abort(), 100)
  try {
    await client.transportRequest<{ hello: string }>({ method: 'GET', path: '/' }, { signal: controller.signal })
    t.fail('Should throw')
  } catch (err: any) {
    t.equal(err.name, 'AbortError')
  }
  server.close()
})

test('Array querystring', async t => {
  t.plan(4)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'GET')
    // @ts-ignore
    t.equal(decodeURIComponent(req.url), '/?foo=bar&baz[]=1&baz[]=2&baz[]=3')
    t.equal(req.headers.authorization, 'token')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.transportRequest<{ hello: string }>({
    method: 'GET',
    path: '/',
    querystring: {
      foo: 'bar',
      baz: [1, 2, 3]
    }
  })
  t.same(response, { hello: 'world' })
  server.close()
})

test('Object querystring', async t => {
  t.plan(4)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'GET')
    // @ts-ignore
    t.equal(decodeURIComponent(req.url), '/?page[size]=0&page[current]=1')
    t.equal(req.headers.authorization, 'token')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.transportRequest<{ hello: string }>({
    method: 'GET',
    path: '/',
    querystring: {
      page: {
        size: 0,
        current: 1
      }
    }
  })
  t.same(response, { hello: 'world' })
  server.close()
})

test('Search', async t => {
  t.plan(4)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'POST')
    t.equal(req.url, '/api/as/v1/engines/test/search')
    t.equal(req.headers.authorization, 'token')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.app.search({
    engine_name: 'test',
    body: { query: 'hello' }
  })
  t.same(response, { hello: 'world' })
  server.close()
})

test('LogClickthrough', async t => {
  t.plan(4)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'POST')
    t.equal(req.url, '/api/as/v1/engines/test/click')
    t.equal(req.headers.authorization, 'token')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.app.logClickthrough({
    engine_name: 'test',
    body: { query: 'hello', document_id: 'world' }
  })
  t.same(response, { hello: 'world' })
  server.close()
})

test('QuerySuggestion', async t => {
  t.plan(4)

  function handler (req: http.IncomingMessage, res: http.ServerResponse): void {
    t.equal(req.method, 'POST')
    t.equal(req.url, '/api/as/v1/engines/test/query_suggestion')
    t.equal(req.headers.authorization, 'token')
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ hello: 'world' }))
  }

  const server = await buildServer(handler)
  const client = new Client({
    // @ts-expect-error
    url: `http://localhost:${server.address().port}`,
    token: 'token'
  })

  const response = await client.app.querySuggestion({
    engine_name: 'test',
    body: { query: 'hello' }
  })
  t.same(response, { hello: 'world' })
  server.close()
})
