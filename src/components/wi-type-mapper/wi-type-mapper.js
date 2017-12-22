import Vue from 'vue';
import template from './wi-type-mapper.html';

const WorkItemTypeMapperComponent = Vue.extend({
   template,
   components: {},
   props: {
      sourceTypes: Array,
      targetTypes: Array,
      typeMap: Array,
   },

   data() {
      return {
      };
   },

   methods: {
      updateTypeMap(source, target) {
         var keys = this.typeMap.filter((mapEntry) => mapEntry.source === source);
         if(keys.length > 0) {
            keys.map((mapEntry) => mapEntry.target = target);
         } else {
            this.typeMap.push({source: source, target: target});
         }
      },
   }
});

export default WorkItemTypeMapperComponent;
