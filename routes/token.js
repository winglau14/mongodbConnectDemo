const express = require("express");
const router = express.Router();
const config = require("../common/config");
const jwt= require('jsonwebtoken');
//获取token
router.post("/getToken", function (req, res) {
    const time = req.body.time;
    const userName = req.body.userName||'winglau14';
    //生成token
    const token = jwt.sign({
        userName
    },config.jwtKey,{
        expiresIn:time||60*60 //秒到期时间
    });
    res.json({
        token
    })
});
module.exports = router;