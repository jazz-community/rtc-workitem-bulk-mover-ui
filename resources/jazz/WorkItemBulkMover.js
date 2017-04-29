define([
   "dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!com.siemens.bt.jazz.ui.WorkItemBulkMover/jazz/WorkItemBulkMover.html",
   "com.siemens.bt.jazz.ui.WorkItemBulkMover/ui/BulkMoverBundle"
], function(declare, _WidgetBase, _TemplatedMixin, template, BulkMoverBundle) {
   return declare("com.siemens.bt.jazz.ui.WorkItemBulkMover.jazz.WorkItemBulkMover", [_WidgetBase, _TemplatedMixin], {

      templateString: template,

      startup: function() {
         // The HTML of this Widget is now rendered and the whole page is loaded completely
         // Now it's the time to inject the Bundle with all the plug-in code into the page
         var bundleInstance = new BulkMoverBundle();
         bundleInstance.executeBundle();
      }
   });
});
