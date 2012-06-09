#Rowell v0.0.4

##Introduction

Rowell is a pure front-end web UI for you-know-which bbs. The web terminal relies on pybbs developed by Henryhu as back-end data exchange interface, and
Bootstrap from Twitter as the front-end framework. 

Rowell is still being developed and has released its 0.0.4 version, which supports login/logout with session cookies, all boards listing and fav boards
listing (sub-folders in favBoard are not supported yet), posts listing in boards, and a basic user interface. 

##How to Use it

You can now try our alpha version at:

    http://bbs9.roach-works.com

Later we will try to set a build on the department internal servers. However since it is pure front-end, you can simply checkout all codes, and open index.html as a local webpage in your browser, or build it anywhere that supports HTTP service. Note that if Rowell is opened locally, it will be unable to save cookies and therefore cannot hold your login informations.

Rowell has been tested on Firefox 8+ and Chrome 19+ browsers. However, since Rowell greatly uses CORS, ajax and other techniques in developing, it may fail on elder versions of Firefox and Chrome, and may fail for unknown problem on IE. We will keep improving your experience on all browsers by efforts on compatibility, but we claim that 

WE WILL NEVER BE RESPONSIBLE FOR IE USERS!!!

##Development Progress

In the coming series of versions more functionals will be introduced including reading posts, posting and replying to posts in different modes, a better navigation in viewing boards and posts, and possible searching functions.

Several bugs are known for now, including a cross-domain error when pybbs returns error message, bad displaying on different resolutions and imcompatibility on other browsers. For any suggestions and bug reports, please contact Wenqi Zhang (Mr.Roach) at:

* zhangwenqi1988[at]gmail[dot]com

##Change Logs

####Version 0.0.4
Release date: 06/06/2012

* Board viewing with next/prev button is supported, with all posts listed in tables.

* Several bug fixed, including html encoding problem that may cause injection, and incomplete board and post listing bug.

* Some refinement on the UI design.

Current existing bug:

* When reaching the bottom of a board, next button will lead to an error since incomplete CORS support.

####Version 0.0.3
Release date: 06/06/2012

* Board list viewing is supported, all boards(or favourite boards) are displayed in tables.

* Secondary navigation bar now works, displaying the current path of user's location.

####Version 0.0.2
Release date: 06/05/2012

* Login and logout functional added, with CORS newly supported from pybbs. Users will be redirected to default pybbs login page, then input authorization code back. 

* Session cookie is stored. When user logs out, the session cookie will be removed.

* Footers and "unimplemented" popup are added to UI. Several other minor improvement on UI design.


####Version 0.0.1
Release date: 06/04/2012

First build. Basic UI framework built based on Twitter Bootstrap. No actural functions supported.

