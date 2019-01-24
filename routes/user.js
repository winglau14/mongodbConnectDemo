const express = require("express");
const router = express.Router();
//user model 模块引入
const User = require("../model/userModel");
//校验用户是否唯一
const matchUser = function (openId) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            openId: openId
        }, function (err, result) {
            if (err) {
                console.log("Error:" + err);
            }
            else {
                //已有该用户直接返回用户数据
                if (result) {
                    resolve({
                        userInfor:result
                    });
                } else {
                    //新用户
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
    //获取需要查询的openId
    const openId = req.query.openId;
    //获取需要查询的userId
    const userId = req.query.userId*1;
    //获取到所有的数据
    const query = User.find({});
    if(openId&&userId){
        //根据openId&&userId查询数据
        query.findOne({userId,openId});
    }else if (openId) {//根据openId查询数据
        //模糊查询{$regex:openId}
        query.where("openId", {$regex:openId});
    }else if(userId){
        //根据userId查询数据
        query.findOne({userId});
    }
    //设置跳过的数据
    query.skip(pageIndex * pageSize);
    //设置最大查询数量
    query.limit(pageSize);
    //计算分页数据
    query.exec(function (err, result) {
        if (err) {
            console.log("Error:" + err);
            res.status(400);
            res.json({
                code:0,
                errorMsg:JSON.stringify(err)
            });
        }else {
            //有查询到数据
            if(result){
                //计算数据总数
                query.limit().count(function(err,totalCount){
                    res.json({
                        code: 1,
                        totalCount:totalCount,
                        data: result,
                    });
                });
            }else{
                //没有查询到数据
                res.json({
                    code: 0,
                    errorMsg:"查询不到数据"
                });
            }
        }
    });
});
//获取单条用户信息根据用户userId
router.get("/detail", function (req, res) {
    const userId = req.query.userId;
    User.findOne({
        userId
    }, function (err, result) {
        if (err) {
            console.log("Error:" + err);
            res.status(400);
            res.json({
                code:0,
                errorMsg:JSON.stringify(err)
            });
        }else {
            res.json({
                code: 1,
                data: result
            });
        }
    });
});
//用户注册登录信息
router.post("/login", function (req, res) {
    const openId = req.body.openId;//客户端openId
    const source = req.body.source;//客户端标识weixin or qq
    const nickName = req.body.nickName;//用户昵称
    const avatarUrl = req.body.avatarUrl;//用户头像
    console.log(`${openId} ${source} ${nickName} ${avatarUrl}`);
    if(!openId&&!source&&!nickName&&!avatarUrl){
        res.status(400);
        res.json({
            code:0,
            errorMsg:"openId、source、nickName、avatarUrl参数有误"
        });
        return false;
    }else if(!openId){
        res.status(400);
        res.json({
            code:0,
            errorMsg:"openId参数有误"
        });
        return false;
    }else if(!source){
        res.status(400);
        res.json({
            code:0,
            errorMsg:"source参数有误"
        });
        return false;
    }else if(!nickName){
        res.status(400);
        res.json({
            code:0,
            errorMsg:"nickName参数有误"
        });
        return false;
    }else if(!avatarUrl){
        res.status(400);
        res.json({
            code:0,
            errorMsg:"avatarUrl参数有误"
        });
        return false;
    }
    //校验用户名是否存在
    matchUser(openId).then(function (response) {
        //response = true 已存在 or 不存在
        if (response) {
            res.json({
                code: 1,
                data:response
            });
        } else {
            //新增用户数据
            const newUser = new User({
                openId,//客户端openid
                source,//客户端标识weixin or qq
                nickName//用户昵称
            });
            //保存用户数据
            newUser.save(function (err, result) {
                if (err) {
                    console.log("Error:" + err);
                    res.status(400);
                    res.json({
                        code: 0,
                        message: "用户新增失败"
                    });
                }else {
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
            res.status(400);
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