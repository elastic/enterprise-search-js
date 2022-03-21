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

import { test } from 'tap'
import qs from 'qs'
import Serializer from '../../lib/Serializer'

test('qserialize', t => {
  t.plan(1)
  const s = new Serializer()
  const obj = {
    hello: 'world',
    you_know: 'for search'
  }

  t.equal(
    s.qserialize(obj),
    qs.stringify(obj)
  )
})

test('qserialize array', t => {
  t.plan(1)
  const s = new Serializer()
  const obj = {
    foo: 'bar',
    baz: [1, 2, 3]
  }

  t.equal(
    s.qserialize(obj),
    'foo=bar&baz%5B%5D=1&baz%5B%5D=2&baz%5B%5D=3'
  )
})

test('qserialize nested object', t => {
  t.plan(1)
  const s = new Serializer()
  const obj = {
    page: {
      size: 0,
      current: 1
    }
  }

  t.equal(
    s.qserialize(obj),
    'page%5Bsize%5D=0&page%5Bcurrent%5D=1'
  )
})
