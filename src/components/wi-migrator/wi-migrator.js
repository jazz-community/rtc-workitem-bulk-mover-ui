import Vue from 'vue';
import template from './wi-migrator.html';
import style from './wi-migrator.scss';

const WorkItemMigratorComponent = Vue.extend({
   style,
   template,
   components: {},
   props: {
      attributeDefinitions: Array,
      moveSuccessful: Boolean,
      trackExpanded: Map,
   },

   created() {
      this.trackExpanded = new Map();
   },

   computed: {
      sAttr: function () {
         var bla = this.attributeDefinitions.map(def => {
            def.valueMappings.sort((a, b) => {
               return a.originalValue.displayName > b.originalValue.displayName;
            });
            const shadowMappings = new Map();
            def.valueMappings.forEach(e => {
               const id = e.originalValue.identifier;
               if(shadowMappings.has(id)) {
                  const item = shadowMappings.get(id);
                  item.affectedWorkItems.push(e.affectedWorkItem);
                  item.orig.push(e);
                  if(e.isRequired) {
                     item.isRequired = true;
                  }
               } else {
                  const val = e;
                  val.affectedWorkItems = [e.affectedWorkItem];
                  val.orig = [e];
                  //val.checked = false;
                  delete e.affectedWorkItem;
                  shadowMappings.set(id, val);
               }
            });
            def.shadowMappings = [];
            for (let [k,v] of shadowMappings) {
               def.shadowMappings.push(v);
            }
            return def;
         });
         console.log("end: ", bla);
         return bla;
      },
   },

   watch: {
      isChecked: function(el) {
         console.log("isChecked", this.trackExpanded.get(el));
         return this.trackExpanded.get(el) === true;
      },
   },

   methods: {
      toggleChecked(el) {
         console.log("toggleChecked", el);
         let isSet = true;
         if(this.trackExpanded.has(el)) {
            isSet = !this.trackExpanded.get(el);
         }
         this.trackExpanded.set(el, isSet);
         console.log("toggleChecked", this.trackExpanded.get(el));
      },

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
