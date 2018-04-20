import Vue from 'vue';
import xhr from 'dojo/request/xhr';
import template from './bulk-mover.html';
import style from './bulk-mover.scss';
import JazzHelpers from './jazz-helpers/jazz-helpers';
import Utils from './jazz-helpers/Utils';
import '../styles/ui.scss';
import parser from 'dojo/parser';
import dom from 'dojo/dom';
import packageJson from '../../package.json';
import WorkItemTableComponent from './wi-table/wi-table';
import WorkItemMigratorComponent from './wi-migrator/wi-migrator';
import WorkItemTypeMapperComponent from './wi-type-mapper/wi-type-mapper';
const pageSize = 10;
const BulkMoverComponent = Vue.extend({
   style,
   template,
   components: {
      'wi-table': WorkItemTableComponent,
      'wi-migrator': WorkItemMigratorComponent,
      'wi-type-mapper': WorkItemTypeMapperComponent,
   },

   data() {
      return {
         version: packageJson.version,
         wiInput: '',
         targetProjectArea: '',
         targetTypes: [],
         attributeDefinitions: [],
         query: null,
         serverError: null,
         typeMap: [],
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
               name: `Refresh Query`,
               active: true,
               isPagingRelevant: false,
               action: () => {
                  if(this.query) {
                     this.refreshQuery();
                  }
               }
            },{
               name: `Load All Remaining`,
               active: true,
               isPagingRelevant: true,
               action: () => {
                  if(this.query && this.query.nextPage !== null) {
                     this.loadNextPage(this.query.nextPage, true);
                  }
               }
            },{
               name: `Load Next ${pageSize}`,
               active: true,
               isPagingRelevant: true,
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
         projectAreaSelected: false,
         moveSuccessful: false,
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
      sourceTypes: function() {
         this.polyfillsForIE();
         var srcTypes = this.wiTable.gridData
            .filter((x) => x.checked)
            .map((x) => x.type)
            .filter((item, index, self) =>
                  index === self.findIndex((t) => (
                     t.id === item.id
                  )));
         var idList = srcTypes.map((x) => x.id);
         var len = srcTypes.length;
         for(var i = 0; i < len; i++) {
            var type = srcTypes[i];
            var keys = this.typeMap.filter((mapEntry) => mapEntry.source.id === type.id);
            if(keys.length == 0) {
               var hasTargetWithSameId = this.targetTypes.filter((x) => x.id === type.id).length === 1;
               var targetId = hasTargetWithSameId ? type.id : null;
               this.typeMap.push({source: type, targetId: targetId});
            }
         }
         return this.typeMap.filter((x) => idList.includes(x.source.id));
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
      isProjectAreaSelected: function() {
         return (this.targetProjectArea && this.targetProjectArea !== null && this.targetProjectArea !== '');
      },
      isTypeMappingDataAvailable: function() {
         return this.targetTypes.length > 0 && this.sourceTypes.length > 0;
      },
      areAllTypesMapped: function() {
         return this.sourceTypes.filter((x) => x.targetId === null).length === 0;
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
         this.moveSuccessful = false;
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

      getTargetWorkItemTypes() {
         var projectArea = this.targetProjectArea;
         this.loadInProgress = true;
         this.typeMap = [];
         this.targetTypes = [];
         this.serverError = null;
         const base = JazzHelpers.getBaseUri();
         const service = 'com.siemens.bt.jazz.services.WorkItemBulkMover.IWorkItemBulkMoverService';
         const url = `${base}/service/${service}/types?project-area=${projectArea}`;
         xhr.get(url, {
            handleAs: 'json',
            headers: {"Accept": "application/json"}
         }).then((retData) => {
            this.targetTypes = retData;
            this.attributeDefinitions = [];
            this.loadInProgress = false;
         });
      },

      loadQuery() {
         var queryDialog = JazzHelpers.getQueryDialog(this.onQuerySelected);
         this.disablePASelectorInQuery(queryDialog, 0);
      },

      disablePASelectorInQuery(queryDialog, attempt) {
         var self = this;
         if(typeof queryDialog.contentWidget !== "undefined" && typeof queryDialog.contentWidget.areaSelect !== "undefined") {
            queryDialog.contentWidget.areaSelect.disabled = true;
         } else if(attempt < 15) {
            setTimeout(function() {
               self.disablePASelectorInQuery(queryDialog, ++attempt);
            }, 50);
         }
      },

      onQuerySelected(data) {
         this.query = {name: data.name, id: data.itemId, offSet: 0};
         this.runSelectedQuery();
      },

      refreshQuery() {
         if(confirm("This will re-run the specified query. Continue?")) {
            this.runSelectedQuery();
         }
      },

      runSelectedQuery() {
         this.resetValues();
         this.loadInProgress = true;
         const props = [
            "rtc_cm:type{dcterms:title,dcterms:identifier,rtc_cm:iconUrl}",
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

            this.wiTable.buttons.filter((x) => x.isPagingRelevant).forEach(b => {b.active = this.query.nextPage !== null;});

            queryResult.forEach((el) => {
               const obj = {
                  type: {
                     id: Utils.getDeepKey("rtc_cm:type.dcterms:identifier", el),
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
                  checked: true,
                  moved: false,
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
         this.tryMove(this.workItems, this.targetProjectArea, this.attributeDefinitions, this.typeMap, previewOnly);
      },

      tryMove(workItems, projectArea, attributeDefinitions, typeMapping, previewOnly) {
         this.loadInProgress = true;
         const data = {
            targetProjectArea: projectArea,
            workItems: workItems,
            mapping: attributeDefinitions,
            typeMapping: typeMapping.map((x) => { return {source: x.source.id, target: x.targetId}; }),
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
            if(retData.successful && retData.mapping) {
               this.moveSuccessful = true;
               this.attributeDefinitions = [];
               this.selected.forEach((wi) => {
                  wi.checked = false;
                  wi.moved = true;
               });
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
            this.attributeDefinitions = [];
            this.serverError = err.message;
            this.loadInProgress = false;
         }, (evt) => {
            // Handle a progress event from the request if browser supports XHR2
         });
      },

      polyfillsForIE() {
         // fixes: https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues/11
         // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
         if (!Array.prototype.findIndex) {
            Object.defineProperty(Array.prototype, 'findIndex', {
              value: function(predicate) {
               // 1. Let O be ? ToObject(this value).
                if (this == null) {
                  throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                  throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                  // a. Let Pk be ! ToString(k).
                  // b. Let kValue be ? Get(O, Pk).
                  // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                  // d. If testResult is true, return k.
                  var kValue = o[k];
                  if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                  }
                  // e. Increase k by 1.
                  k++;
                }

                // 7. Return -1.
                return -1;
              }
            });
         }

         // https://tc39.github.io/ecma262/#sec-array.prototype.includes
         if (!Array.prototype.includes) {
            Object.defineProperty(Array.prototype, 'includes', {
            value: function(searchElement, fromIndex) {

               if (this == null) {
                  throw new TypeError('"this" is null or not defined');
               }

               // 1. Let O be ? ToObject(this value).
               var o = Object(this);

               // 2. Let len be ? ToLength(? Get(O, "length")).
               var len = o.length >>> 0;

               // 3. If len is 0, return false.
               if (len === 0) {
                  return false;
               }

               // 4. Let n be ? ToInteger(fromIndex).
               //    (If fromIndex is undefined, this step produces the value 0.)
               var n = fromIndex | 0;

               // 5. If n ≥ 0, then
               //  a. Let k be n.
               // 6. Else n < 0,
               //  a. Let k be len + n.
               //  b. If k < 0, let k be 0.
               var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

               function sameValueZero(x, y) {
                  return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
               }

               // 7. Repeat, while k < len
               while (k < len) {
                  // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                  // b. If SameValueZero(searchElement, elementK) is true, return true.
                  if (sameValueZero(o[k], searchElement)) {
                  return true;
                  }
                  // c. Increase k by 1.
                  k++;
               }

               // 8. Return false
               return false;
            }
            });
         }
      },
   },
});

export default BulkMoverComponent;
