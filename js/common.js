Configs = {
  "serverPort": 9091,
  "serverUrl": "http://127.0.0.1",
  "version": "1.0",
}

Common = {
  //展示消息
  "showMessage": function(msg, delay=1000){
    document.querySelector("#msg-content p").innerText = msg;
    document.querySelector("#msg").style = "display:block";
    if(delay != null){
      setTimeout(function(){
        $("#msg").fadeOut();
      }, delay);
    }
  },
  //用jquery请求 data空为GET请求 不空为POST请求
  "curl": function(fullUrl, data = null){
    if(data == null){
      var req = {
        url: fullUrl,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
      };
    }else{
      var req = {
        url: fullUrl,
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data:JSON.stringify(data),
      };
    }
    try{
      return $.ajax(req).then((resp)=>{
        if(!resp || typeof resp == "undefined"){
          Common.showMessage("接口返回数据错误。");
        }
        return resp;
      });
    }catch(e){
      console.log(e);
      Common.showMessage("服务错误，检查服务是否启动。");
    }
  },

  //保存本地
  "set": async function(k, value){
    var d = {};
    d[k] = value;
    return new Promise(function(resolve){
      chrome.storage.sync.set(d, function() {
        resolve();
      }); 
    });
  },
  //本地读取
  "get": async function(key){
    return new Promise(function(resolve){
      chrome.storage.sync.get(key, function(result) {
        if(typeof result[key] == 'undefined') resolve(null);
        resolve(result[key]);
      }); 
    });
  },
}
