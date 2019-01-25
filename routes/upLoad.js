const express = require("express");
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require("fs");
//图片上传
router.post('/pic',multipartMiddleware,function(req,res){
    const imgData = req.body.formData;
    //接收前台POST过来的base64
    //过滤data:URL
    const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = new Buffer(base64Data, 'base64');
    //获取保存文件的路径
    const saveDir = __dirname.replace('routes','');
    fs.writeFile(`${saveDir}`+"static/upLoadImg/image.png", dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.json({
                code:1,
                data:`${saveDir}`+"static/upLoadImg/image.png"
            });
        }
    });
});
module.exports = router;