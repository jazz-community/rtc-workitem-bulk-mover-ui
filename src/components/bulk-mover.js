import Vue from 'vue';
import xhr from 'dojo/request/xhr';
import template from './bulk-mover.html';
import style from './bulk-mover.scss';
import JazzHelpers from './jazz-helpers/jazz-helpers';
import Utils from './jazz-helpers/Utils';
import '../styles/ui.scss';
import parser from 'dojo/parser';
import dom from 'dojo/dom';
import WorkItemTableComponent from './wi-table/wi-table';
import WorkItemMigratorComponent from './wi-migrator/wi-migrator';

const BulkMoverComponent = Vue.extend({
   style,
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
         serverError: null,
         wiTable: {
            searchQuery: '',
            gridColumns: {
               type: {name: 'Type', data: (data) => {
                  return `<img src="${data.type}"></img>`;
               }},
               id: {name: 'Id', data: (data) => {
                  return `<a target="_blank" href="${data.uri}">${data.id}</a>`;
               }},
               description: {name: 'Title', data: (data) => {
                  return data.description;
               }},
               state: {name: 'State', data: (data) => {
                  return `<img src="${data.state.icon}"></img>${data.state.name}`;
               }},
               owner: {name: 'Owned By', data: (data) => {
                  return `<a target="_blank" href="${data.owner.uri}">${data.owner.name}</a>`;
               }},
               category: {name: 'Filed Against', data: (data) => {
                  return data.category;
               }},
               target: {name: 'Planned For', data: (data) => {
                  return data.target;
               }},
            },
            gridData: []
         },
         projectAreas: [],
         mappings: [],
         moveSuccessful: null,
         loadInProgress: false,
      };
   },

   created() {
      this.readProjectAreas();
   },

   mounted() {
      parser.parse(dom.byId('WIMoveArea'));
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
      isQueryLoading: function() {
         return this.loadInProgress;
      },
      isLoading: function() {
         return this.projectAreas.length <= 0;
      },
      isDataMissing: function() {
         return this.selected && this.workItems.length <= 0
            || this.targetProjectArea.length <= 0;
      },
      countSelected: function() {
         return this.wiTable.gridData.filter((x) => x.checked).length;
      }
   },

   methods: {
      readProjectAreas() {
         this.loadInProgress = true;
         const base = JazzHelpers.getBaseUri();
         const service = 'com.siemens.bt.jazz.services.WorkItemBulkMover.IWorkItemBulkMoverService';
         const url = `${base}/service/${service}/project-areas`;
         xhr.get(url, {
            handleAs: 'json',
            headers: {"Accept": "application/json"}
         }).then((retData) => {
            this.projectAreas = retData;
            this.loadInProgress = false;
         });
      },

      loadQuery() {
         JazzHelpers.getQueryDialog(this.querySelected);
      },

      querySelected(data) {
         this.loadInProgress = true;
         this.query = {name: data.name, id: data.itemId};
         const url = `${JazzHelpers.getBaseUri()}/oslc/queries/${this.query.id}/rtc_cm:results?oslc.properties=dc:type{rtc_cm:iconUrl},dc:identifier,dc:title,rdf:resource,rtc_cm:state{dc:title,rtc_cm:iconUrl},rtc_cm:ownedBy{dc:title,rdf:resource},rtc_cm:filedAgainst{rtc_cm:hierarchicalName},rtc_cm:plannedFor{dc:title}`;
         xhr.get(url, {
            handleAs: 'json',
            headers: {"Accept": "application/json"}
         }).then((retData) => {
            let queryresult = retData["oslc_cm:results"];
            queryresult.forEach((el) => {
               const obj = {
                  type: Utils.getDeepKey("dc:type.rtc_cm:iconUrl", el),
                  id: el["dc:identifier"],
                  description: el["dc:title"],
                  state: {
                     name: Utils.getDeepKey("rtc_cm:state.dc:title", el),
                     icon: Utils.getDeepKey("rtc_cm:state.rtc_cm:iconUrl", el),
                  },
                  owner: {
                     name: Utils.getDeepKey("rtc_cm:ownedBy.dc:title", el),
                     uri: Utils.getDeepKey("rtc_cm:ownedBy.rdf:resource", el),
                  },
                  category: Utils.getDeepKey("rtc_cm:filedAgainst.rtc_cm:hierarchicalName", el),
                  target: Utils.getDeepKey("rtc_cm:plannedFor.dc:title", el),
                  uri: el["rdf:resource"],
                  checked: true
               };
               this.wiTable.gridData.push(obj);
            });
            this.loadInProgress = false;
         });
      },

      moveWorkItems() {
         this.tryMove(this.workItems, this.targetProjectArea, this.attributeDefinitions);
      },

      tryMove(workItems, projectArea, attributeDefinitions) {
         this.loadInProgress = true;
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
            if(retData.successful && retData.mapping && retData.mapping.length > 0) {
               this.moveSuccessful = true;
               this.attributeDefinitions = [];
            } else {
               this.moveSuccessful = false;
               this.serverError = retData.error || null;
               if(retData.mapping) {
                  this.attributeDefinitions = retData.mapping;
               }
            }
            this.loadInProgress = false;
         }, (err) => {
            this.moveSuccessful = false;
            this.loadInProgress = false;
         }, (evt) => {
            // Handle a progress event from the request if browser supports XHR2
         });
      },
   },
});

export default BulkMoverComponent;
