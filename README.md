[![travis-svg][travis-svg]][travis]

# Work Item Bulk Mover Plugin for RTC
While RTC supports to move a single Work Item from one project area to another, it lacks the capability of doing so for a bunch of Work Items at once. This plug-in allows you to move a selected number of Work Items from one project area to another, based on a query selection.

## Motivation
There are a couple of quite common use cases where moving selected number of Work Items is necessary:
 - **Splitting or merging projects**: From our experience, changes in project strucutre or team setup often need to be reflected in RTC. As a result, project areas might be splitted or merged, raising the need to move the affected work items.
 - **Moving to another process template**: There are multiple approaches to move to a new process template. One of it is to create an entirely new project area from scratch. Easily transferring the existing work items to the new area without changing the identifier and links is a key requirement.

## How it works
1. Select a Work Item Query
![Work Item Query Selection](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/documentation/query-selection.png)
2. Review the Work Items returned by the query and select which onces to move
3. Define the target project area
4. Hit the `Move Work Items` button
![Work Item Selection - Prepare Move](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/documentation/workitem-list.png)
5. If a move is not possible yet, you will be asked to provide new values in case of where no suitable counterpart in the target project area was found. Then hit the `Move Work Items` button again
![Move not possible, provide a mapping](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/documentation/mapping-required.png)
6. Check out the moved Work Items. Viewing the History of each one will reveil the fields that have changed.
![Move not possible, provide a mapping](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/documentation/moved-workitem.png)

## Project Status
Be reminded that this plug-in is still in heavy development and should not be considered stable.

## Setup Instructions
This Project is the Client Side Extension of the Work Item Bulk Mover. There is also a server side extension which is required to be able to use this plug-in.
- Download the Client Extension from the [Releases](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/releases) page.
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

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues) of this repository to report issues or suggest enhancements.<br>
Pull requests are very welcome.

## Licensing
Copyright (c) Siemens AG. All rights reserved.<br>
Licensed under the [MIT](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/LICENSE) License.

[travis-svg]: https://travis-ci.org/jazz-community/rtc-workitem-bulk-mover-ui.svg?branch=master
[travis]: https://travis-ci.org/jazz-community/rtc-workitem-bulk-mover-ui
