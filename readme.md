#Rowell

##简介

Rowell是为某井开发的一个纯前端的网络界面。Rowell的后台基于刚爷开发的pybbs数据接口，前端界面基于Bootstrap开发。目前的最新版本为0.3.2，支持以下功能：

* 带有session cookie的登入/登出功能，支持Accounts9登录。

* 版面列表，收藏夹列表功能，支持收藏夹中的多级子目录。

* 版内帖子列表及多种相关导航功能（上下页/首页/末页/跳转）

* 帖子阅读（普通帖、精华帖及置底贴）、导航（上下贴/同主题上下贴/主题贴及最新）及删除

* 附件查看、预览、下载与轻松上传

* 普通模式发表新文章，及R/N/S/A模式回复文章，支持随机qmd，默认qmd及匿名发帖。

* 彩色ASCII字符的渲染与显示

* 站内信列表与阅读信件

* 与井上好友喝茶聊天

* 查询用户信息


##如何使用

您可以在下面的网址试用我们的测试版：

    http://www.rowell9.com

或在下面的网址试用由计算机系科协的BYVoid等人搭建的内部服务器版本，支持使用Accounts9账号登录：

	https://rowell.net9.org

Rowell已在Firefox 8.0及以上版本，Chrome 16及以上版本，IE 10及以上版本以及Safari上通过测试。

##开发计划

详见https://gist.github.com/mrroach9/5784324 。

##更新日志
####Version 0.3.3
发布日期：01/25/2015

* 新增：查看用户信息。点击导航栏中用户自己的名字可以查看自己的信息，点击帖子列表/版面列表中的版主/作者链接可以查看其用户信息。
* 版面列表现在优先按照未读排序，第二关键字为原始顺序。用户也可以点击表头中的“未读”，“版名”进行排序。
* 开发者名单现在将通过Github API实时获取，实现自动化，并更新了UI设计。
* 喝茶聊天：
  * 修复了多个窗口下喝茶聊天可能频繁掉线的问题 （by HenryHu）
  * 修复了登出Rowell后聊天仍然在线的问题。
* 其他改动：
  * 支持超大附件上传，最大支持至20M （by Ebonnov）。
  * 解决了GIF附件无法生成缩略图的问题：现在以第一帧为缩略图。
  * 优化了其他数项UI设计。

####Version 0.3.2
发布日期：10/31/2013

大量累积更新与改动。

* 新增：撰写文章时自动保存草稿功能。
* 新增：原生支持Accounts9账号登录（By BYVoid & Roach）。
* 新增：启用全新域名 http://www.rowell9.com/
* 大量UI改动：
  * 在帖子列表中增加了支持快捷删除、转载、编辑帖子的迷你工具栏。
  * 当有未读站内信时，顶栏“站内信”将有新邮件提示（小红点）。
  * 编辑帖子时将以等宽字体显示，便于排版。
  * UI框架更新，字体变大。
  * 修复了彩色ASCII渲染时引文标记的一个错误（By askzy）。
  * 修复了点击帖子/版面/邮件后立即跳至页面顶端的错误，现在在页面载入完毕后再跳至顶端。
* 修复了一系列其他Bug：
  * 修复了xmpp聊天插件可能过于频繁地发送请求的Bug （By henryhu）
  * 修复了无法消除置底贴未读标记的错误。
  * 修复了错误信息有时不能正常显示的错误。

####Version 0.3.1
发布日期：08/22/2013

* 增加了喝茶聊天的功能，包括好友列表及状态信息，发送及接收信息功能（By henryhu）。
* 修复了上一版本中存在的一些Bug。
* 少量UI设计的调整与优化。

####Version 0.3.0
发布日期：06/23/2013

* 支持站内信列表的浏览、导航及信件阅读（By huangs & Roach）。
* 支持文件上传，包括多文件拖拽上传及单击按钮通过文件选择器上传。
* 支持简单的删帖功能（By Tux）。
* 修复了隐含的安全性问题：现在包含session的网址将进行二次跳转，不在URL中显示session。
* 大量UI设计的调整与优化。
* 修复了大量Bug。

目前已知的Bug：

* 文件拖拽上传可能对某些文件管理器在Firefox下无法使用，可能受到影响的文件管理器包括：
  * Dolphin
  * Thunar
* 可能来自pybbs的bug：多文件上传时可能存在上传结束但请求不结束的情况，导致上传无法结束，如遇到此情况请点击“x”删除上传并重新尝试。（已修复）

####Version 0.2.5
发布日期：01/26/2013

* 支持彩色ASCII字符的渲染与显示（By Tux）。
* 支持置底贴的显示、阅读与回复。
* 支持精华帖(b/g/m)标记的显示。
* 登录不再需要输入登录码，可通过自动跳转快捷登录。
* 为图片附件增加了缩略图显示。
* 支持清除全站未读标记。
* 修复了大量bug，优化了部分UI设计，更新了开发者名单。

####Version 0.2.4
发布日期: 08/12/2012

* 支持预览与下载附件。包含附件的帖子会在帖子列表中显示附件图标。帖子内将显示所有图片的预览及其他附件的下载链接。
* 支持清除版内未读标记。
* 自动识别帖子中的网址，提供链接。
* 增加和修改了部分快捷键：发帖键改为Ctrl+P，增加p/l用于同主题下/上一帖，增加f用于清除版内未读标记。
* 修正了若干因快捷键导致的bug。
* 调整了部分UI细节：从帖子返回版面时，将跳转至当前阅读贴附近，便于继续浏览。

####Version 0.2.3
发布日期: 07/26/2012

累积更新。大量改动与新功能上线。

* 增加了一个易扩展的快捷键系统，并添加了一系列快捷键: 使用左右箭头可访问前一页（前一贴）/后一页（后一贴）, 使用p与r快速发帖和回复, 使用ctrl+Enter及Esc快速发布或取消当前贴子。
* 支持匿名发帖。发帖或回帖时将自动检测是否支持匿名。
* 支持随机签名档，系统将读取默认签名档设置（随机或固定编号）。
* 一些UI调整：包括增加了上部的子导航栏，及部分边距的调整。
* 修复了一个ASCII控制字符可能导致的罕见bug。

####Version 0.2.2
发布日期: 07/02/2012

累积更新。大量改动与新功能上线。

* 增加了一个稳定且易于扩展的路径管理系统，并支持访问收藏夹中的子目录。
* 增加了四种同主题导航方式：同主题上一帖/下一贴，查看主题贴及查看同主题最新。
* 在请求超过500ms时，增加了loading图标。
* 用户尝试关闭发帖窗口时，将弹出确认框防止意外丢失文章。
* 其他微小的改动。包括一些bug的修复，对pybbs最新接口的兼容性修复，及一些UI调整（帖子列表中的未读标记栏变宽了）

####Version 0.2.1
发布日期: 06/16/2012

累积更新。大量改动、UI调整与新功能上线。

* 阅读帖子时将以等宽字体显示。
* 通知消息的显示时间从3秒缩短为2秒，用户可点击通知栏任意部位立刻将其关闭。
* 减小了界面整体宽度，从1100px降低为960px，以适应低分辨率显示器。
* 来自pybbs的一个bug得到修复，目前包含0x80的字符将不再导致请求错误。
* 版内帖子列表支持首页、末页及跳转功能。

目前已知Bug：

* 等宽字体目前仍无法完美显示Term界面下的所有ASCII Arts和排版。

####Version 0.2.0
发布日期: 06/15/2012

* 支持在普通模式下发布新帖。
* 支持S/R/N/A模式的帖子回复。目前暂不支持匿名及随机qmd。
* UI上的细节调整。

####Version 0.1.3
发布日期: 06/14/2012

* 发布新帖及回帖时弹出的窗口面板UI设计完毕。
* 首页/末页/同主题上一帖/下一贴/管理收藏夹按钮被加入UI，暂无具体功能实现。
* 调整了底部介绍文字。

####Version 0.1.2
发布日期: 06/14/2012

* 增加了提示信息系统，新的通知将在页面上方弹出。目前支持到达最后一页/第一页/异常网络错误信息。此信息系统易于扩展，可轻松添加其他信息。
* 来自pybbs的改动：返回错误信息时也已支持CORS。相应地，"retry"参数已从bbs_view.js设计中移除。错误检测将完全依赖状态码及状态文字。
* UI上的改进：帖子阅读区增加480px的最小高度，方便短文章的快速阅读。底部介绍文字进行了改动。未读标记更改为一个新的图标。
* 增加了用于统计信息的Google Analysis代码。

####Version 0.1.1
发布日期: 06/10/2012

* 修复了一个之前可能导致最新版Firefox访问失败的Bug，这是由于firefox将ajax返回数据默认作为XML，从而导致XML解析失败。目前设置格式为plain text，以保证各浏览器行为一致。

####Version 0.1
发布日期: 06/10/2012

* 增加了帖子阅读功能，去掉了所有ASCII控制字符，将帖子文本HTML encode后以普通文本显示。同时增加了通过上一帖/下一贴按钮进行导航的功能。

* 修正了一系列bug。

* UI设计的一系列优化。

目前存在的Bug：

* 由于v0.0.4中存在的CORS错误，当用户在最后一贴尝试访问下一贴时将导致错误。(此bug已在v0.1.2得到修复)

####Version 0.0.4
发布日期: 06/06/2012

* 支持版内帖子列表，可通过上一页/下一页按钮进行导航。所有帖子将显示在表格中。
* 修正了一系列bug：包括未进行html encoding导致的注入漏洞，导致版面列表和帖子列表显示不完整的bug等。
* UI设计的一系列优化。

目前存在的Bug:

* 当用户在最后一贴尝试访问下一贴时将导致错误。(此bug已在v0.1.2得到修复)

####Version 0.0.3
发布日期: 06/06/2012

* 支持访问版面列表，“所有版面”和“收藏夹”列表将在表格中显示。
* 增加了次级导航栏，显示用户当前所在位置及路径。

####Version 0.0.2
发布日期: 06/05/2012

* pybbs支持CORS功能。通过此功能实现了登入/登出功能。用户将被跳转至官方登录页面，登录后返回填写授权码进行登录。
* 支持Session cookie以实现自动登录。当用户主动登出时，session cookie也将被移除。
* UI设计增加了页脚介绍及“未实现”标签，以及一系列其他微小改动。


####Version 0.0.1
发布日期: 06/04/2012

首次提交，仅包括Bootstrap设计的基础UI界面，无任何实际功能实现。

