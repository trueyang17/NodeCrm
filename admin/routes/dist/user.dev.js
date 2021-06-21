"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express'),
    route = express.Router();

var _require = require('../utils/tools'),
    handleMD5 = _require.handleMD5,
    success = _require.success,
    getDepartInfo = _require.getDepartInfo,
    getJobInfo = _require.getJobInfo,
    getUserInfo = _require.getUserInfo;

var _require2 = require('../utils/promiseFS'),
    writeFile = _require2.writeFile; //=>用户登录


route.post('/login', function (req, res) {
  var _ref = req.body || {},
      _ref$account = _ref.account,
      account = _ref$account === void 0 ? '' : _ref$account,
      _ref$password = _ref.password,
      password = _ref$password === void 0 ? '' : _ref$password;

  password = handleMD5(password);
  var item = req.$userDATA.find(function (item) {
    return (item.name === account || item.email === account || item.phone === account) && item.password === password;
  });

  if (item) {
    req.session.userID = parseFloat(item.id);
    req.session.power = getJobInfo(item.jobId, req).power || '';
    res.send(success(true, {
      power: req.session.power
    }));
    return;
  }

  res.send(success(false, {
    codeText: 'user name password mismatch!'
  }));
}); //=>检测是否登录

route.get('/login', function (req, res) {
  var userID = req.session.userID;

  if (userID) {
    res.send(success(true));
    return;
  }

  res.send(success(false, {
    codeText: 'current user is not logged in!'
  }));
}); //=>退出登录

route.get('/signout', function (req, res) {
  req.session.userID = null;
  req.session.power = null;
  res.send(success(true));
}); //=>获取用户通讯录

route.get('/list', function (req, res) {
  var data = req.$userDATA;
  var _req$query = req.query,
      _req$query$department = _req$query.departmentId,
      departmentId = _req$query$department === void 0 ? 0 : _req$query$department,
      _req$query$search = _req$query.search,
      search = _req$query$search === void 0 ? '' : _req$query$search;

  if (parseFloat(departmentId) !== 0) {
    //分部门显示用户
    data = data.filter(function (item) {
      return parseFloat(item.departmentId) === parseFloat(departmentId);
    });
  }

  if (search !== '') {
    //按姓名，电话，邮箱搜索
    data = data.filter(function (item) {
      return item.name.includes(search) || item.phone.includes(search) || item.email.includes(search);
    });
  }

  data = data.map(function (item) {
    return {
      id: item.id,
      name: item.name,
      sex: item.sex,
      email: item.email,
      phone: item.phone,
      departmentId: item.departmentId,
      department: getDepartInfo(item.departmentId, req).name,
      jobId: item.jobId,
      job: getJobInfo(item.jobId, req).name,
      desc: item.desc
    };
  });

  if (data.length > 0) {
    res.send(success(true, {
      data: data
    }));
    return;
  }

  res.send(success(false, {
    codeText: 'no matching data was found!'
  }));
}); //=>获取用户详细信息

route.get('/info', function (req, res) {
  var _req$query$userId = req.query.userId,
      userId = _req$query$userId === void 0 ? 0 : _req$query$userId;

  if (parseFloat(userId) === 0) {
    userId = req.session.userID;
  }

  var data = getUserInfo(userId, req);

  if ('name' in data) {
    res.send(success(true, {
      data: {
        id: data.id,
        name: data.name,
        sex: data.sex,
        email: data.email,
        phone: data.phone,
        departmentId: data.departmentId,
        department: getDepartInfo(data.departmentId, req).name,
        jobId: data.jobId,
        job: getJobInfo(data.jobId, req).name,
        desc: data.desc
      }
    }));
    return;
  }

  res.send(success(false, {
    codeText: 'no matching data was found!'
  }));
}); //=>增加用户信息

route.post('/add', function (req, res) {
  var $userDATA = req.$userDATA,
      passDATA = null;
  passDATA = Object.assign({
    id: $userDATA.length === 0 ? 1 : parseFloat($userDATA[$userDATA.length - 1]['id']) + 1,
    name: '',
    password: handleMD5('e807f1fcf82d132f9bb018ca6738a19f'),
    sex: 0,
    email: '',
    phone: '',
    departmentId: 1,
    jobId: 1,
    desc: '',
    time: new Date().getTime(),
    state: 0
  }, req.body || {});
  $userDATA.push(passDATA);
  writeFile('./json/user.json', $userDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>修改用户信息

route.post('/update', function (req, res) {
  req.body = req.body || {};
  var $userDATA = req.$userDATA,
      userId = req.body.userId,
      flag = false;
  delete req.body.userId;
  $userDATA = $userDATA.map(function (item) {
    if (parseFloat(item.id) === parseFloat(userId)) {
      flag = true;
      return _objectSpread({}, item, {}, req.body);
    }

    return item;
  });

  if (!flag) {
    res.send(success(false));
    return;
  }

  writeFile('./json/user.json', $userDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>删除用户信息

route.get('/delete', function (req, res) {
  var $userDATA = req.$userDATA,
      flag = false;
  var _req$query$userId2 = req.query.userId,
      userId = _req$query$userId2 === void 0 ? 0 : _req$query$userId2;
  $userDATA = $userDATA.map(function (item) {
    if (parseFloat(item.id) === parseFloat(userId)) {
      flag = true;
      return _objectSpread({}, item, {
        state: 1
      });
    }

    return item;
  });

  if (!flag) {
    res.send(success(false));
    return;
  }

  writeFile('./json/user.json', $userDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>修改（重置）用户密码

route.post('/resetpassword', function (req, res) {
  var $userDATA = req.$userDATA;
  var _req$body = req.body,
      _req$body$userId = _req$body.userId,
      userId = _req$body$userId === void 0 ? 0 : _req$body$userId,
      password = _req$body.password;

  if (parseFloat(userId) === 0) {
    //=>修改登录者的密码
    userId = req.session.userID;
    password = handleMD5(password);
  } else {
    password = handleMD5('e807f1fcf82d132f9bb018ca6738a19f');
  }

  $userDATA = $userDATA.map(function (item) {
    if (parseFloat(item.id) === parseFloat(userId)) {
      return _objectSpread({}, item, {
        password: password
      });
    }

    return item;
  });
  writeFile('./json/user.json', $userDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>获取用户权限

route.get('/power', function (req, res) {
  res.send(success(true, {
    power: req.session.power
  }));
});
module.exports = route;