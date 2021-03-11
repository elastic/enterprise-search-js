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

import dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(__dirname, '.env') })

export function getEntCredentials (): { username: string, password: string } {
  const username = process.env.TEST_ENT_USERNAME
  const password = process.env.TEST_ENT_PASSWORD

  if (username == null) {
    console.error('Missing enterprise search username')
    process.exit(1)
  }

  if (password == null) {
    console.error('Missing enterprise search password')
    process.exit(1)
  }

  return { username, password }
}

export function getAppCredentials (): string {
  const token = process.env.TEST_APP_TOKEN

  if (token == null) {
    console.error('Missing app search token')
    process.exit(1)
  }

  return token
}

export function getWorkCredentials (): string {
  const token = process.env.TEST_WORK_TOKEN

  if (token == null) {
    console.error('Missing workplace search token')
    process.exit(1)
  }

  return token
}

export function getWorkContentSourceId (): string {
  const contentSourceId = process.env.TEST_WORK_CONTENT_SOURCE_ID

  if (contentSourceId == null) {
    console.error('Missing workplace search content source id')
    process.exit(1)
  }

  return contentSourceId
}

export function getServiceUrl (): string {
  const url = process.env.TEST_URL

  if (url == null) {
    console.error('Missing service url')
    process.exit(1)
  }

  return url
}
