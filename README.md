# ember-light-table-demo

Demonstration of an ember-light-table addon.

Basically, the ember-light-table addon is something I wanted to use for a few other projects.  It looks very nice and has a lot of compelling features.  But the docs and examples were very onerous.  The examples were apparently working demonstrations complete with code snippets, but they all depended upon some kind of server-side component that was not very well explained.  So replicating that effort was, well, a lot of effort.

After fumbling around with the examples for a few days, I finally got something that works.  It is a simple table that depends upon fake requests supplied by the ember-cli-mirage module.  I set it up with a few records that can be requested locally instead of depending upon a remote API.

So this is intended to be a baseline for exploring the features of ember-light-table that can actually work in isolation.  If you want a bigger set of data, just add it to the mirage config.  If you want to change up the object schema for the API, change it in the mirage config and adjust your model and table accordingly.  If you want to explore new table features...well, you get the idea.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd light-table-example`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
