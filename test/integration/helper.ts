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

import { promisify } from 'util'
import { customAlphabet } from 'nanoid'
import { Client } from '../..'

const sleep = promisify(setTimeout)
const genName = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)
const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

export { genName, sleep }

export async function createEngine (name = genName()): Promise<string> {
  const client = new Client({ url, auth: { username, password } })
  await client.app.createEngine({ body: { name } })
  await client.close()
  return name
}

export async function createCuration (engineName: string, queries: string[], promoted: string[], hidden: string[]): Promise<string> {
  const client = new Client({ url, auth: { username, password } })
  const curation = await client.app.createCuration({
    engine_name: engineName,
    body: {
      queries,
      promoted,
      hidden
    }
  })
  await client.close()
  await sleep(500)
  return curation.id
}

export async function deleteEngines (name?: string): Promise<void> {
  const client = new Client({ url, auth: { username, password } })
  if (typeof name === 'string') {
    await client.app.deleteEngine({ engine_name: name })
  } else {
    const { results } = await client.app.listEngines()
    for (const { name } of results) {
      await client.app.deleteEngine({ engine_name: name })
    }
  }
  await client.close()
}

export async function cleanup (): Promise<void> {
  const client = new Client({ url, auth: { username, password } })

  const engines = await client.app.listEngines()
  for (const { name } of engines.results) {
    await client.app.deleteEngine({ engine_name: name })
  }

  const apiKeys = await client.app.listApiKeys()
  for (const { name } of apiKeys.results) {
    await client.app.deleteApiKey({ api_key_name: name })
  }
}
