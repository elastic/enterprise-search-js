<p align="center">
  <a href="https://github.com/elastic/enterprise-search-js">
    <img src="https://raw.githubusercontent.com/elastic/enterprise-search-js/main/test/fixtures/elastic-enterprise-search-logo.png" width="70%" alt="Elastic Enterprise Search" />
  </a>
</p>


Official Node.js client for Elastic Enterprise Search, App Search, and Workplace Search.

## Install
```
npm install @elastic/enterprise-search
```

## Quick start

```js
const { Client } = require('@elastic/enterprise-search')
const client = new Client({
    url: 'http://localhost:3002',
    auth: {
      username: 'elastic',
      password: 'changeme'
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
