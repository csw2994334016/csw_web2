(function () {
  angular.module('app').factory('$httpAjax', function () {
      var server = {};
      function init(){
          server.data = null;
          server.statusText = '';
          server.code = '';
          server.success = null;
      }
      // 处理请求成功
      function handleSuccess (res, successCallback, errorCallback) {
        if (res.code === '0000') {
          successCallback(res)
        } else {
          res.message = res.message ? res.message : '网络繁忙';
          errorCallback(res)
        }
      }
      // 处理请求错误
      function handleError(res, errorCallback) {
        res.message = res.message ? res.message : '网络繁忙';
        errorCallback(res);
      }
      // post请求
      server.post = function(url,params,successCallback,errorCallback,completeBack) {
        init()
        $.ajax({
          url: url,
          method: 'POST',
          data: params,
          xhrFields: {withCredentials: true},
          crossDomain: true,
          cache:false,
          success:function (response) {
            handleSuccess(response, successCallback, errorCallback)
          },
          error:function (response) {
            handleError(response,errorCallback)
          },
          complete:function () {
            completeBack && completeBack();
            }
        });
      };
      // get请求
      server.get = function(url,params,successCallback,errorCallback,completeBack) {
        init()
        var headers = { 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"};
        $.ajax({
          url: url,
          method: "GET",
          headers:headers,
          xhrFields: {withCredentials: true},
          crossDomain: true,
          cache:true,
          success:function (response) {
            handleSuccess(response, successCallback, errorCallback)
          },
          error:function (response) {
            handleError(response, errorCallback)
          },
          complete:function () {
            completeBack && completeBack();
            }
        });
      };
      server.download = function (url) {
        location.href = url;
      };
    return server;
    })
})();
