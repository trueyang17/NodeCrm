"use strict";

var fs = require('fs');

var ran1 = function ran1(n, f) {
  var res = '',
      area = '0123456789',
      area2 = '0123456789qazwsxedcrfvtgbyhnujmiklop';

  for (var i = 0; i < n; i++) {
    if (f) {
      res += Math.round(Math.random() * 35);
      continue;
    }

    res += Math.round(Math.random() * 9);
  }

  return res;
};

var arr = [];

for (var i = 1; i <= 99; i++) {
  arr.push({
    "id": i,
    "name": "客户" + (i < 10 ? '0' + i : i),
    "sex": Math.round(Math.random()),
    "email": ran1(10, true) + "@qq.com",
    "phone": ran1(11),
    "QQ": ran1(8, true),
    "weixin": ran1(10, true),
    "type": "重点客户",
    "address": "北京市昌平区回龙观东大街03号",
    "userId": Math.round(Math.random() * 3 + 1),
    "departmentId": Math.round(Math.random() * 3 + 1),
    "time": new Date().getTime(),
    "state": 0
  });
}

fs.writeFileSync('./customer.json', JSON.stringify(arr), 'utf8');