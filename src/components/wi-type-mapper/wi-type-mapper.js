import Vue from 'vue';
import template from './wi-type-mapper.html';

const WorkItemTypeMapperComponent = Vue.extend({
   template,
   components: {},
   props: {
      sourceTypes: Array,
      targetTypes: Array,
      typeMap: Map,
   },

   data() {
      return {
      };
   },

   methods: {
      updateTypeMap(source, target) {
         console.log("updateTypeMap: ", source, target);
         this.typeMap.set(source, target);
      },
   },

   computed: {
   }
});

export default WorkItemTypeMapperComponent;
