(function () {
  angular.module('app').factory('$httpAjax', function () {
      var apiAddress = 'http://192.168.1.10:8080';
      // var apiAddress = 'http://47.98.251.95:8080';
      // var apiAddress = 'http://localhost:8080';
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
          res.msg = res.msg ? res.msg : '网络繁忙';
          errorCallback(res)
        }
      }
      // 处理请求错误
      function handleError(res, errorCallback) {
          if (res.status === 401) {
              window.location.href ='/index.html';
              return;
          }
        res.msg = res.msg ? res.msg : '网络繁忙';
        errorCallback(res);
      }
      // post请求
      server.post = function(url,params,successCallback,errorCallback,completeBack) {
        init();
        $.ajax({
          url: apiAddress + url,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(params),
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
        $.ajax({
          url: apiAddress + url,
          method: "GET",
          contentType: 'application/json',
          data: JSON.stringify(params),
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
      // put请求
      server.put = function(url,params,successCallback,errorCallback,completeBack) {
          init()
          $.ajax({
              url: apiAddress + url,
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(params),
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
      server.download = function (url) {
        location.href = url;
      };
    return server;
    })
})();
