<p align="center">
  <a href="https://github.com/elastic/enterprise-search-js">
    <img src="https://github.com/elastic/enterprise-search-js/raw/main/packages/enterprise-search/test/fixtures/elastic-enterprise-search-logo.png" width="70%" alt="Elastic Enterprise Search" />
  </a>
</p>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![Build Status](https://clients-ci.elastic.co/buildStatus/icon?job=elastic%2Benterprise-search-js%2Bmain)](https://clients-ci.elastic.co/job/elastic+enterprise-search-js+main/). [![Node CI](https://github.com/elastic/enterprise-search-js/actions/workflows/nodejs.yml/badge.svg)](https://github.com/elastic/enterprise-search-js/actions/workflows/nodejs.yml)


Official Node.js client for Elastic Enterprise Search, App Search, and Workplace Search.

:information_source: Read the [full documentation](https://www.elastic.co/guide/en/enterprise-search-clients/enterprise-search-node/8.6/index.html) for this client at **elastic.co**.

## Install
```
npm install @elastic/enterprise-search
```

## Quick start

```js
const { Client } = require('@elastic/enterprise-search')
const client = new Client({
  url: 'http://localhost:3002',
  // basic auth
  auth: {
    username: 'elastic',
    password: 'changeme'
  }
  // bearer auth
  auth: {
    token: 'my-token'
  }
})

// Enterprise Search API
const response = await client.enterprise.getHealth()
console.log(response)

// App Search API
const response = await client.app.search({
  engine_name: 'games',
  body: {
    query: 'Pack-Man'
  }
})
console.log(response)

// Workplace Search API
const response = await client.workplace.getDocument({
  content_source_id: 'test',
  document_id: 'id'
})
console.log(response)
```

## License

This software is licensed under the [Apache 2 license](./LICENSE).
