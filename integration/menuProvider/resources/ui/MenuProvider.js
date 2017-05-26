define([
	"dojo/_base/declare",
	// include language files
	"dojo/i18n!./shared/nls/MenuProviderMessages",
 	// start as soon as the dom is ready
	"dojo/domReady!"
], function(declare, i18n) {
	/* globals jazz: false */
	return declare("com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider.ui.MenuProvider", jazz.app._ComponentMenu, {

		constructor: function() {
			this._insertIndex = 0;
		},

		postCreate: function() {
			// add the menu dom node
			dojo.addClass(this.domNode, "com-siemens-bt-jazz-ui-WorkItemBulkMover-menu");
			this.refresh();
		},

		// rebuild the menu if page gets refreshed (required for dynamic menu content)
		refresh: function() {
			this._insertIndex = 0;
			this.clear();
			this._addMenu();
		},

		// add the menu to the menu point
		_addMenu: function() {
			// used to build the action identifier
			var action = "#action=com.siemens.bt.jazz.ui.WorkItemBulkMover.";
			var imagePath = "com.siemens.bt.jazz.ui.WorkItemBulkMover.menuProvider/ui/shared/images/";


			// work item bulk mover
			this.addTitle(i18n.sectionBulkMove, this._insertIndex++);
			this.addItemByArgs({
				label: i18n.actionBulkMoveWorkItems,
				icon: String(require.toUrl(imagePath + "wibm-icon.png")),
				href: action + "menuProvider.ui.WorkItemBulkMove.move",
				insertIndex: this._insertIndex++
			});

         // Other menu Entries can be added here in the same style as done with the bulk mover
		}
	});
});
