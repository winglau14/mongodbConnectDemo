const config = require("./common/config");
const express = require("express");
const bodyParser = require("body-parser");
const requestPromise = require('request-promise');
const cors = require('cors');
const app = express();
//支持跨域
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
//静态资源访问路由
app.use('/static', express.static('static'));
//api接口校验及权限拦截
const expressJwt = require('express-jwt');
//获取token路由
const getToken = require("./routes/token");
//用户模块路由
const user = require("./routes/user");
//表单模块路由
const buy = require("./routes/buy");
//使用中间件验证token合法性
/*app.use(expressJwt({
    secret: config.jwtKey
}).unless({
    path: ['/static', '/token/getToken', '/wx']  //除了这些地址，其他的URL都需要验证
}));*/
//拦截器
app.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误 authorization
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        //res.status(400).send('invalid request...');
        res.redirect('/static/pages/404.html');
    }
});
//获取token模块路由
app.use('/token', getToken);
//用户模块路由
app.use('/user', user);
//表单模块路由
app.use('/buy', buy);

var OAuth = require('wechat-oauth');
var client = new OAuth('wxd298d25b6cb7925a', '5509d88f318a024d5d1007e8dff56bff');
//获取微信数据
app.get('/wx', function (req, res) {
    const appid = 'wxd298d25b6cb7925a';
    const secret = '5509d88f318a024d5d1007e8dff56bff';
    const code = req.query.code || '033Rogo61hXn0L1dNwm611vko61Rogot';
    //获取用户的微信openid
    requestPromise({
        uri: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
        json: true
    }).then(function (response) {
        //获取微信用户信息
        if(response.openid){
            console.log(response.openid);
            client.getUser(response.openid||'o7ijtv-Y0KIsj6glnoKPAqKYUFB0', function (err, result) {
                console.log(err);
                res.json(result);
            });
        }else{
            res.json(response);
        }
    });
});
//开启服务
app.listen(process.env.PORT || config.serverPort, function () {
    console.log('listen port:' + (process.env.PORT || config.serverPort));
});
