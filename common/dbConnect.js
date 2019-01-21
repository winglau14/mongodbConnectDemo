var config = require("./config");
//引入mongoose模块
var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment-create-update');
mongoose.Promise = global.Promise;
//数据库链接
var db = mongoose.connect("mongodb://" + config.dataBaseUrl, {
    useMongoClient: true,
    connectTimeoutMS: 10000, // 10s后放弃重新连接
    socketTimeoutMS: 45000, // 在45s不活跃后关闭sockets
});
autoIncrement.initialize(db);
/*db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});*/
db.then(function(){
    console.log("------数据库连接成功！------");
},function(error){
    console.log("数据库连接失败：" + error);
});
module.exports = {
    mongoose,
    autoIncrement
};