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

## Generate an index route

```console
$ ember generate route index
installing route
  create app/routes/index.js
  create app/templates/index.hbs
installing route-test
  create tests/unit/routes/index-test.js
```

## Generate a User Model

```console
$ ember generate model user
installing model
  create app/models/user.js
installing model-test
  create tests/unit/models/user-test.js
```

## Generate an adapter

```console
$ ember generate adapter application
installing adapter
  create app/adapters/application.js
installing adapter-test
  create tests/unit/adapters/application-test.js
```
