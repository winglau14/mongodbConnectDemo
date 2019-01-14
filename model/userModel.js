//数据库链接
const mongoose = require("../common/dbConnect");
//创建一个Schema  每一个schema会一一对应mongo中的collection
const UserSchema = new mongoose.Schema({
    //设置user信息的数据格式
    userName: String,
    passWord:String
});
//生成一个具体user的model
const user = mongoose.model("userData",UserSchema);
module.exports = user;