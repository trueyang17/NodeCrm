"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var qs = require('qs');

var bodyParser = require('body-parser');

var _require = require('./utils/fsPromise.js'),
    readFile = _require.readFile,
    writeFile = _require.writeFile;

var _require2 = require('./utils.js'),
    dataHandle = _require2.dataHandle;

var app = express();
var PORT = 9999;
app.listen(PORT, function () {
  console.log("\u670D\u52A1\u5728\u7AEF\u53E3".concat(PORT, "\u542F\u52A8"));
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  var path = './json';
  var p1 = readFile(path + '/user.json'),
      p2 = readFile(path + '/job.json'),
      p3 = readFile(path + '/department.json'),
      p4 = readFile(path + '/customer.json'),
      p5 = readFile(path + '/visit.json');
  Promise.all([p1, p2, p3, p4, p5]).then(function (results) {
    var _results = _slicedToArray(results, 5),
        $USERDATA = _results[0],
        $JOBDATA = _results[1],
        $DEPARTMENTDATA = _results[2],
        $CUSTOMERDATA = _results[3],
        $VISITDATA = _results[4];

    req.$USERDATA = dataHandle($USERDATA);
    req.$JOBDATA = dataHandle($JOBDATA);
    req.$DEPARTMENTDATA = dataHandle($DEPARTMENTDATA);
    req.$CUSTOMERDATA = dataHandle($CUSTOMERDATA);
    req.$VISITDATA = dataHandle($VISITDATA);
    next();
  })["catch"](function (err) {
    res.status(500);
    res.send(err);
  });
});
app.use('/user', require('./routes1/user1'));
app.use('/job', require('./routes1/job1'));
app.use('/visit', require('./routes1/visit1'));
app.use('/department', require('./routes1/department1'));
app.use('/customer', require('./routes1/customer1'));
app.use(function (req, res) {
  res.status(404);
  res.send("\u60A8\u8BF7\u6C42\u7684\u8D44\u6E90\u6587\u4EF6".concat(req.path, "\u4E0D\u5B58\u5728"));
});