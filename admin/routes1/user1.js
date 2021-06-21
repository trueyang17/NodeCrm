let express = require('express'),
    route = express.Router();
let {md5Handle, success,} = require('../utils.js');
route.post('/login',(req,res)=>{
    //1.获取用户传来的参数
    let { account,password } = req.body;
    //2.用MD5对用户传来的密码进行加密
    password = md5Handle(password);
    //3.判断和数据是否相同，返回符合的一项
    let result = req.$USERDATA.find(item=>{
        return (item.name === account || item.phone === account || item.email === account)  && item.password === password
    })
    //4.
    if (result) {
        let power = (queryJOB(req,result.jobId) || {}).power || '';
        success(res,{
            power
        });
        return
    }
  
    success(res,{
        code:1,
        codeText:'账号密码不匹配'
    })
})
module.exports = route;   