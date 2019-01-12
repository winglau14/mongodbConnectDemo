//引入mongoose模块
var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
//数据库链接
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://localhost:27017/userdb");
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});
//创建一个Schema  每一个schema会一一对应mongo中的collection
var UserSchema = new mongoose.Schema({
    //设置user信息的数据格式
    userName: String,
    passWord:String
});
//生成一个具体user的model
var User = mongoose.model("userData",UserSchema);

app.use(bodyParser.urlencoded({extended: false}));

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//get查询数据
router.get("/user", function (req, res) {
    var type = req.query.type;
    console.log(type);
    User.find({
        userName: type
    }, function (err, result) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("result:" + result);
            res.send(JSON.stringify(result));
        }
    });
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
            res.send(JSON.stringify(result));
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
            res.send(JSON.stringify(result));
        }
    });
});
app.use(router);
app.listen(3001,function(){
    console.log('listen port:3001');
});
