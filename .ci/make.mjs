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

/* global $ argv, cd */

'use strict'

import 'zx/globals'

import { readFile, writeFile } from 'fs/promises'
import assert from 'assert'
import { join } from 'desm'
import semver from 'semver'

assert(typeof argv.task === 'string', 'Missing task parameter')

switch (argv.task) {
  case 'release':
    release(argv._).catch(onError)
    break
  case 'bump':
    bump(argv._).catch(onError)
    break
  default:
    console.log(`Unknown task: ${argv.task}`)
    process.exit(1)
}

async function release (args) {
  assert(args.length === 2, 'Release task expects two parameters')
  const rootPath = join(import.meta.url, '..')
  const enterpriseSearchPath = join(import.meta.url, '..', 'packages', 'enterprise-search')
  const enterpriseSearchUniversalPath = join(import.meta.url, '..', 'packages', 'enterprise-search-universal')
  let [version, outputFolder] = args

  if (process.env.WORKFLOW === 'snapshot' && !version.endsWith('SNAPSHOT')) {
    version = `${version}-SNAPSHOT`
  }

  await bump([version])

  // nodejs
  let packageJson = JSON.parse(await readFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search', 'package.json'),
    'utf8'
  ))

  cd(enterpriseSearchPath)
  await $`npm run build`
  await $`npm pack`
  cd(rootPath)
  await $`zip enterprise-search-js-${version}.zip ${join(import.meta.url, '..', 'packages', 'enterprise-search', `elastic-enterprise-search-${packageJson.version}.tgz`)}`
  await $`rm ${join(import.meta.url, '..', 'packages', 'enterprise-search', `elastic-enterprise-search-${packageJson.version}.tgz`)}`
  await $`mv ${join(import.meta.url, '..', `enterprise-search-js-${version}.zip`)} ${join(import.meta.url, '..', outputFolder, `enterprise-search-js-${version}.zip`)}`

  // universal
  packageJson = JSON.parse(await readFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search-universal', 'package.json'),
    'utf8'
  ))

  cd(enterpriseSearchUniversalPath)
  await $`npm pack`
  cd(rootPath)
  await $`zip enterprise-search-universal-js-${version}.zip ${join(import.meta.url, '..', 'packages', 'enterprise-search-universal', `elastic-enterprise-search-universal-${packageJson.version}.tgz`)}`
  await $`rm ${join(import.meta.url, '..', 'packages', 'enterprise-search-universal', `elastic-enterprise-search-universal-${packageJson.version}.tgz`)}`
  await $`mv ${join(import.meta.url, '..', `enterprise-search-universal-js-${version}.zip`)} ${join(import.meta.url, '..', outputFolder, `enterprise-search-universal-js-${version}.zip`)}`
}

async function bump (args) {
  assert(args.length === 1, 'Bump task expects one parameter')
  const [version] = args
  let packageJson = JSON.parse(await readFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search', 'package.json'),
    'utf8'
  ))

  const cleanVersion = semver.clean(version.includes('SNAPSHOT') ? version.split('-')[0] : version)
  assert(semver.valid(cleanVersion))
  packageJson.version = cleanVersion

  await writeFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search', 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  )

  packageJson = JSON.parse(await readFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search-universal', 'package.json'),
    'utf8'
  ))

  packageJson.version = cleanVersion

  await writeFile(
    join(import.meta.url, '..', 'packages', 'enterprise-search-universal', 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  )

  const testMatrix = await readFile(join(import.meta.url, 'test-matrix.yml'), 'utf8')
  await writeFile(
    join(import.meta.url, 'test-matrix.yml'),
    testMatrix.replace(/STACK_VERSION:\s+\- "[0-9]+[0-9\.]*[0-9](?:\-SNAPSHOT)?"/, `STACK_VERSION:\n  - "${cleanVersion}-SNAPSHOT"`), // eslint-disable-line
    'utf8'
  )
}

function onError (err) {
  console.log(err)
  process.exit(1)
}
