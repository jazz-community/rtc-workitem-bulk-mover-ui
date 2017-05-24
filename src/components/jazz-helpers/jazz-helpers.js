import Utils from './Utils';
import 'com.ibm.team.workitem.viewlets.web.ui.internal.utils.WorkItemQueryChooser';

/**
 * Helper class for interaction with the Jazz UI
 */
export default class JazzHelpers {
   /**
    * get the base application url
    * @return{string} the context root of the jazz application
    */
   static getBaseUri() {
      const url = Utils.getDeepKey('net.jazz.ajax._contextRoot', window);
      return (url && url.length > 0) ? url : 'https://localhost:7443/jazz';
   }

   static getWorkItemUri(workItemId) {
      return `${this.getBaseUri()}/resource/itemName/com.ibm.team.workitem.WorkItem/${workItemId}`;
   }

   /**
    * create a dialog which allows the user to select an RTC Query
    * @param {Function} onOk callback function triggered when OK button was clicked
    */
   static getQueryDialog(onOk) {
      const WIQV = com.ibm.team.workitem.viewlets.web.ui.internal.utils.WorkItemQueryChooser;
      // possible values: SCOPE_CONTRIBUTOR | SCOPE_TEAM_AREA | SCOPE_PROJECT_AREA
      const contrib = com.ibm.team.dashboard.web.ui.DashboardConstants.SCOPE_CONTRIBUTOR;
      const args = {
         // we don't want the user to select more than one query
         multiSelect: false,
         // the scope in which queries are searched
         scope: contrib,
         defaultValue: null,
         defaultCategory: null,
         defaultParams: null,
         suppressCrossRepoQueries: null,
         // prevent parameterized queries as I couldn't find out how to pass the runtime selections to the query service
         suppressParameterizedQueries: true,
         title: 'Choose a query',
         onOk: onOk,
      };
      const el = new WIQV(args);
   }
}
