import Vue from 'vue';

import BulkMoverComponent from './components/bulk-mover';
import {selectify} from './filters/index';

// enable debugging
Vue.config.debug = true;

new Vue({
   el: '#wibm-app',
   components: {
      'bulk-mover': BulkMoverComponent,
   },
   data: {},
});
