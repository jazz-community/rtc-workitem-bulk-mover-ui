import Vue from 'vue';
import template from './wi-migrator.html';
import style from './wi-migrator.scss';
import JazzHelpers from '../jazz-helpers/jazz-helpers';

const multiString = "[Multiple Values Selected...]";

const WorkItemMigratorComponent = Vue.extend({
   style,
   template,
   components: {},
   props: {
      attributeDefinitions: Array,
      moveSuccessful: Boolean,
      serverError: String,
   },

   methods: {
      getLinkList(workItems) {
         return workItems.map(x => {
            const uri = JazzHelpers.getWorkItemUri(x.workItem.id);
            return `<span data-tooltip="${x.workItem.title}" data-position="top right">
                      <a target="_blank" href="${uri}">${x.workItem.id}</a>
                    </span>`;
         }).join(", ");
      },

      getTitledLink(workItem) {
         const uri = JazzHelpers.getWorkItemUri(workItem.id);
         return `<a target="_blank" href="${uri}">${workItem.id}: ${workItem.title}</a>`;
      },

      isApplyAllAllowed(chosen, nrOfValueMappings) {
         return chosen !== multiString && nrOfValueMappings > 1;
      },

      isMulti(chosen) {
         return chosen === multiString;
      },

      applyToAll(attrId, valId) {
         this.attributeDefinitions.forEach(attrDef => {
            if(attrDef.identifier === attrId && this.isApplyAllAllowed(valId, attrDef.valueMappings.length)) {
               attrDef.valueMappings.forEach(valMap => {
                  valMap.chosen = valId;
                  valMap.affectedWorkItems.forEach(wi => {
                     wi.chosen = valId;
                  });
               });
            }
         });
      },

      subChanged(attrDefId, attrId, workItemId, chosen) {
         this.attributeDefinitions.forEach(attrDef => {
            if(attrDef.identifier === attrDefId) {
               attrDef.valueMappings.forEach(valMap => {
                  if(valMap.oldValue.identifier === attrId) {
                     const multipleChild = valMap.affectedWorkItems.some(wi => {
                        return wi.chosen !== chosen;
                     });
                     if(multipleChild) {
                        valMap.chosen = multiString;
                     } else {
                        valMap.chosen = chosen;
                     }
                  }
               });
            }
         });
      },

      topChanged(attrDefId, attrId, chosen) {
         this.attributeDefinitions.forEach(attrDef => {
            if(attrDef.identifier === attrDefId) {
               attrDef.valueMappings.forEach(valMap => {
                  if(valMap.oldValue.identifier === attrId) {
                     valMap.affectedWorkItems.forEach(wi => {
                        wi.chosen = chosen;
                     });
                  }
               });
            }
         });
      },

      hasRequiredChild(affectedWorkItems) {
         return affectedWorkItems.some(x => {
            return x.isRequired;
         });
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
