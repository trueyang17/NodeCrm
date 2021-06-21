let express = require('express');
let qs = require('qs');
let bodyParser = require('body-parser');
let { readFile,writeFile } = require('./utils/promiseFS.js');
let { dataHandle } = require('./utils.js');
let app = express();
let PORT = 9999;
app.listen(PORT,()=>{
    console.log(`服务在端口${PORT}启动`)
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    let path = './json';
    let p1 = readFile(path + '/user.json'),
        p2 = readFile(path + '/job.json'),
        p3 = readFile(path + '/department.json'),
        p4 = readFile(path + '/customer.json'),
        p5 = readFile(path + '/visit.json');
    Promise.all([p1,p2,p3,p4,p5]).then(results=>{
    let [ $USERDATA, $JOBDATA, $DEPARTMENTDATA, $CUSTOMERDATA, $VISITDATA] = results;
    req.$USERDATA = dataHandle($USERDATA) 
    req.$JOBDATA = dataHandle($JOBDATA)    
    req.$DEPARTMENTDATA = dataHandle($DEPARTMENTDATA)    
    req.$CUSTOMERDATA = dataHandle($CUSTOMERDATA)
    req.$VISITDATA = dataHandle($VISITDATA)
    next()
    }).catch(err=>{
        res.status(500);
        res.send(err)
    })
})



app.use('/user',require('./routes1/user1'));
app.use('/job',require('./routes1/job1'));
app.use('/visit',require('./routes1/visit1'));
app.use('/department',require('./routes1/department1'));
app.use('/customer',require('./routes1/customer1'));

app.use((req,res)=>{
    res.status(404);
    res.send(`您请求的资源文件${req.path}不存在`)
})