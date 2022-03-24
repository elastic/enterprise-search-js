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

const http = require('http')

const server = http.createServer(handler)
server.listen(process.env.PORT || 3000)

const supportedMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
]

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': supportedMethods.join(', '),
  'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
  'Access-Control-Max-Age': 2592000
}

function handler (req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
  } else if (supportedMethods.includes(req.method)) {
    res.writeHead(200, {
      ...headers,
      'content-type': 'application/json'
    })
    res.end(JSON.stringify({ hello: 'world' }))
  } else {
    res.writeHead(405, {
      ...headers,
      'content-type': 'text/plain'
    })
    res.end(`${req.method} is not supported`)
  }
}
