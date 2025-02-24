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

'use strict'

const {
  errors
} = require('@elastic/transport')

console.warn(`Starting with Elastic version 9.0, the standalone Enterprise Search products, will no longer be included in our offering. They remain supported in their current form in version 8.x and will only receive security upgrades and fixes. Enterprise Search clients will continue to be supported in their current form throughout 8.x versions, according to our EOL policy (https://www.elastic.co/support/eol).

We recommend transitioning to our actively developed Elastic Stack (https://www.elastic.co/elastic-stack) tools for your search use cases. However, if you're still using any Enterprise Search products, we recommend using the latest stable release of the clients.`)

const { default: Client } = require('./lib')

module.exports = {
  Client,
  errors
}
