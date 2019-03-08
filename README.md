[![travis-svg][travis-svg]][travis]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjazz-community%2Frtc-workitem-bulk-mover-ui.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjazz-community%2Frtc-workitem-bulk-mover-ui?ref=badge_shield)

# Work Item Bulk Mover Plugin for RTC
While RTC supports to move a single Work Item from one project area to another, it lacks the capability of doing so for a bunch of Work Items at once. This plug-in enables users of web interface to move a selected number of Work Items from one project area to another, based on a query selection.

There used to be a feature called [Bulk Move Work Items between Project Areas](https://jazz.net/wiki/bin/view/Main/BulkMoveWorkItemsBetweenProjectAreas) which was available within the RTC Eclipse Client up and including version 4.0.7. Unfortunately,for today's releases, the plugin does not work anymore. Furthermore the plugins capabilities were limited to the Eclipse Client only. As the most RTC users work within the web interface, it is also more comfortable to have such a plugin available in the web interface.

## Motivation
There are a couple of quite common use cases where moving selected number of Work Items is necessary:
 - **Splitting or merging projects**: From our experience, changes in project structure or team setup often need to be reflected in RTC. As a result, project areas might be split or merged, raising the need to move the affected work items.
 - **Moving to another process template**: There are multiple approaches to move to a new process template. One of it is to create an entirely new project area from scratch. Easily transferring the existing work items to the new area without changing the identifier and links is a key requirement there.
 - **Defect Management**: If, by example, your application is based on a platform, your users or customers may file defects against your application project area where they do not belong. You can then move them to the platform project area, whereas the issuer of the defect will still be able to receive updates on this defect.

## How it works
1. Select a Work Item Query
2. Review the Work Items returned by the query and select which onces to move
3. Define the target project area
4. Hit the `Move Work Items` button
5. If a move is not possible yet, you will be asked to provide new values in case of where no suitable counterpart in the target project area was found. Then hit the `Move Work Items` button again
6. Check out the moved Work Items. Viewing the History of each one will reveal the fields that have changed.
![Work Item Bulk Mover Version 1.0.0 demonstration](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/documentation/WIBM_1.0.gif)

## Setup Instructions
This Project is the Client Side Extension of the Work Item Bulk Mover. There is also a server side extension which is required to be able to use this plug-in. Furthermore, the plug-in somehow needs an extension point in the user interface to which it can be attached. Preferably, we would havel liked to integrate it directly into the Work Items menu, but we failed to do so. Our suggestion is to use a new menu entry from where all your future plug-ins can be served.
- Download the Client Extension from the [Releases](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/releases) page.
- Download the Menu Provider from the [Releases](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/releases) page.
- Download the Web Service from the [Bulk Mover Service Releases](https://github.com/jazz-community/rtc-workitem-bulk-mover-service/releases) page.

Repeat the setup instructions listed below for any plug-in!

### Installation
Deploy just like any other update site:

1. Extract the
   - `com.siemens.bt.jazz.ui.WorkItemBulkMover_updatesite.ini` **file** from the zip file to the `server/conf/ccm/provision_profiles` directory
2. Extract the `com.siemens.bt.jazz.ui.WorkItemBulkMover_updatesite` **folder** to the `server/conf/ccm/sites` directory
3. Restart the server

### Update existing installation
1. Request a server reset in **one** of the following ways:
    * If the server is currently running, call `https://server-address/ccm/admin/cmd/requestReset`
    * Navigate to `https://server-address/ccm/admin?internaltools=true` so you can see the internal tools (on the left in the side-pane). Click on `Server Reset` and press the `Request Server Reset` button
    * If your server is down, you can delete the ccm `built-on.txt` file. Liberty packed with 6.0.3 puts this file in a subfolder of `server/liberty/servers/clm/workarea/org.eclipse.osgi/**/ccm`. The easiest way to locate the file is using your operating system's search capabilites.
2. Delete previously deployed updatesite folder
3. Follow the file extraction steps from the section above
4. Restart the server

## Compatibility
### RTC compatibility
This plug-in has been verified to work on RTC 6.0.3 and onward. According to [Issue 1](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues/1), the author expects the plug-in to work with all RTC releases ever since 4.0, but we cannot confirm this (yet). Are you using an older version of RTC (prior to 6.0.3)? We would really appreciate your feedback on compatibility, drop us a comment [here](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues/1).

### Plugin Compatibility
Make sure that you always have version parity between this UI plugin and the [Work Item Bulk Mover Service](https://github.com/jazz-community/rtc-workitem-bulk-mover-service), as the UI plugin alwways relies on the changes implemented in the Bulk Mover service.

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues) of this repository to report issues or suggest enhancements.

For general contribution guidelines, please refer to [CONTRIBUTING.md](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/CONTRIBUTING.md)

## Licensing
Copyright (c) Siemens AG. All rights reserved.<br>
Licensed under the [MIT](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/LICENSE) License.

[travis-svg]: https://travis-ci.org/jazz-community/rtc-workitem-bulk-mover-ui.svg?branch=master
[travis]: https://travis-ci.org/jazz-community/rtc-workitem-bulk-mover-ui


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjazz-community%2Frtc-workitem-bulk-mover-ui.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjazz-community%2Frtc-workitem-bulk-mover-ui?ref=badge_large)