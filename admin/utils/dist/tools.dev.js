"use strict";

function handleMD5(val) {
  val = val.substring(4);
  val = val.split('').reverse().join('');
  val = val.substring(4);
  return val;
}

function filterInvalid(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.filter(function (item) {
    return parseFloat(item.state) === 0;
  });
}

function success() {
  var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaults = {
    code: flag ? 0 : 1,
    codeText: flag ? 'OK' : 'NO'
  };
  return Object.assign(defaults, options);
}

function getDepartInfo(departmentId, req) {
  return req.$departmentDATA.find(function (item) {
    return parseFloat(item.id) === parseFloat(departmentId);
  }) || {};
}

function getJobInfo(jobId, req) {
  return req.$jobDATA.find(function (item) {
    return parseFloat(item.id) === parseFloat(jobId);
  }) || {};
}

function getUserInfo(userId, req) {
  return req.$userDATA.find(function (item) {
    return parseFloat(item.id) === parseFloat(userId);
  }) || {};
}

function getCustomerInfo(customerId, req) {
  return req.$customerDATA.find(function (item) {
    return parseFloat(item.id) === parseFloat(customerId);
  }) || {};
}

function getVisitInfo(visitId, req) {
  return req.$visitDATA.find(function (item) {
    return parseFloat(item.id) === parseFloat(visitId);
  }) || {};
}

module.exports = {
  handleMD5: handleMD5,
  filterInvalid: filterInvalid,
  success: success,
  getDepartInfo: getDepartInfo,
  getJobInfo: getJobInfo,
  getUserInfo: getUserInfo,
  getCustomerInfo: getCustomerInfo,
  getVisitInfo: getVisitInfo
};