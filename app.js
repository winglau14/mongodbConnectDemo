const config = require("./common/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
//静态资源访问路由
app.use('/static', express.static('static'));
//api接口校验及权限拦截
const expressJwt = require('express-jwt');
//获取token路由
const getToken = require("./routes/token");
//用户模块路由
const user = require("./routes/user");
//使用中间件验证token合法性
app.use(expressJwt ({
    secret:config.jwtKey
}).unless({
    path: ['/static','/token/getToken']  //除了这些地址，其他的URL都需要验证
}));
//拦截器
app.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误 authorization
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.status(400).send('invalid request...');
    }
});
//获取token模块路由
app.use('/token',getToken);
//用户模块路由
app.use('/user',user);
//开启服务
app.listen(config.serverPort,function(){
    console.log('listen port:'+config.serverPort);
});
