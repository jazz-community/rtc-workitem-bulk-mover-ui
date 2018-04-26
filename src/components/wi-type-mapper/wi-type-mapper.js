import Vue from 'vue';
import template from './wi-type-mapper.html';

const WorkItemTypeMapperComponent = Vue.extend({
   template,
   components: {},
   props: {
      showMigrator: Boolean,
      targetTypes: Array,
      typeMap: Array,
   },

   data() {
      return {
      };
   },

   methods: {
      updateTypeMap(source, targetId) {
         var keys = this.typeMap.filter((mapEntry) => mapEntry.source.id === source);
         if(keys.length > 0) {
            keys.map((mapEntry) => mapEntry.targetId = targetId);
         }
      },
   }
});

export default WorkItemTypeMapperComponent;
