import Vue from 'vue';
import xhr from 'dojo/request/xhr';
import template from './bulk-mover.html';
import JazzHelpers from './jazz-helpers/jazz-helpers';
import '../styles/ui.scss';
import parser from 'dojo/parser';
import dom from 'dojo/dom';
import WorkItemTableComponent from './wi-table/wi-table';
import WorkItemMigratorComponent from './wi-migrator/wi-migrator';

const BulkMoverComponent = Vue.extend({
   template,
   components: {
      'wi-table': WorkItemTableComponent,
      'wi-migrator': WorkItemMigratorComponent,
   },

   data() {
      return {
         wiInput: '',
         targetProjectArea: '',
         attributeDefinitions: [],
         query: null,
         wiTable: {
            searchQuery: '',
            gridColumns: {
               id: {name: 'Id', data: (data) => {
                  console.log(data);
                  return `<a target="_blank" href="${data.uri}">${data.id}</a>` ;
               }},
               description: {name: 'Title', data: (data) => {return data.description;}}
            },
            gridData: []
         },
         projectAreas: [],
         mappings: [],
         moveSuccessful: null,
      };
   },

   created() {
      this.readProjectAreas();
   },

   mounted() {
      const domObj = dom.byId('WIMoveArea');
      parser.parse(domObj);
   },

   computed: {
      workItems: function() {
         return this.wiTable.gridData
            .filter((x) => x.checked)
            .map((x) => x.id);
      },
      selected: function() {
         return this.wiTable.gridData.length > 0 && this.wiTable.gridData
            .filter((x) => x.checked);
      },
      isLoading: function() {
         return this.projectAreas.length <= 0;
      },
      isDataMissing: function() {
         return this.selected && this.workItems.length <= 0
            || this.targetProjectArea.length <= 0;
      },
   },

   methods: {
      readProjectAreas() {
         const base = JazzHelpers.getBaseUri();
         const service = 'com.siemens.bt.jazz.services.WorkItemBulkMover.IWorkItemBulkMoverService';
         const url = `${base}/service/${service}/project-areas`;
         xhr.get(url, {
            handleAs: 'json',
            headers: {"Accept": "application/json"}
         }).then((retData) => {
            this.projectAreas = retData;
         });
      },

      clicky() {
         JazzHelpers.getQueryDialog(this.querySelected);
      },

      querySelected(data) {
         this.query = {name: data.name, id: data.itemId};
         var url = `${JazzHelpers.getBaseUri()}/oslc/queries/${this.query.id}/rtc_cm:results`;
         xhr.get(url, {
            handleAs: 'json',
            headers: {"Accept": "application/json"}
         }).then((retData) => {
            let queryresult = retData["oslc_cm:results"];
            queryresult.forEach((el) => {
               const obj = {
                  id: el["dc:identifier"],
                  description: el["dc:title"],
                  uri: el["rdf:resource"],
                  checked: true
               };
               this.wiTable.gridData.push(obj);
            });
         });
      },

      moveWorkItems() {
         this.tryMove(this.workItems, this.targetProjectArea, this.attributeDefinitions);
      },

      tryMove(workItems, projectArea, attributeDefinitions) {
         const data = {
            targetProjectArea: projectArea,
            workItems: workItems,
            attributeDefinitions: attributeDefinitions,
         };
         const base = JazzHelpers.getBaseUri();
         const service = 'com.siemens.bt.jazz.services.WorkItemBulkMover.IWorkItemBulkMoverService';
         const url = `${base}/service/${service}/move`;
         xhr.post(url, {
            data: JSON.stringify(data),
            handleAs: 'json',
            headers: {
               'Content-Type': 'json',
            },
         }).then((retData) => {
            console.log('move data: ', retData);
            if(retData.successful && retData.mapping.length > 0) {
               this.moveSuccessful = true;
               this.attributeDefinitions = [];
            } else {
               this.moveSuccessful = false;
               this.attributeDefinitions = retData.mapping;
            }
         }, (err) => {
            console.log('err: ', err);
            this.moveSuccessful = false;
         }, (evt) => {
            console.log('evt: ', evt);
            // Handle a progress event from the request if browser supports XHR2
         });
      },
   },
});

export default BulkMoverComponent;
