import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    // We do not want to make a request to the backend yet, so we use
    // peekAll() which simply gets local records in the store.
    return this.store.peekAll('user');
  }
});
