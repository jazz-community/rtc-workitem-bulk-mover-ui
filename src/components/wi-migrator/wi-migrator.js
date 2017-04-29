import Vue from 'vue';
import template from './wi-migrator.html';

const WorkItemMigratorComponent = Vue.extend({
   template,
   components: {},
   props: {
      attributeDefinitions: Array,
      moveSuccessful: Boolean,
   },

   methods: {
      hierarchify(val) {
         const hierars = val.split('/');
         let curVal = hierars[hierars.length - 1];
         for (let i = 1; i < hierars.length; i++) {
            curVal = `--${curVal}`;
         }
         return curVal;
      }
   }
});

export default WorkItemMigratorComponent;
