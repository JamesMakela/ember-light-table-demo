# Step-by-Step Guide to building the ember-light-table Demo

I thought it would be helpful to not only get a demo project working and preserve it,
but to also document what it took to get from zero to demo.  This might serve to clarify
a few things about this addon that the code alone cannot.

## Create a Project

As with most Ember projects, we will start by using the ember-cli to create a new bare-bones
Ember project.

```console
$ ember new ember-light-table-demo
```

The 'ember new' command will create a new project that has all the necessary modules and
constructs to run a basic Ember project with a simple homepage.
[The Ember Tutorial](https://guides.emberjs.com/release/tutorial/ember-cli/) will explain this
in more detail if you are new to Ember and need more help.

So now we have a project folder named `ember-light-table-demo`.  Let's go into it.

```console
$ cd light-table-example/
```

Our new Ember project is basically a Node.js project with a bunch of stuff bundled on top of it.
So the first thing we will want to do is install all of the required Node packages.  They are
already defined in a config file (`packages.json` if you are curious), and the only thing
we should need to do at this point is run the Node Package Manager (`npm`)

```console
$ npm install
```

## Install the ember-light-table module

The ember-light-table package is not built-in by default, so we will need to install it.
And we will do so via the ember-cli (like most things Ember)

```console
$ ember install ember-light-table
npm: Installed ember-light-table
installing ember-light-table
  install addon ember-responsive
npm: Installed ember-responsive
installing ember-responsive
  create app/breakpoints.js
Installed addon package.
Installed addon package.
```

I cannot be sure if this is true of all projects using ember-light-table, but in order
to implement the [example projects](https://offirgolan.github.io/ember-light-table/),
we will need to install a few additional packages.

```console
$ ember install ember-concurrency
npm: Installed ember-concurrency
Installed addon package.
```

```console
$ ember install ember-font-awesome
npm: Installed ember-font-awesome
Installed addon package.
```

And for our own purposes, we would like to use something that is not a remote web API.
For this, we install `ember-cli-mirage`.  This will setup a system within the project
for making local requests that act like remote requests to a web API.

```console
$ ember install ember-cli-mirage
npm: Installed ember-cli-mirage
installing ember-cli-mirage
  create /mirage/config.js
  create /mirage/scenarios/default.js
  create /mirage/serializers/application.js
Installed addon package.
```

## Generate a common ember-light-table mixin

The [example projects](https://offirgolan.github.io/ember-light-table/)
seem to all make use of a common Ember component, implemented as a
mixin.  Our specific table will inherit from this mixin, and it contains
the table behavior common to all the examples.

```console
$ ember generate mixin table-common
installing mixin
  create app/mixins/table-common.js
installing mixin-test
  create tests/unit/mixins/table-common-test.js
```

**app/mixins/table-common.js:**
```javascript
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

import { task } from 'ember-concurrency';
     
import Table from 'ember-light-table';

export default Mixin.create({
  store: service(),

  page: 0,
  limit: 10,
  dir: 'asc',
  sort: 'firstName',

  isLoading: computed.oneWay('fetchRecords.isRunning'),
  canLoadMore: true,
  enableSync: true,

  model: null,
  data: null,
  meta: null,
  columns: null,
  table: null,

  init() {
    this._super(...arguments);

    this.set('data',this.get('model').toArray());

    let table = new Table(this.get('columns'),
                          this.get('data'),
                          { enableSync: this.get('enableSync') });
    let sortColumn = table.get('allColumns').findBy('valuePath', this.get('sort'));

    // Setup initial sort column
    if (sortColumn) {
      sortColumn.set('sorted', true);
    }

    this.set('table', table);
  },

  fetchRecords: task(function*() {
    let records = yield this.get('store').query('user', this.getProperties(['page', 'limit', 'sort', 'dir']));
    this.get('data').pushObjects(records.toArray());
    this.set('meta', records.get('meta'));
    this.set('canLoadMore', !isEmpty(records));
  }).restartable(),

  actions: {
    onScrolledToBottom() {
      if (this.get('canLoadMore')) {
        this.incrementProperty('page');
        this.get('fetchRecords').perform();
      }
    },

    onColumnClick(column) {
      if (column.sorted) {
        this.setProperties({
          dir: column.ascending ? 'asc' : 'desc',
          sort: column.get('valuePath'),
          canLoadMore: true,
          page: 0
        });
        this.get('data').clear();
      }
    }
  }
});
```

**Note:** [This issue](https://github.com/offirgolan/ember-light-table/issues/470)
 *provided some essential help actually getting these tables to work.  So this file*
 *does look slightly different than in the examples (as of 6/8/2019, anyway)*

## Generate Our Simple Table

We will now generate our simple-table component

```console
$ ember generate component simple-table
installing component
  create app/components/simple-table.js
  create app/templates/components/simple-table.hbs
installing component-test
  create tests/integration/components/simple-table-test.js
```

And then we edit the files as shown.

**app/templates/components/simple-table.hbs:**
```html
{{#light-table table height="65vh" as |t|}}
  {{t.head
    onColumnClick=(action "onColumnClick")
    iconSortable="fa fa-sort"
    iconAscending="fa fa-sort-asc"
    iconDescending="fa fa-sort-desc"
    fixed=true
  }}

  {{#t.body
    canSelect=false
    onScrolledToBottom=(action "onScrolledToBottom")
    as |body|
  }}
    {{#if isLoading}}
      {{#body.loader}}
        {{table-loader}}
      {{/body.loader}}
    {{/if}}
  {{/t.body}}

{{/light-table}}
```

**app/components/simple-table.js:**
```javascript
import Component from '@ember/component';
import TableCommon from '../mixins/table-common';
import { computed } from '@ember/object';


export default Component.extend(TableCommon, {
  columns: computed(function() {
    return [{
      label: 'First Name',
      valuePath: 'firstName',
      width: '150px'
    }, {
      label: 'Last Name',
      valuePath: 'lastName',
      width: '150px'
    }, {
      label: 'Address',
      valuePath: 'address'
    }, {
      label: 'State',
      valuePath: 'state'
    }, {
      label: 'Country',
      valuePath: 'country'
    }];
  })
});
```

## Generate an index route

Of course a component itself is not going to render until it is being used
somewhere.  So for this very simple example we build an index route that
will render the component.

```console
$ ember generate route index
installing route
  create app/routes/index.js
  create app/templates/index.hbs
installing route-test
  create tests/unit/routes/index-test.js
```

**app/templates/index.hbs:**
```html
<SimpleTable @model={{this.model}}/>

{{outlet}}
```

**app/routes/index.js:**
```javascript
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    // light-table fetches rows from the model on demand, so performing
    // this.store.findAll() inside the route seems unnecessary.
    // But it also seems that we do need to define a model hook that
    // returns some kind of recordArray.
    // So we use peekAll() which simply gets local records in the store
    // and makes no backend requests.
    return this.store.peekAll('user');
  }
});
```

## Generate a User Model

```console
$ ember generate model user
installing model
  create app/models/user.js
installing model-test
  create tests/unit/models/user-test.js
```

**app/models/user.js:**
```javascript
import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
      firstName: DS.attr(),
      lastName: DS.attr(),
      address: DS.attr(),
      country: DS.attr(),
      state: DS.attr(),
      email: DS.attr(),
      username: DS.attr(),
      bio: DS.attr(),
      color: DS.attr()
});
```

## Generate an adapter

```console
$ ember generate adapter application
installing adapter
  create app/adapters/application.js
installing adapter-test
  create tests/unit/adapters/application-test.js
```

**app/adapters/application.js:**
```javascript
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api'
});
```

## Configure Mirage to work with our adapter

This is the part that required the most effort.  It was not really explained
in the examples exactly how the server side API was supposed to work.

Basically we make an API that has the following behavior:

```
GET /api/users?dir={'asc','desc'}&limit={number}&page={number}&sort={string}
```

So there are a number of options that we need to pass to the API.  Here is
how the API should handle them:

- **dir**: This is the sort direction.  It should contain either 'asc', to
           sort in ascending order, or 'desc', to sort in descending order.
           This is optional, and defaults to 'asc'.
- **sort**: This is the column name that should be sorted.  This is optional,
            and if not supplied, the results will not be sorted.
- **limit**: This is the maximum number of results to be returned.  This is
             required or no results will be returned.
- **page**: This determines the portion of the results to be returned.
            In conjunction with the limit parameter, a 'page' of result rows
            is determined with a page size = limit.  As far as I can tell,
            the range of page numbers is [1, ... N].  This is required or no
            results will be returned.

**Note**: You may notice another parameter 'name'.  This can be used for filtering,
but is not used by our light-table.

**mirage/config.js:**
```javascript
import { dasherize } from '@ember/string';

export default function() {
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
```
