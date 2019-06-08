import { dasherize } from '@ember/string';

export default function() {
  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing
  this.namespace = '/api';

  let users = [
    {
        id: 46,
        type: 'users',
        attributes: {
          'first-name': 'Abdiel',
          'last-name': 'Dovie',
          address: 'anywhere',
          country: 'USA',
          state: 'Iowa',
          email: 'abdiel.dovie@gm.com',
          username: 'adovie',
          bio: 'whatever',
          color: '#9C27B0'
        }
    },
    {
        id: 47,
        type: 'users',
        attributes: {
          'first-name': 'Benny',
          'last-name': 'Hill',
          address: 'Porkshire Ln',
          country: 'UK',
          state: 'Wales',
          email: 'bhill@gm.com',
          username: 'bhill',
          bio: 'whatever',
          color: '#9C27B0'
        }
    }
  ];

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
  */
  this.get('/users', function(db, request) {
    let ret = null;
    let qName = request.queryParams.name;

    let sortAttr = request.queryParams.sort;

    let dir = request.queryParams.dir !== undefined?request.queryParams.dir:'asc';

    let [limit, page] = [request.queryParams.limit, request.queryParams.page];
    let [start, stop] = [page - 1, page].map((i) => (limit * i));

    if(qName !== undefined) {
      ret = users.filter(function(i) {
        return i.name.toLowerCase().indexOf(qName.toLowerCase()) !== -1;
      });
    }
    else {
      ret = users;
    }

    if (sortAttr !== undefined) {
      sortAttr = dasherize(sortAttr);
      //console.log('sortAttr: ' + sortAttr + ' ' + ((dir === 'asc')?'/\\':'\\/'));

      if (dir === 'asc') {
        ret = ret.sort((a, b) => ((a.attributes[sortAttr] > b.attributes[sortAttr]) -
                                  (a.attributes[sortAttr] < b.attributes[sortAttr])));
      }
      else {
        ret = ret.sort((a, b) => ((a.attributes[sortAttr] < b.attributes[sortAttr]) -
                                  (a.attributes[sortAttr] > b.attributes[sortAttr])));
      }
    }

    if (start >= 0 && stop > start) {
      return {data: ret.slice(start, stop)};
    }
    else {
      return {data: []};
    }
  });

  this.get('/users/:id', function (db, request) {
    return users.find((user) => request.params.id === user.id);
  });

}
