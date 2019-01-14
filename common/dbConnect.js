const config = require("./config");
//引入mongoose模块
var mongoose = require("mongoose");
//数据库链接
mongoose.Promise = global.Promise;
var db = mongoose.connect("mongodb://"+config.dataBaseUrl);
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});
module.exports = mongoose;