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
