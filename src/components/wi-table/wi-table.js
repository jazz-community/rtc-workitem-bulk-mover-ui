import Vue from 'vue';
import template from './wi-table.html';

const WorkItemTableComponent = Vue.extend({
   template,
   components: {},
   props: {
      workItems: Array,
      columns: Object,
      filterKey: String
   },

   computed: {
      filteredData: function () {
         const filterKey = this.filterKey && this.filterKey.toLowerCase();
         let data = this.workItems;
         if (filterKey) {
            data = data.filter(function (row) {
               return Object.keys(row).some(function (key) {
                  return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
               });
            });
         }
         return data;
      }
   }
});

export default WorkItemTableComponent;
