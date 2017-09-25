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
const pageSize = 10;
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
            gridColumns: {
               type: {name: 'Type', data: (data) => {
                  return `<img src="${data.type.icon}"></img>${data.type.name}`;
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
            buttons: [{
               name: `Load All Remaining`,
               active: true,
               action: () => {
                  if(this.query && this.query.nextPage !== null) {
                     this.loadNextPage(this.query.nextPage, true);
                  }
               }
            },{
               name: `Load Next ${pageSize}`,
               active: true,
               action: () => {
                  if(this.query && this.query.nextPage !== null) {
                     this.loadNextPage(this.query.nextPage, false);
                  }
               }
            }],
            gridData: [],
         },
         totalCount: 0,
         projectAreas: [],
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
      resetValues() {
         this.wiTable.gridData = [];
         this.attributeDefinitions = [];
         this.totalCount = 0;
         this.moveSuccessful = null;
      },

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
         this.resetValues();
         this.loadInProgress = true;
         this.query = {name: data.name, id: data.itemId, offSet: 0};
         const props = [
            "rtc_cm:type{dcterms:title,rtc_cm:iconUrl}",
            "dcterms:identifier",
            "dcterms:title",
            "rdf:about",
            "rtc_cm:state{dcterms:title,rtc_cm:iconUrl}",
            "dcterms:contributor{foaf:name,rdf:about}",
            "rtc_cm:filedAgainst{rtc_cm:hierarchicalName}",
            "rtc_cm:plannedFor{dcterms:title}"
         ];
         const joinedProps = props.join(",");
         const url = `${JazzHelpers.getBaseUri()}/oslc/queries/${this.query.id}/rtc_cm:results?oslc.paging=true&oslc.pageSize=${pageSize}&oslc.properties=${joinedProps}`;
         this.loadNextPage(url, false);
      },

      loadNextPage(url, recursive) {
         this.serverError = null;
         xhr.get(url, {
            handleAs: 'json',
            headers: {
               "Accept": "application/json",
               "OSLC-Core-Version": "2.0"
            }
         }).then((retData) => {
            let queryResult = retData["oslc:results"];
            this.totalCount = retData["oslc:responseInfo"]["oslc:totalCount"];
            this.query.nextPage = retData["oslc:responseInfo"]["oslc:nextPage"] || null;

            this.wiTable.buttons.forEach(b => {b.active = this.query.nextPage !== null;});

            queryResult.forEach((el) => {
               const obj = {
                  type: {
                     name: Utils.getDeepKey("rtc_cm:type.dcterms:title", el),
                     icon: Utils.getDeepKey("rtc_cm:type.rtc_cm:iconUrl", el),
                  },
                  id: el["dcterms:identifier"],
                  description: el["dcterms:title"],
                  state: {
                     name: Utils.getDeepKey("rtc_cm:state.dcterms:title", el),
                     icon: Utils.getDeepKey("rtc_cm:state.rtc_cm:iconUrl", el),
                  },
                  owner: {
                     name: Utils.getDeepKey("dcterms:contributor.foaf:name", el),
                     uri: Utils.getDeepKey("dcterms:contributor.rdf:about", el),
                  },
                  category: Utils.getDeepKey("rtc_cm:filedAgainst.rtc_cm:hierarchicalName", el),
                  target: Utils.getDeepKey("rtc_cm:plannedFor.dcterms:title", el),
                  uri: el["rdf:about"],
                  checked: true
               };
               this.wiTable.gridData.push(obj);
            });
            if(recursive && this.query.nextPage !== null) {
               this.loadNextPage(this.query.nextPage, true);
            }
            this.loadInProgress = false;
         }, (error) => {
            const errorMsg = error["message"];
            if(errorMsg) {
               this.serverError = errorMsg;
            } else {
               this.serverError = "Unknown Error occurred while trying to execute query!";
            }
            this.loadInProgress = false;
         });
      },

      moveWorkItems(previewOnly) {
         this.tryMove(this.workItems, this.targetProjectArea, this.attributeDefinitions, previewOnly);
      },

      tryMove(workItems, projectArea, attributeDefinitions, previewOnly) {
         this.loadInProgress = true;
         const data = {
            targetProjectArea: projectArea,
            workItems: workItems,
            mapping: attributeDefinitions,
            previewOnly: previewOnly,
         };
         const base = JazzHelpers.getBaseUri();
         const service = 'com.siemens.bt.jazz.services.WorkItemBulkMover.IWorkItemBulkMoverService';
         const url = `${base}/service/${service}/move`;
         this.serverError = null;
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
