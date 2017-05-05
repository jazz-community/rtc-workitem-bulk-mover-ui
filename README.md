[![travis-svg][travis-svg]][travis]

# Work Item Bulk Mover Plugin for RTC
While RTC supports to move a single Work Item from one project area to another, it lacks the capability of doing so for a bunch of Work Items at once.

## Motivation
There are a couple of quite common use cases where moving a whole bunch of Work Items is necessary:
 - **Splitting or merging projects**: Project structure changes often need to be reflected in RTC, e.g. by moving a part of a project area to a new one.
 - **Moving to another process template**: There are differente approaches to move to a new process template. One of it is to create an entirely new project area from scratch. Easily transferring the existing work items to the new area is a key requirement.

## How it works
- Select a Work Item Query
- Review the Work Items returned by the query and select which onces to move
- Define the target project area
- Hit the `Move Work Items` button
- If a move is not possible yet, you will be asked to provide new values in case of where no suitable counterpart in the target project area was found. Then hit the `Move Work Items` button again

## Project Status
Be reminded that this plug-in is still in heavy development and should not be considered stable.

## Setup Instructions
This Project is the Client Side Extension of the Work Item Bulk Mover. There is also a server side extension which is required to be able to use this plug-in. As it needs some refactoring first, it is not published yet. As soon as it is, we will provide you with setup instructions.


## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/issues) of this repository to report issues or suggest enhancements.<br>
Pull requests are very welcome.

## Licensing
Copyright (c) Siemens AG. All rights reserved.<br>
Licensed under the [MIT](https://github.com/jazz-community/rtc-workitem-bulk-mover-ui/blob/master/LICENSE) License.

[travis-svg]: https://travis-ci.com/innerjoin/rtc-workitem-bulk-mover-ui.svg?token=ZLKF36p1Jj3sZsR3kyzz&branch=master
[travis]: https://travis-ci.com/innerjoin/rtc-workitem-bulk-mover-ui
