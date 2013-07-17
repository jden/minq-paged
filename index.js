var Q = require('q')

// dep won't be required once https://github.com/jden/minq/issues/8
var minq = require('minq')

function minqPaged (query) {
  if (!(this instanceof minqPaged)) {
    return new minqPaged(query)
  }
  this._query = query
}

minqPaged.prototype.toArray = function () {
  var orig = this._query
  // run the same query as a count
  var count = minq(orig._.db)
    .from(orig._.collection)
    .where(orig._.query)
    .count()

  // force the query
  var query = orig.toArray()

  return Q.spread([count, query],
    function (count, resultSet) {
      // add paged properties to resultSet
      resultSet.totalLength = count
      resultSet.limit = orig._.options.limit
      resultSet.skip = orig._.options.skip
      resultSet.nextSkip = resultSet.skip + resultSet.length
      resultSet.sortOrder = orig._.options.sort
      return resultSet
    })
}

module.exports = minqPaged