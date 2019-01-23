const express = require("express");
const router = express.Router();
const config = require("../common/config");
//buy model 模块引入
const Buy = require("../model/buyModel");
//校验用户是否唯一
const matchUser = function (openId) {
    return new Promise(function (resolve, reject) {
        Buy.find({
            openId: openId
        }, function (err, result) {
            if (err) {
                console.log("Error:" + err);
            }
            else {
                const len = result.length;
                //已有该用户
                if (len) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }

        });
    });
};
//获取用户提交信息列表
router.get("/list", function (req, res) {
    //翻页index
    const pageIndex = req.query.pageIndex * 1 || 0;
    //设置最大翻页数量为20
    const pageSize = req.query.pageSize * 1 > 20 ? 20 : req.query.pageSize * 1 || 10;
    //获取需要查询的openId
    const openId = req.query.openId;
    //获取到所有的数据
    const query = Buy.find({});
    if (openId) {
        //模糊查询{$regex:userName}
        query.where("openId", {$regex:openId});
    }
    //设置跳过的数据
    query.skip(pageIndex * pageSize);
    //设置最大查询数量
    query.limit(pageSize);
    //计算分页数据
    query.exec(function (err, result) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            //计算数据总数
            query.limit().count(function(err,totalCount){
                res.json({
                    code: 1,
                    totalCount:totalCount,
                    data: result,
                });
            });
        }
    });
});
//获取单条用户信息
router.get("/detail", function (req, res) {
    const id = req.query.id;
    Buy.findOne({
        buyFormId: {$regex:id}
    }, function (err, result) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            const resData = {
                code: 1,
                data: result
            };
            res.json(resData);
        }
    });
});
//新增用户信息
router.post("/add", function (req, res) {
    const openId = req.body.openId;
    const buyFormData = req.body.buyFormData;
    //新增表单数据
    const newBuy = new Buy({
        openId: openId,
        buyFormData: buyFormData
    });
    //保存表单数据
    newBuy.save(function (err, result) {
        if (err) {
            console.log("Error:" + err);
            res.json({
                code: 0,
                message: "表单新增失败"
            });
        }
        else {
            //console.log("result:" + result);
            res.json({
                code: 1,
                message: "表单新增成功"
            });
        }
    });
});
//删除用户某条表单信息
router.post("/delete", function (req, res) {
    const id = req.body.id;
    Buy.remove({
        buyFormId: id
    }, function (err, result) {
        if (err) {
            console.log("Error:" + err);
            res.json({
                code: 0,
                message: '删除失败'
            });
        }
        else {
            res.json({
                code: 1,
                message: '删除成功'
            });
        }
    });
});
module.exports = router;