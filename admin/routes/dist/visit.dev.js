"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express'),
    route = express.Router();

var _require = require('../utils/tools'),
    success = _require.success,
    getCustomerInfo = _require.getCustomerInfo,
    getVisitInfo = _require.getVisitInfo;

var _require2 = require('../utils/promiseFS'),
    writeFile = _require2.writeFile; //=>获取回访列表


route.get('/list', function (req, res) {
  var data = req.$visitDATA,
      _req$query$customerId = req.query.customerId,
      customerId = _req$query$customerId === void 0 ? 0 : _req$query$customerId;
  data = data.filter(function (item) {
    return parseFloat(item.customerId) === parseFloat(customerId);
  });
  data = data.map(function (item) {
    return {
      id: item.id,
      customerId: item.customerId,
      customerName: getCustomerInfo(item.customerId, req).name,
      visitText: item.visitText,
      visitTime: item.visitTime
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
}); //=>获取回访信息

route.get('/info', function (req, res) {
  var _req$query$visitId = req.query.visitId,
      visitId = _req$query$visitId === void 0 ? 0 : _req$query$visitId;
  var data = getVisitInfo(visitId, req);

  if ('id' in data) {
    res.send(success(true, {
      data: {
        id: data.id,
        customerId: data.customerId,
        customerName: getCustomerInfo(data.customerId, req).name,
        visitText: data.visitText,
        visitTime: data.visitTime
      }
    }));
    return;
  }

  res.send(success(false, {
    codeText: 'no matching data was found!'
  }));
}); //=>增加新回访

route.post('/add', function (req, res) {
  var $visitDATA = req.$visitDATA,
      passDATA = null;
  passDATA = Object.assign({
    id: $visitDATA.length === 0 ? 1 : parseFloat($visitDATA[$visitDATA.length - 1]['id']) + 1,
    customerId: '',
    visitText: '',
    visitTime: '',
    time: new Date().getTime(),
    state: 0
  }, req.body || {});
  $visitDATA.push(passDATA);
  writeFile('./json/visit.json', $visitDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>修改回访信息

route.post('/update', function (req, res) {
  req.body = req.body || {};
  var $visitDATA = req.$visitDATA,
      visitId = req.body.visitId,
      flag = false;
  delete req.body.visitId;
  $visitDATA = $visitDATA.map(function (item) {
    if (parseFloat(item.id) === parseFloat(visitId)) {
      flag = true;
      return _objectSpread({}, item, {}, req.body);
    }

    return item;
  });

  if (!flag) {
    res.send(success(false));
    return;
  }

  writeFile('./json/visit.json', $visitDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
}); //=>删除回访信息

route.get('/delete', function (req, res) {
  var $visitDATA = req.$visitDATA,
      flag = false;
  var _req$query$visitId2 = req.query.visitId,
      visitId = _req$query$visitId2 === void 0 ? 0 : _req$query$visitId2;
  $visitDATA = $visitDATA.map(function (item) {
    if (parseFloat(item.id) === parseFloat(visitId)) {
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

  writeFile('./json/visit.json', $visitDATA).then(function () {
    res.send(success(true));
  })["catch"](function () {
    res.send(success(false));
  });
});
module.exports = route;