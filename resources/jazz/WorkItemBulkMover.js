define([
   "dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!com.siemens.bt.jazz.ui.WorkItemBulkMover/jazz/WorkItemBulkMover.html",
   "dojo/request/script",
   "com.ibm.team.workitem.viewlets.web.ui.internal.utils.WorkItemQueryChooser"
], function(declare, _WidgetBase, _TemplatedMixin, template, script) {
   return declare("com.siemens.bt.jazz.ui.WorkItemBulkMover.jazz.WorkItemBulkMover", [_WidgetBase, _TemplatedMixin], {

      templateString: template,

      startup: function() {
         // The HTML of this Widget is now rendered and the whole page is loaded completely
         // Now it's the time to inject the Bundle with all the plug-in code into the page
         script.get(net.jazz.ajax._contextRoot + "/web/com.siemens.bt.jazz.ui.WorkItemBulkMover/ui/SemanticBundle.js").then(function() {
            script.get(net.jazz.ajax._contextRoot + "/web/com.siemens.bt.jazz.ui.WorkItemBulkMover/ui/BulkMoverBundle.js");
         });
      }
   });
});
