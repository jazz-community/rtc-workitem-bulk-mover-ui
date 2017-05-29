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
   // wait for page to be ready
   "dojo/domReady!"
], function (declare, config, _WidgetBase, _TemplatedMixin,
   has, sniff,
   WorkItemBulkMover,
   // ********************
   // ADD OTHER PAGES HERE
   // ********************
   template) {

      // require the jazz platform UI
      var PlatformUI = net.jazz.ajax.ui.PlatformUI;

      return declare("com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider.ui.Registry", [_WidgetBase, _TemplatedMixin], {

         templateString: template,

         postCreate: function () {
            var ActionRegistry = PlatformUI.getWorkbench().getActionRegistry();

            // Work Item Bulk Mover
            ActionRegistry.registerAction("com.siemens.bt.jazz.ui.WorkItemBulkMover.move", this, "bulkMoveWorkItems");
            // *************************
            // REGISTER OTHER PAGES HERE
            // *************************
         },

         // IMPORTANT: do not remove this, this method is required to be implemented
         // triggered as soon as a MenuProvider provided page is requested
         // not triggered while changing between MenuProvider provided pages
         _onShow: function() {
         },

         // IMPORTANT: do not remove this, this method is required to be implemented
         // triggered, as soon as another page outside of a MenuProvider provided page is requested
         onHide: function() {
         },

         bulkMoveWorkItems: function () {
            this.changePage(new WorkItemBulkMover());
         },

         // perform a page change
         changePage: function (pageWidget) {
            while (this.pageContent.hasChildNodes()) {
               this.pageContent.removeChild(this.pageContent.firstChild);
            }
            // place the passed in widget into the page content section
            pageWidget.placeAt(this.pageContent);
         }
      });
   });
