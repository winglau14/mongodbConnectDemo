const express = require("express");
const router = express.Router();
//user model 模块引入
const User = require("../model/userModel");
//校验用户是否唯一
const matchUser = function (userName) {
    return new Promise(function (resolve, reject) {
        User.find({
            userName: userName
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
//获取用户信息列表
router.get("/list", function (req, res) {
    //翻页index
    const pageIndex = req.query.pageIndex * 1 || 0;
    //设置最大翻页数量为20
    const pageSize = req.query.pageSize * 1 > 20 ? 20 : req.query.pageSize * 1 || 10;
    //获取需要查询的名字
    const userName = req.query.name;
    //获取到所有的数据
    const query = User.find({});
    if (userName) {
        //模糊查询{$regex:userName}
        query.where("userName", {$regex:userName});
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
    const name = req.query.name;
    User.findOne({
        userName: {$regex:name}
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
    const userName = req.body.name;
    const passWord = req.body.passWord;
    //校验用户名是否存在
    matchUser(userName).then(function (response) {
        //response = true 已存在 or 不存在
        if (response) {
            res.json({
                code: 0,
                message: '该用户已存在'
            });
        } else {
            //新增用户数据
            var newUser = new User({
                userName: userName,
                passWord: passWord
            });
            //保存用户数据
            newUser.save(function (err, result) {
                if (err) {
                    console.log("Error:" + err);
                    res.json({
                        code: 0,
                        message: "用户新增失败"
                    });
                }
                else {
                    //console.log("result:" + result);
                    res.json({
                        code: 1,
                        message: "用户新增成功"
                    });
                }
            });
        }
    });
});
//删除用户信息
router.get("/delete", function (req, res) {
    const name = req.query.name;
    User.remove({
        userName: name
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