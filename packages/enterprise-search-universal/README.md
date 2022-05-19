<p align="center">
  <a href="https://github.com/elastic/enterprise-search-js">
    <img src="https://github.com/elastic/enterprise-search-js/raw/main/packages/enterprise-search/test/fixtures/elastic-enterprise-search-logo.png" width="70%" alt="Elastic Enterprise Search" />
  </a>
</p>

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)  [![Build Status](https://clients-ci.elastic.co/buildStatus/icon?job=elastic%2Benterprise-search-js%2Bmain)](https://clients-ci.elastic.co/job/elastic+enterprise-search-js+main/). [![Universal CI](https://github.com/elastic/enterprise-search-js/actions/workflows/universal.yml/badge.svg)](https://github.com/elastic/enterprise-search-js/actions/workflows/universal.yml)


Official universal JavaScript client for Elastic App Search and Workplace Search.

## Install
```
npm install @elastic/enterprise-search-universal
```

## Quick start

This module expects to find the `fetch` API in the global environment, if you need to use it in Node.js
as well, you can add it with [`cross-fetch`](https://github.com/lquixada/cross-fetch).

```js
const { Client } = require('@elastic/enterprise-search-universal')
const client = new Client({
  url: 'http://localhost:3002',
  token: 'my-token'
})

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
