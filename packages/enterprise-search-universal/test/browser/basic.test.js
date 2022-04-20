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

const test = require('tape')
const { Client, ResponseError } = require('../../lib/client')

test('Basic', async t => {
  t.plan(1)

  const client = new Client({
    url: 'http://localhost:3000',
    token: 'token'
  })

  const response = await client.transportRequest({ method: 'GET', path: '/' })
  t.same(response, { hello: 'world' })
})

test('Querystring array', async t => {
  t.plan(1)

  const client = new Client({
    url: 'http://localhost:3000',
    token: 'token'
  })

  const response = await client.transportRequest({
    method: 'GET',
    path: '/query/array',
    querystring: {
      foo: 'bar',
      baz: [1, 2, 3]
    }
  })
  t.same(response, { valid: true })
})

test('Querystring object', async t => {
  t.plan(1)

  const client = new Client({
    url: 'http://localhost:3000',
    token: 'token'
  })

  const response = await client.transportRequest({
    method: 'GET',
    path: '/query/object',
    querystring: {
      page: {
        size: 0,
        current: 1
      }
    }
  })
  t.same(response, { valid: true })
})

test('Request body', async t => {
  t.plan(1)

  const client = new Client({
    url: 'http://localhost:3000',
    token: 'token'
  })

  const response = await client.transportRequest({
    method: 'POST',
    path: '/body',
    body: { foo: 'bar' }
  })
  t.same(response, { foo: 'bar' })
})

test('Disable meta header', async t => {
  t.plan(4)

  const client = new Client({
    url: 'http://localhost:3000',
    token: 'token',
    enableMetaHeader: false
  })

  try {
    await client.transportRequest({ method: 'GET', path: '/' })
    t.fail('Should throw')
  } catch (err) {
    t.ok(err instanceof ResponseError)
    t.equal(err.message, 'Bad x-elastic-client-meta header')
    t.equal(err.statusCode, 400)
    t.equal(err.body, 'Bad x-elastic-client-meta header')
  }
})
