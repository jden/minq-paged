var chai = require('chai')
chai.should()
var moquire = require('moquire')
var rope = require('rope')
var sinon = require('sinon')
chai.use(require('sinon-chai'))
var Q = require('q')

describe('minq-paged', function () {
  var minqPaged = require('../')
  
  it('returns instances', function () {
    minqPaged().should.be.instanceof(minqPaged)
    minqPaged().toArray.should.be.a('function')
  })

  it('issues an additional query to grab the count', function (done) {

    // working around a `rope` limitation for now
    // should be solved in https://github.com/jden/minq/issues/8
    var minqSpy = rope()
      .stub({data: 50})
      .minq()
    var spy = function (db) {
      db.should.equal(mockQuery.db)
      return minqSpy
    }


    var minqPaged = moquire('../', {minq: spy})

    var mockQuery = {
      db: {},
      collection: 'plays',
      query: {
        category: 'history'
      },
      options: {
        limit: 3,
        skip: 0,
        sort: {name: 1}
      },
      toArray: sinon.stub().returns(Q([
        {name: 'henry iv'},
        {name: 'henry viii'},
        {name: 'richard iii'}
      ]))
    }

    minqPaged(mockQuery)
      .toArray()
      .then(function (results) {

        mockQuery.toArray.should.have.been.calledOnce
        minqSpy.readQueries.length.should.equal(1)
        minqSpy.readQueries[0].type.should.equal('count')

        results.totalLength.should.equal(50)
        results.length.should.equal(3)
        results.limit.should.equal(3)
        results.skip.should.equal(0)
        results.nextSkip.should.equal(3)
        results.sortOrder.should.deep.equal({name: 1})
      })
      .then(done, done)

  })
})