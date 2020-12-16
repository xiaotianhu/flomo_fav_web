$(document).ready(function () {
  var tabInfo = null;
  var _api = null;

  //检查是否设置了api地址
  var checkApi = async function(){
    let api = await Common.get("apiUrl");
    if(!api) {
      //显示 输入api设置框
      $("#api_url_container").show();
      $("#save_page_info").hide();
      $("#save_url").click(async ()=> {
        var url = $("#api_url").val();
        if(!url) return Common.showMessage("api接口必须填写.");
        await Common.set("apiUrl", url); 
        $("#save_url").html("保存成功");
      });
      return false;
    }
    _api = api;
    return true;
  };

  //获取当前页面相关
  var loadPageInfo = async function(){
    return new Promise(function(resolve){
      chrome.tabs.query({'active': true}, function (tabs) {
        let t = tabs[0];
        let tabInfo = {
          title: t.title,
          url: t.url,
        }
        resolve(tabInfo);
      });
    });
  }

  //初始化
  var init = async function(){
    await checkApi();
    var pageInfo = await loadPageInfo();
    var lastTag = await Common.get("lastTag");
    $("#last_tag").val(lastTag);
    $("#page_title").html(pageInfo.title);
    $("#save_page").click(async () => await doSave());
    var txt = pageInfo.title + "\n" + pageInfo.url;
    $("textarea").html(txt);
  };
  
  //保存
  var doSave = async function(){
    var tag = $("#last_tag").val();
    var txt = $("textarea").html();
    await Common.set("lastTag", tag);
    var content = tag + "\r\n" + txt;
    let req = {
      content: content,
    };
    var resp = await Common.curl(_api, req);
    Common.showMessage(resp.message);
  };

  (async ()=>{
    await init();
  })();
});
