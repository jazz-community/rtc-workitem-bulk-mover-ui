define([
   // base template declarations
   "dojo/_base/declare",
   "dojo/_base/config",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   // dojo deps
   "dojo/has",
   "dojo/sniff",
   // prepare all pages
   "com.siemens.bt.jazz.ui.WorkItemBulkMover/jazz/WorkItemBulkMover",
   // ********************
   // ADD OTHER PAGES HERE
   // ********************

   // load page template
   "dojo/text!./shared/templates/Registry.html",
   // load the helper utility
   "./Utils",
   // wait for page to be ready
   "dojo/domReady!"
], function (declare, config, _WidgetBase, _TemplatedMixin,
   has, sniff,
   WorkItemBulkMover,
   // ********************
   // ADD OTHER PAGES HERE
   // ********************
   template,
   Utils) {

      // require the jazz platform UI
      var PlatformUI = net.jazz.ajax.ui.PlatformUI;

      return declare("com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider.ui.BTAddOns", [_WidgetBase, _TemplatedMixin], {
         constructor: function () {
            this.messages = i18n;
         },

         postCreate: function () {
            // Work Item Bulk Mover
            ActionRegistry.registerAction("com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider.ui.WorkItemBulkMove.move", this, "bulkMoveWorkItems");
            // *************************
            // REGISTER OTHER PAGES HERE
            // *************************
         },

         bulkMoveWorkItems: function () {
            this.changePage(new WorkItemBulkMover());
         },

         // perform a page change
         changePage: function (pageWidget) {
            while (content.hasChildNodes()) {
               content.removeChild(this.pagecontent.firstChild);
            }
            // place the passed in widget into the page content section
            widget.placeAt(this.pageContent);
         }
      });
   });
