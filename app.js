//引入mongoose模块
var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = express.Router();
//数据库链接
var db = mongoose.connect("mongodb://localhost:27017/winglau14");
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});
//创建一个Schema  每一个schema会一一对应mongo中的collection
var Schema = db.Schema;
//实例化一个Schema
var UserSchema = new Schema({
    //设置user信息的数据格式
    userName: {
        type: String
    },
    passWord: {
        type: String
    }
}, {
    versionKey: false
});
//生成一个具体user的model
var User = db.model("User", UserSchema, "user");

app.use(bodyParser.urlencoded({extended: false}));

//get查询数据
router.get("/user", function (req, res) {
    var type = req.query.type;
    User.find({
        type: type
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
app.listen(3001);
