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