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
