//数据库链接
const db = require("../common/dbConnect");
const mongoose = db.mongoose;

//创建一个Schema  每一个schema会一一对应mongo中的collection
const BuySchema = new mongoose.Schema({
    //设置user信息的数据格式
    openId: String,//用户表示
    buyFormData: String,//表单提交数据
    buyFormId:Number,//生成表单ID
    createTime: Number,//表单创建时间
});
BuySchema.plugin(db.autoIncrement.plugin, {
    model:'buyData',
    field: 'buyFormId',
    startAt: 10000,
    incrementBy: 1
});
//生成一个具体buy的model
const buy = mongoose.model("buyData", BuySchema);
module.exports = buy;
