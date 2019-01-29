//数据库链接
const db = require("../common/dbConnect");
const mongoose = db.mongoose;
//字段自增插件包
const autoIncrement = require('mongoose-plugin-autoinc-fix');
//日期转换插件包
const moment = require("moment");
//创建一个Schema  每一个schema会一一对应mongo中的collection
const BuySchema = new mongoose.Schema({
    //设置user信息的数据格式
    openId: {
        type:String,
        require:true
    },//用户表示
    buyFormData: {
        type:Object,
        //require:true
    },//表单提交数据
    buyFormId:Number,//生成表单ID
    createTime: {
        type:String,
        default:moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    },//表单创建时间
});
BuySchema.plugin(autoIncrement.plugin, {
    model:'buyData',
    field: 'buyFormId',
    startAt: 20000,
    incrementBy: 1
});
//生成一个具体buy的model
const buy = mongoose.model("buyData", BuySchema);
module.exports = buy;
