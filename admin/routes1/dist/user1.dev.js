"use strict";

var express = require('express'),
    route = express.Router();

var _require = require('../utils.js'),
    md5Handle = _require.md5Handle,
    success = _require.success;

route.post('/login', function (req, res) {
  //1.获取用户传来的参数
  var _req$body = req.body,
      account = _req$body.account,
      password = _req$body.password; //2.用MD5对用户传来的密码进行加密

  password = md5Handle(password); //3.判断和数据是否相同，返回符合的一项

  var result = req.$USERDATA.find(function (item) {
    return (item.name === account || item.phone === account || item.email === account) && item.password === password;
  }); //4.

  if (result) {
    var power = (queryJOB(req, result.jobId) || {}).power || '';
    success(res, {
      power: power
    });
    return;
  }

  success(res, {
    code: 1,
    codeText: '账号密码不匹配'
  });
});
module.exports = route;