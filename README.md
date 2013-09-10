# minq-paged
return a paged query result set from a minq query

## usage
```js
var minq = require('minq')
var minqPaged = require('minq-paged')

// assume minq.connect() is called or another db connection is supplied

minqPaged(minq.from('plays')
  .where({category: 'history'})
  .limit(10))
  .toArray()
  .then(function (results) {

  console.log(results.length)
  // => 10
  console.log(results.totalLength)
  // => 54

  console.log(results.documents)
  // => the results of the original query

  })

```

minqPaged makes it convenient to run a paginated query and also return a count of the total resultSet. This involves running a second `count` query using the same `where` clause. This module adds `totalLength`, as well as other pagination properties, to the result set array.

## api

using [jsig](https://github.com/jden/jsig)

`minqPaged: (query: [minq/Query](https://github.com/jden/minq#queryfromcollectionname-string--query)) => PagedQuery`

```
type PagedQuery: {
  toArray: () => Promise<PagedResultSet>
}

type PagedResultSet: {
  results: Array,
  totalLength: Int,
  limit: Int?,
  skip: Int?,
  nextSkip: Int,
  sortOrder: Object?
}

```

## installation

    $ npm install minq-paged


## running the tests

From package root:

    $ npm install
    $ npm test


## contributors

- jden <jason@denizac.org>


## license

MIT. (c) 2013 jden <jason@denizac.org>. See LICENSE.md
