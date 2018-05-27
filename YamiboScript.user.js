// ==UserScript==
// @name      Yamibo Script
// @version     1.01
// @author      hymbz
// @description 百合会脚本
// @namespace   YamiboScript
// @match       *://bbs.yamibo.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @require     https://cdn.jsdelivr.net/npm/vue
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @supportURL  https://github.com/hymbz/YamiboScript/issues
// @updateURL   https://github.com/hymbz/YamiboScript/raw/master/YamiboScript.user.js
// @downloadURL https://github.com/hymbz/YamiboScript/raw/master/YamiboScript.user.js
// ==/UserScript==

// 添加公共资源
$('body').append(`<div id="ScriptMenu"><div class="SMtitle"><p>脚本设置</p><a href="javascript:;" title="关闭" @click="saveUserSetting"></a></div><div class="SMtab tbn"><ul><li @click="select" class="a"><a href="javascript:;">功能设置</a></li><li @click="select"><a href="javascript:;">其他</a></li><li @click="select"><a href="javascript:;">关于</a></li></ul></div><div class="SMconifg"><template v-if="showWindow == '功能设置'"><div v-for="(value, key) in UserSetting" :class="{disabled: !value.Enable}"><p @click="select(key)">[[key]][[value.Enable?"":"(禁用)"]]</p><template v-if="value.Enable"><div v-for="(v, k) in value" v-if="k!='Enable'"><template v-if="typeof v == 'boolean'"><input class="pc" type="checkbox" v-model="UserSetting[key][k]" checked="">[[k]]</template><template v-else>[[k]]：<input class="px" type="text" v-model.trim.lazy="UserSetting[key][k]"></template></div></template></div></template><template v-else-if="showWindow == '其他'"><button class="pn pnc" @click="ResetUserSetting"><strong>恢复默认设置</strong></button></template><template v-else-if="showWindow == '关于'"><p><strong>当前版本号：[[scriptVersion]]</strong><br><strong>Github地址——<a href="https://github.com/hymbz/YamiboScript">https://github.com/hymbz/YamiboScript</a></strong><br><strong>论坛发补贴地址——<a href="https://bbs.yamibo.com/thread-491966-1-1.html">https://bbs.yamibo.com/thread-491966-1-1.html</a></strong></strong></p></template></div></div><div id="curtain"></div><div id="promptBox"><p></p></div>`);
GM_addStyle(`#ScriptMenu{position:fixed;z-index:999;top:10vh;left:30vw;display:none;flex-wrap:wrap;width:40vw;height:45vh;border-radius:10px;background-color:#6E2B19;box-shadow:0 0 0 #6E2B19}#ScriptMenu .SMtitle{flex-basis:100%;height:2.6rem;cursor:move;color:#FFF}#ScriptMenu .SMtitle p{height:1rem;padding:.75rem 1rem;font-size:1rem;font-weight:bold}#ScriptMenu .SMtitle a{position:absolute;top:12px;right:1rem;width:18px;height:17px;cursor:pointer;border-radius:4px;background:url(https://bbs.yamibo.com/template/oyeeh_com_baihe/img/shdm1020/cls.gif) no-repeat -1px -2px}#ScriptMenu .SMtitle a:hover{background:url(https://bbs.yamibo.com/template/oyeeh_com_baihe/img/shdm1020/cls.gif) no-repeat -1px -21px}#ScriptMenu .SMtab{flex-basis:15%;height:calc(100% - 4.5rem - 2px);margin:0;padding:1rem 0;text-align:right;border-width:1px;border-color:#6E2B19;border-bottom-style:solid;border-left-style:solid;background-color:#FFEEBA;box-shadow:0 5px 2px -2px #888 inset}#ScriptMenu .SMtab li:first-of-type{border-top:1px solid #dbc38c}#ScriptMenu .SMconifg{overflow:auto;flex-basis:0;flex-grow:1;height:calc(100% - 4.5rem - 2px);padding:2rem 1.5rem 0;border-width:1px;border-color:#6E2B19;border-right-style:solid;border-bottom-style:solid;background-color:#FFF5D7;box-shadow:0 5px 2px -2px #888 inset}#ScriptMenu .SMconifg>div{margin-bottom:2rem;padding:1rem;border-width:1px;border-style:solid;border-color:#6e2b19}#ScriptMenu .SMconifg>div p:first-child{width:max-content;margin-top:-1.8rem;padding:0 4px;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#6e2b19;background-color:#FFF5D7;-webkit-touch-callout:none;-khtml-user-select:none}#ScriptMenu .SMconifg>div>div{display:inline-block;margin-right:2rem}#ScriptMenu .SMconifg>div>div input{margin:.5rem 0}#ScriptMenu .SMconifg>div.disabled{border-color:darkgray}#ScriptMenu .SMconifg>div.disabled p{color:darkgray}#promptBox{position:fixed;z-index:-1;top:calc(50vh - 200px);right:0;left:0;display:flex;align-items:center;justify-content:center;width:100%;height:80px;margin:auto;opacity:0;font-size:3rem;line-height:80px}#promptBox p{width:auto;padding:0 15px;color:#FFF;background-color:#000}#promptBox.show{z-index:999;animation:showPromptBox 2s linear}@keyframes showPromptBox{0%{opacity:0}10%{opacity:.8}40%{opacity:.8}100%{opacity:0}}@-webkit-keyframes showPromptBox{0%{opacity:0}10%{opacity:.8}40%{opacity:.8}100%{opacity:0}}#curtain{position:fixed;z-index:2;top:0;left:0;display:none;width:100vw;height:100vh;opacity:.3;background-color:#000}#curtain.show{display:inline}.lastReadTag{border-width:2px;border-style:solid;border-color:var(--lastReadTagColor)}a.lastReadTag{margin-left:1rem;padding:1px 4px;color:var(--lastReadTagColor);border-radius:6px 0 0 6px;font-weight:bold}div.lastReadTag{display:initial;margin-left:-0.4rem;padding:1px;color:#ffedbb;border-radius:0 6px 6px 0;background-color:var(--lastReadTagColor)}.lastReadTag.one{border-radius:6px}#threadlisttableid tbody:nth-child(2n) div.lastReadTag{color:#fff6d7}.tl th a:visited,.tl td.fn a:visited{color:#6E2B19}.header-tool.y{width:auto !important}`);


// 导入用户配置
let ScriptMenu = new Vue({
  el: '#ScriptMenu',
  delimiters: ["[[", "]]"],
  data: {
    UserSetting: "",
    showWindow:"功能设置",
    scriptVersion: GM_info.script.version
  },
  methods: {
    select: function (event) {
      if(typeof event === "string"){
        this.UserSetting[event].Enable = !this.UserSetting[event].Enable;
      }else{
        if(event.currentTarget.className != "a"){
          $(event.currentTarget).siblings().removeClass("a");
          event.currentTarget.className = "a";
          this.showWindow = event.currentTarget.children[0].innerText;
        }
      }
    },
    saveUserSetting: function () {
      GM_setValue("UserSetting",JSON.stringify(ScriptMenu.UserSetting));
      document.getElementById('ScriptMenu').style.display = 'none';
    },
    ResetUserSetting: function () {
      ScriptMenu.UserSetting = {
        "漫画阅读":{
          "Enable" : true,
          "双页显示": true,
          "页面填充": true,
          "点击翻页": false
        },
        "记录阅读历史":{
          "Enable":true,
          "上次阅读进度标签颜色":"#6e2b19",
          "保留天数":-1
        },
        "功能增强":{
          "Enable":true,
          "关闭快捷导航的跳转":true,
          "修正点击页数时的跳转判定":true,
          "固定导航条":true
        }
      };
      GM_setValue("UserSetting",JSON.stringify(ScriptMenu.UserSetting));
      prompt("已恢复默认设置");
    }
  }
});

if(GM_getValue("UserSetting","")){
  ScriptMenu.UserSetting = JSON.parse(GM_getValue("UserSetting"));
}else{
  ScriptMenu.ResetUserSetting();
}

// 添加脚本设置窗口
$("#mycp_menu").append(`<a href="javascript:;" onclick="document.getElementById('ScriptMenu').style.display = 'flex';">脚本设置</a>`);
$("#ScriptMenu").draggable();



// 显示提示
let prompt = function (text) {
  $("#promptBox p").text(text).parent().addClass("show");
  setTimeout('document.getElementById("promptBox").className="";',2100);
};

let getTop = function(event){
  return event.getBoundingClientRect().top+document.body.scrollTop+document.documentElement.scrollTop;
};


if(ScriptMenu.UserSetting["功能增强"]["关闭快捷导航的跳转"])
  document.querySelector("#qmenu a").setAttribute("href","javascript:;");
if(ScriptMenu.UserSetting["功能增强"]["固定导航条"])
  document.getElementsByClassName("header-stackup")[0].style.position = "fixed";


// 判断当前页是帖子
if(RegExp("thread(-\\d+){3}|mod=viewthread").test(document.URL)){

  // 启用漫画阅读模式
  if(fid === 30 && ScriptMenu.UserSetting["漫画阅读"].Enable){
    GM_addStyle(`#comicShow{top:0;left:0;display:none;flex-flow:row-reverse wrap;justify-content:center;width:100vw;background-color:#FFF}#comicShow img{display:inline-block;max-width:100%;height:100%;margin:auto;vertical-align:middle;image-rendering:-webkit-optimize-contrast}#comicShow>[index]{display:flex;flex-basis:100vw;justify-content:center;width:50vw;height:100vh;margin:1rem 0}#comicShow>[index="end"]{z-index:3;flex-basis:100vw !important;height:1rem;margin:2rem;font-size:2rem}#comicShow.TwoPage>div.left{flex-basis:50vw !important}#comicShow.TwoPage>div.left img{margin-right:0}#comicShow.TwoPage>div.right{flex-basis:50vw !important}#comicShow.TwoPage>div.right img{margin-left:0}.tc{display:flex;justify-content:center;margin:0}#sidebar{position:fixed;z-index:1;width:15%;height:100%;opacity:.6;color:#FFF;background-color:black}#sidebar>div{padding:14px;border-color:#FFF !important;border-bottom:1px solid #CCC !important}#fp-nav ul li .fp-tooltip{color:black}#Menu{position:fixed;z-index:2;top:0;left:-281px;width:280px;height:100%;transition:left 1s;opacity:.9;background-color:#03A9F4}#Menu .MenuItem{width:100%;height:3.5rem;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;border-color:#FFF;border-bottom-style:solid;background-color:#2196F3}#Menu .MenuItem:nth-child(1){cursor:default;background-color:var(--Blue1)}#Menu .MenuItem p{position:relative;z-index:100;margin:0 0 1em;text-align:center;color:#000;font-size:25px;line-height:3.5rem}#Menu .MenuItem .MenuItemSwitchText{position:absolute;width:100%}#Menu .MenuItem .MenuItemSwitchText:nth-child(1){text-align:left;color:#3F51B5}#Menu .MenuItem .MenuItemSwitchText:nth-child(2){text-align:right;color:#2196F3}#Menu .MenuItem .MenuItemSwitch{position:absolute;height:3px;border-width:0 15px 52px 0;border-style:solid solid solid solid;border-color:#2196F3 #2196F3 transparent transparent;background-color:#3F51B5}#Menu .MenuItem.bottom{position:absolute;bottom:0;border-top-style:solid}#Menu.showMenu{top:0;left:0}#scrolltop{z-index:3;transition:left .8s}#scrolltop.left{right:auto !important;left:-2px !important}#scrolltop.hide{left:-45px !important}[id^="PageControl"]{position:fixed;z-index:1;top:0;width:50vw;height:100vh}#PageControlLeft{left:0}#PageControlRight{right:0}`);
    $('body').append(`<div id="comicRead"><div id="Menu"><div class="MenuItem"></div><div v-if="itemName!='Enable'" v-for="(item,itemName) in readSetting"class="MenuItem" :switch="item" :setting="itemName"@click="readSetting[itemName]=!item"><p class="MenuItemSwitchText">&nbsp;&nbsp;關</p><p class="MenuItemSwitchText">開&nbsp;&nbsp;</p><div class="MenuItemSwitch" :style="{width: item?'88%':'6%',transition: 'width .9s'}"></div><p>[[itemName]]</p></div><div class="MenuItem bottom" @click="download"><p>[[comicDownloadData]]</p></div></div><div id="comicShow" :class="{TwoPage:readSetting['双页显示']}" v-if="ComicImgInfo[0]"><div class="right" index="fill" v-if='readSetting["双页显示"] && fill' style='visibility:hidden'><img alt="fill" :src="ComicImgInfo[0].src"></div><div v-for="(LineComicImg,index) in ComicImgInfo" :index="index":class="LineComicImg.longImg?'longImg':(LineComicImg.longImgFlag?LineComicImg.right:fill^LineComicImg.right)?'right':'left'"><img :alt="index+1" :src=LineComicImg.src v-on:load="++imgLoadNum":style="{height:LineComicImg.longImg && LineComicImg.imgRatio > windoeRatio?'auto':'100%'}"><a :name=index+1></a></div><div class="right" index="fill" v-if='readSetting["双页显示"] && fill && ComicImgInfo[ComicImgInfo.length - 1].longImgFlag?ComicImgInfo[ComicImgInfo.length - 1].right:!ComicImgInfo[ComicImgInfo.length - 1].right' style='visibility:hidden'><img alt="fill" :src="ComicImgInfo[ComicImgInfo.length - 1].src"></div><a index="end" name="end" href="javascript:;" title="评论"><h1>End</h1></a><template v-if="readSetting['点击翻页']"><div id="PageControlLeft" @click="scrollPage(false)"></div><div id="PageControlRight" @click="scrollPage(true)"></div></template></div></div>`);

    PageNum = 0;
    comicImgList = [];

    let List = document.querySelectorAll(".t_fsz img"), i = List.length;
    while (i--){
      if(List[i].getAttribute("file") && !List[i].getAttribute("file").includes(".yamibo.com/static/image/")){
        List[i].setAttribute("src",List[i].getAttribute("file"));
        comicImgList.push(List[i]);
      }
    }


    comicReadWindow = new Vue({
      el: '#comicRead',
      delimiters: ["[[", "]]"],
      data: {
        windoeRatio:window.innerWidth/window.innerHeight,
        ComicImgInfo: Array(),
        readSetting: ScriptMenu.UserSetting["漫画阅读"],
        comicImgLength: 0,
        imgLoadNum: 0,
        comicDownloadData: "下载",
        fill: false
      },
      methods:{
        updatedData: function(){
          // 处理图片
          let newLine = true;
          let longImgFlag = false;
          const aspectRatio = window.innerWidth/2/window.innerHeight;
          this.ComicImgInfo = Array();

          let i = comicImgList.length;
          while (i--){
            let imgInfo = {
              "src":comicImgList[i].getAttribute("file"),
              "imgRatio":comicImgList[i].width/comicImgList[i].height
            };
            if(imgInfo.src.indexOf("http") != 0)
              imgInfo.src = "https://bbs.yamibo.com/" + imgInfo.src;
            if(imgInfo.imgRatio > aspectRatio){
              longImgFlag = true;
              imgInfo["longImg"] = true;
              newLine = true;
            }else{
              if(longImgFlag)
                // 当出现过一个longImg后，之后的图片都不会再收到fill开启与否的影响
                imgInfo["longImgFlag"] = true;
              imgInfo["right"] = newLine;
              newLine = !newLine;
            }
            comicReadWindow.ComicImgInfo.push(imgInfo);
          };

          this.comicImgLength = this.ComicImgInfo.length - 1;
        },
        download: function(){
          // 下载漫画
          let zip = new JSZip();
          let comicDownloadNum = 0;
          let imgIndex = this.ComicImgInfo.length;

          while(imgIndex--){
            let indext = imgIndex + 1;
            GM_xmlhttpRequest({
              method: "GET",
              url: this.ComicImgInfo[imgIndex].src,
              headers: {
                referer: RegExp("(.+?/){2}").exec(this.ComicImgInfo[imgIndex].src)[0]
              },
              responseType: "blob",
              onload: function(xhr,index=indext) {
                if(xhr.status === 200){
                  zip.file(`${index}.${xhr.finalUrl.replace(/.+\./,"")}`, xhr.response);
                  comicReadWindow.comicDownloadData = `${++comicDownloadNum}/${comicReadWindow.ComicImgInfo.length}`;
                  if(comicDownloadNum === comicReadWindow.ComicImgInfo.length){
                    comicReadWindow.comicDownloadData = "下载完毕";
                    zip.generateAsync({type:"blob"}).then(function (content) {
                      saveAs(content, `${document.getElementById("thread_subject").innerHTML}.zip`);
                    });
                  }
                }else{
                  console.log("下载出错");
                }
              }
            });
          }
        },
        scrollPage: function(type) {
          const nowScrollTop = getTop(document.querySelector(`#comicShow [index='${PageNum}']`));
          let nextScrollTop = nowScrollTop;
          while (nextScrollTop === nowScrollTop) {
            if (type) {
              if (PageNum === 'end')
                PageNum = comicReadWindow.comicImgLength;
              else if (PageNum > 0)
                PageNum--;
              else
                return;
            }else {
              if (PageNum === comicReadWindow.comicImgLength)
                PageNum = 'end';
              else if (PageNum <= comicReadWindow.comicImgLength + 1)
                PageNum++;
              else
                return;
            }
            if(PageNum === "end")
              window.scrollTo(0,document.body.clientHeight);
            else
              nextScrollTop = getTop(document.querySelector(`#comicShow [index='${PageNum}']`));
          }
          $('html, body').animate({scrollTop: nextScrollTop}, 0);
        }
      },
      updated:function(){
        this.windoeRatio = window.innerWidth/window.innerHeight;
        this.$nextTick(function () {
          this.fill = this.readSetting["页面填充"] && this.ComicImgInfo[0] && !this.ComicImgInfo[0].longImg;
          try {
            $('html, body').animate({scrollTop: getTop(document.querySelector(`[index='${PageNum}']`))}, 0);
          } catch (error) {
            $('html, body').animate({scrollTop: getTop(document.querySelector(`[index='0']`))}, 0);
          }
        });
      }
    });

    $('#ct .authi:eq(1)').append('<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>');
    history.scrollRestoration = "manual";

    document.getElementById("comicReadMode").addEventListener('click',function(){
      if(comicReadWindow.imgLoadNum || confirm(`图片未全部加载完毕，请确认所有图片均已加载完毕\n当前加载进度：${comicReadWindow.imgLoadNum}/${comicImgList.length}`) === true){
        // 绑定滚动事件
        let scrollPage = function (e) {comicReadWindow.scrollPage(e.deltaY<0);};
        document.addEventListener("wheel", scrollPage);

        // 修改侧边滚动栏
        scrolltopHtml = document.getElementById("scrolltop").innerHTML;
        $("#scrolltop").addClass("left").empty().append(`
          <span hidefocus="true">
            <a href="javascript:;" class="returnlist" title="菜单"
            onclick=""></a>
          </span>
          <span hidefocus="true">
            <a href="javascript:;" title="退出" class="scrolltopa"></a>
          </span>
        `);
        // 显示侧边栏
        document.querySelector("#scrolltop>span").addEventListener('click',function() {
          document.getElementById("Menu").className = 'showMenu';
          document.getElementById("scrolltop").className += ' hide';
          document.getElementById("curtain").className = 'show';
        });
        // 关闭侧边栏
        document.getElementById("curtain").addEventListener('click',function(){
          document.getElementById("Menu").className = '';
          document.getElementById("scrolltop").className = 'left';
          document.getElementById("curtain").className = '';
        });
        // 退出漫画阅读
        let exitComicRead = function (){
          document.removeEventListener("wheel", scrollPage);
          $("#scrolltop").empty().append(scrolltopHtml).removeClass("left");
          document.body.style.overflow = 'auto';
          document.getElementById("comicShow").style.display = 'none';
          if(ScriptMenu.UserSetting["功能增强"]["固定导航条"])
            document.getElementsByClassName("header-stackup")[0].style.position = "fixed";
        };
        // 退出并返回顶部
        document.querySelectorAll("#scrolltop>span")[1].addEventListener('click',function() {
          exitComicRead();
          window.scrollTo('0','0');
        });
        // 退出并跳至评论（先试着跳转至评分，没有则跳至评论楼层
        document.querySelector("#comicShow a[name='end']").addEventListener('click',function(){
          exitComicRead();
          try {
            $('html, body').animate({ scrollTop: getTop(document.getElementsByClassName("psth")[0]) }, 0);
          } catch (error) {
            let List = document.querySelectorAll("#postlist>div");
            for (let i=0; i < List.length; i++){
              if(List[i].clientHeight > 3000){
                $('html, body').animate({ scrollTop: getTop(List[i]) }, 0);
                break;
              }
            }
          }
        });

        // 在所有图片加载完毕前，每隔一秒重新更新一次
        let updated = function(){
          if(document.readyState != "complete"){
            comicReadWindow.updatedData();
            setTimeout(updated,1000);
          }
        };
        updated();

        document.body.style.overflow = 'hidden';
        document.getElementById("comicShow").style.display = 'flex';
        if(ScriptMenu.UserSetting["功能增强"]["固定导航条"])
          document.getElementsByClassName("header-stackup")[0].style.position = "relative";
        comicReadWindow.$forceUpdate();
      }
    });

    let resizeFlag = true;
    window.addEventListener("resize",function() {
      if(resizeFlag){
        comicReadWindow.updatedData();
        resizeFlag = false;
        setTimeout(function(){resizeFlag = true;},100);
      }
    });

    comicReadWindow.updatedData();
  }

  // 启用记录阅读进度
  if(ScriptMenu.UserSetting["记录阅读历史"].Enable){
    let lastFloor;

    GM_xmlhttpRequest({
      method: "GET",
      url: `https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`,
      onload: function(data){
        let json = JSON.parse(data.responseText);
        lastFloor = json.Variables.thread.allreplies;
      }
    });

    // 在关闭和切换标签页时重新储存数据
    document.addEventListener("visibilitychange", function(){
      if(!document.visible && document.body.style.overflow != 'hidden'){
        let anchorList = [...document.querySelectorAll("[id^=pid]")];
        let lTop = document.documentElement.scrollTop;
        while(getTop(anchorList[0]) < lTop)
          anchorList.shift();

        GM_setValue(tid,JSON.stringify({
          "page":document.querySelector("#pgt strong")?document.querySelector("#pgt strong").innerHTML:'1',
          "lastFloor":lastFloor,
          "lastAnchor":anchorList[0].id,
          "time":new Date().getTime()
        }));
      }
    });
  }
}


// 判断当前页是板块
if(RegExp("forum(-\\d+){2}|mod=forumdisplay").test(document.URL)){

  // 启用记录阅读进度
  if(ScriptMenu.UserSetting["记录阅读历史"].Enable){
    GM_addStyle(`:root {--lastReadTagColor: ${ScriptMenu.UserSetting["记录阅读历史"]["上次阅读进度标签颜色"]}!important;}`);

    // 添加上次阅读进度提示标签
    let addLastReadTag = function (){
      let List = document.querySelectorAll("tbody[id^=normalthread]");
      for (let i=0, length = List.length; i < length; i++){
        let tid = List[i].id.split("_")[1];
        ts = $(List[i]);
        ts.find(".lastReadTag").remove();
        if(GM_getValue(tid)){
          let lastReadInfo = JSON.parse(GM_getValue(tid));
          let lastReplies = ts.find(".num a").text() - 0 - lastReadInfo.lastFloor;
          ts.find(".common").append(`
            <a href="thread-${tid}-${lastReadInfo.page}-1.html#${lastReadInfo.lastAnchor}"
             class="lastReadTag ${lastReplies?'':'one'}" onclick="atarget(this)">回第${lastReadInfo.page}页</a>
            ${lastReplies?`<div class="lastReadTag">+${lastReplies}</div>`:""}
          `);
        }
      }
    };
    addLastReadTag();

    // 切换回当前页时重新添加提示标签
    document.addEventListener("visibilitychange", function() {
      if(!document.hidden)
        setTimeout(addLastReadTag, 100);
    });

    // 点击下一页后添加提示标签
    document.getElementById("autopbn").addEventListener('click',function(){
      if(document.getElementById("autopbn").text === "下一页 »")
        addLastReadTag();
      else
        setTimeout(arguments.callee,100);
    });

    // 删除超过指定天数的阅读记录
    if(ScriptMenu.UserSetting["记录阅读历史"]["保留天数"] != -1){
      let timeNum = new Date().getTime() - ScriptMenu.UserSetting["记录阅读历史"]["保留天数"] * 24 * 60 * 60;
      LastReadList = GM_listValues();
      LastReadList.splice(-1);
      let i = LastReadList.length;
      while(i--){
        if(parseInt(GM_getValue(LastReadList[i]).split('"time":')[1]) < timeNum)
          GM_deleteValue(LastReadList[i]);
      }
    }
  }

  if(ScriptMenu.UserSetting["功能增强"]["修正点击页数时的跳转判定"]){
    let List = document.querySelectorAll(".tps>a");
    let i = List.length;
    while (i--)
      List[i].setAttribute("onclick","atarget(this)");
  }

  GM_addStyle(".tl .num{width: 80px !important;}");

}
