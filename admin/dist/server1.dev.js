"use strict";

var CONFIG = require('./config'),
    session = require('express-session'),
    bodyParser = require('body-parser');
/*-CREATE SERVER-*/


var express = require('express'),
    app = express();

app.listen(CONFIG.PORT, function () {
  console.log("THE WEB SERVICE IS CREATED SUCCESSFULLY AND IS LISTENING TO THE PORT\uFF1A\n\t".concat(CONFIG.PORT));
});
/*-MIDDLE WARE-*/

app.use(function (req, res, next) {
  var _CONFIG$CROS = CONFIG.CROS,
      ALLOW_ORIGIN = _CONFIG$CROS.ALLOW_ORIGIN,
      CREDENTIALS = _CONFIG$CROS.CREDENTIALS,
      HEADERS = _CONFIG$CROS.HEADERS,
      ALLOW_METHODS = _CONFIG$CROS.ALLOW_METHODS;
  res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.header("Access-Control-Allow-Credentials", CREDENTIALS);
  res.header("Access-Control-Allow-Headers", HEADERS);
  res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
  req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next();
});
app.use(session(CONFIG.SESSION));
app.use(bodyParser.urlencoded({
  extended: false
}));
/*-QUERY DATA-*/

var _require = require('./utils/promiseFS'),
    readFile = _require.readFile;

var _require2 = require('./utils/tools'),
    filterInvalid = _require2.filterInvalid;

app.use(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = filterInvalid;
          _context.t1 = JSON;
          _context.next = 4;
          return regeneratorRuntime.awrap(readFile('./json/customer.json'));

        case 4:
          _context.t2 = _context.sent;
          _context.t3 = _context.t1.parse.call(_context.t1, _context.t2);
          req.$customerDATA = (0, _context.t0)(_context.t3);
          _context.t4 = filterInvalid;
          _context.t5 = JSON;
          _context.next = 11;
          return regeneratorRuntime.awrap(readFile('./json/department.json'));

        case 11:
          _context.t6 = _context.sent;
          _context.t7 = _context.t5.parse.call(_context.t5, _context.t6);
          req.$departmentDATA = (0, _context.t4)(_context.t7);
          _context.t8 = filterInvalid;
          _context.t9 = JSON;
          _context.next = 18;
          return regeneratorRuntime.awrap(readFile('./json/job.json'));

        case 18:
          _context.t10 = _context.sent;
          _context.t11 = _context.t9.parse.call(_context.t9, _context.t10);
          req.$jobDATA = (0, _context.t8)(_context.t11);
          _context.t12 = filterInvalid;
          _context.t13 = JSON;
          _context.next = 25;
          return regeneratorRuntime.awrap(readFile('./json/user.json'));

        case 25:
          _context.t14 = _context.sent;
          _context.t15 = _context.t13.parse.call(_context.t13, _context.t14);
          req.$userDATA = (0, _context.t12)(_context.t15);
          _context.t16 = filterInvalid;
          _context.t17 = JSON;
          _context.next = 32;
          return regeneratorRuntime.awrap(readFile('./json/visit.json'));

        case 32:
          _context.t18 = _context.sent;
          _context.t19 = _context.t17.parse.call(_context.t17, _context.t18);
          req.$visitDATA = (0, _context.t16)(_context.t19);
          next();

        case 36:
        case "end":
          return _context.stop();
      }
    }
  });
});
/*-ROUTE-*/

app.use('/user', require('./routes/user'));
app.use('/customer', require('./routes/customer'));
app.use('/department', require('./routes/department'));
app.use('/visit', require('./routes/visit'));
app.use('/job', require('./routes/job'));
app.use(function (req, res) {
  res.status(404);
  res.send('NOT FOUND!');
});