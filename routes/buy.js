const express = require("express");
const router = express.Router();
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
        query.where("openId", {$regex: openId});
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
            query.limit().count(function (err, totalCount) {
                res.json({
                    code: totalCount>0?1:0,
                    totalCount: totalCount,
                    data: result,
                });
            });
        }
    });
});
//获取单条用户信息
router.get("/detail", function (req, res) {
    const buyFormId = req.query.buyFormId;
    Buy.findOne({
        buyFormId
    }, function (err, result) {
        if (err) {
            console.log("Error:" + err);
            res.status(400);
            res.json({
                code:-1,
                errorMsg:err
            });
        }
        else {
            const resData = {
                code: result?1:0,
                data: result
            };
            res.json(resData);
        }
    });
});
//新增表单信息
router.post("/add", function (req, res) {
    const openId = req.body.openId;
    //console.log(JSON.stringify(req.body.buyFormData));
    const buyFormData = req.body.buyFormData && JSON.parse(req.body.buyFormData);
    //校验参数
    if (!openId && !buyFormData) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "openId、buyFormData参数有误"
        });
        return false;
    } else if (!openId) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "openId参数有误"
        });
        return false;
    } else if (!buyFormData) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "buyFormData参数有误"
        });
        return false;
    } else if (buyFormData) {
        let objKeyArr = [];
        //校验表单必要参数
        Object.keys(buyFormData).forEach(function (key) {
            if (key === "productName" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "amount" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userName" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userPhone" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userAddress" && buyFormData[key]) {
                objKeyArr.push(key);
            }
        });
        //buyFormData比填写参数个数小于5
        if (objKeyArr.length < 5) {
            res.status(400);
            res.json({
                code: 0,
                errorMsg: "buyFormData参数有误"
            });
            return false;
        }
    }
    //参数校验成功新增表单数据
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
            //新增成功返回buyFormId
            res.json({
                code: 1,
                data: result.buyFormId
            });
        }
    });
});
//更新表单信息
router.post("/update", function (req, res) {
    const openId = req.body.openId;
    //console.log(JSON.stringify(req.body.buyFormData));
    const buyFormData = req.body.buyFormData && JSON.parse(req.body.buyFormData);
    const buyFormId = req.body.buyFormId;
    //校验参数
    if (!openId && !buyFormData&&!buyFormId) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "openId、buyFormData、formId参数有误"
        });
        return false;
    } else if (!openId) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "openId参数有误"
        });
        return false;
    } else if (!buyFormId) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "buyFormId参数有误"
        });
        return false;
    } else if (!buyFormData) {
        res.status(400);
        res.json({
            code: 0,
            errorMsg: "buyFormData参数有误"
        });
        return false;
    } else if (buyFormData) {
        let objKeyArr = [];
        //校验表单必要参数
        Object.keys(buyFormData).forEach(function (key) {
            if (key === "productName" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "amount" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userName" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userPhone" && buyFormData[key]) {
                objKeyArr.push(key);
            }
            if (key === "userAddress" && buyFormData[key]) {
                objKeyArr.push(key);
            }
        });
        //buyFormData比填写参数个数小于6
        if (objKeyArr.length < 5) {
            res.status(400);
            res.json({
                code: 0,
                errorMsg: "buyFormData参数有误"
            });
            return false;
        }
    }
    //更新表单数据
    Buy.update({buyFormId:buyFormId},{$set:{buyFormData: buyFormData}},function (err) {
        if (err) {
            console.log("Error:" + err);
            res.json({
                code: 0,
                message: "表单更新失败"
            });
        }
        else {
            //新增成功返回buyFormId
            res.json({
                code: 1,
                data: buyFormId*1
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