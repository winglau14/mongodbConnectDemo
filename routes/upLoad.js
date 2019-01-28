const express = require("express");
const router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const fs = require("fs");
//buy model 模块引入
const Buy = require("../model/buyModel");
//获取保存文件的路径
const saveDir = __dirname.replace('routes','');
//图片上传
router.post('/image',multipartMiddleware,function(req,res){
    const fileData = req.files;
    if(!fileData){
        res.status(400);
        res.json({
            code:0,
            errorMsg:'fileData参数不合法'
        });
    }
    //读文件
    fs.readFile(fileData.file.path,function(err,originBuffer){
        const base64Data = originBuffer.toString('base64');  // base64图片编码字符串
        const dataBuffer = new Buffer(base64Data, 'base64');
        //图片命名
        const imgName = new Date().getTime();
        fs.writeFile(`${saveDir}`+`static/upLoadImg/t_${imgName}.jpg`, dataBuffer, function(err) {
            if(err){
                res.status(400);
                res.json({
                    code:0,
                    errorMsg:err
                });
            }else{
                res.json({
                    code:1,
                    data:{
                        imgUrl:`static/upLoadImg/t_${imgName}.jpg`,
                        imgName:`t_${imgName}`
                    }
                });
            }
        });
    });
});
//图片删除
router.post('/imageDelete',multipartMiddleware,function(req,res){
    const imgName = req.body.imgName;
    const imgPath = `${saveDir}static/upLoadImg/${imgName}`;
    const buyFormId = req.body.buyFormId;
    //参数判断
    if(!imgName){
        res.status(400);
        res.json({
            code:0,
            errorMsg:`imgName参数不合法`
        });
        return false;
    }
    if(!buyFormId){
        res.status(400);
        res.json({
            code:0,
            errorMsg:`buyFormId参数不合法`
        });
        return false;
    }
    fs.stat(imgPath,(err,stats)=>{
        if (err) {
            res.status(400);
            res.json({
                code:0,
                errorMsg:`${imgName}不存在`
            });
            return false;
        }
        //是否存在该文件
        const existFlag = stats.isFile();
        if(existFlag){
            //删除文件
            fs.unlink(imgPath, (uErr,uRes)=>{
                //查询到对应的数据by formId
                if(buyFormId*1>0){
                    Buy.findOne({buyFormId},function(err,result){
                        if(err){
                            console.log(err);
                            return false;
                        }
                        result.buyFormData.imageList.map((item,index)=>{
                            if(item.imgName === imgName){
                                result.buyFormData.imageList.splice(index,1);
                            }
                        });
                        //更新对应的图片数据信息
                        Buy.update({buyFormId:buyFormId},{$set:{buyFormData: {imageList:result.buyFormData.imageList}}},function (err) {
                            if (err) {
                                console.log("Error:" + err);
                            }
                            else {
                                //图片删除并数据信息更新成功
                                res.json({
                                    code: 1,
                                    message:`${imgName}删除成功`
                                });
                            }
                        });
                    });
                }else{
                    //删除成功
                    res.json({
                        code:1,
                        message:`${imgName}删除成功`
                    });
                }
            });
        }
    })
});
module.exports = router;