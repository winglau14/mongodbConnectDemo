const config = require("./common/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
const router = express.Router();
//api接口校验及权限拦截
const jwt= require('jsonwebtoken');
const expressJwt = require('express-jwt');
//用户模块路由
const user = require("./routes/user");
//首页默认路径
router.get('/', function(req, res, next) {
    res.send('welcome to express!');
});
/*router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//新增数据
router.get("/add", function (req, res) {
    var userName = req.query.userName;
    var passWord = req.query.passWord;
    var newUser = new User({
        userName: userName,
        passWord:passWord
    });
    //保存数据
    newUser.save(function (err, result) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("result:" + result);
            res.json(JSON.stringify(result));
        }
    });
});
//post查询数据
router.post("/login", function (req, res) {
    User.find(req.body, function (err, result) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("result:" + result);
            res.json(JSON.stringify(result));
        }
    });
});
//获取token
router.get("/getToken",function(req,res){
    const time = req.query.time;
    //生成token
    const token = jwt.sign({
        name:123
    },secret,{
        expiresIn:time||60*60 //秒到期时间
    });
    res.json({
        token
    })
});
//校验token
const matchToken = function(req,res,next){
    const token = req.body.token;
    jwt.verify(token, secret, function(err, decoded) {
        if(err){
            res.json({
               code:0,
               message:'无效的token'
            });
        }else{
            res.json({
                code:1,
                message:'有效的token'
            });
        }
        next();
    });
};
router.post("/matchToken", function (req, res,next) {
    matchToken(req, res,next);
});
app.use(router);*/
app.use('/user',user);

app.listen(config.serverPort,function(){
    console.log('listen port:'+config.serverPort);
});
