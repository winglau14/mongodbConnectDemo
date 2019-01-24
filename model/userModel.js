//数据库链接
const db = require("../common/dbConnect");
const mongoose = db.mongoose;
//字段自增插件包
const autoIncrement = require('mongoose-plugin-autoinc-fix');
//创建一个Schema  每一个schema会一一对应mongo中的collection
const UserSchema = new mongoose.Schema({
    //设置user信息的数据格式
    /**
     * openId登录客户端openId
     * source登录客户端标识weixin or qq
     * nickName用户昵称
     * userId用户id自增
     */
    openId: {
        type:String,
        require:true
    },
    source:{
        type:String,
        require:true
    },
    nickName:{
        type:String,
        require:true
    },
    avatarUrl:{
        type:String,
        require:true
    },
    userId:Number
});
//userId 自增长
UserSchema.plugin(autoIncrement.plugin,{
    model:'userData',
    field: 'userId',
    startAt: 10000,
    incrementBy: 1
});
//生成一个具体user的model
const user = mongoose.model("userData",UserSchema);
module.exports = user;