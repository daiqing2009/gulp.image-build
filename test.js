/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* eslint-env mocha */
'use strict';
var gulp = require('gulp');
var util = require('util');
var ncp = require('ncp').ncp;
ncp.limit = 16;
var fs = require('fs');
var glob = require("glob");
var assert = require('assert');
var path = require('path');
require('./Gulpfile.js');
config.moreImgDir='./src/moreAssets/images/';
config.moreImgSrc=[config.moreImgDir+'**/*.{png,svg,jpeg,jpg,gif}'];
//config.strImgSrc=path.dirname(config.imgSrc[0]);  result: ./src/assets/images/** 多了**
config.strImgSrc =  './src/assets/images/';
var partialImgSrc =  './src/assets/images/payment/*.{png,svg,jpeg,jpg,gif}';

it('should minpify images after copy', function (done) {
    this.timeout(120000);
    whetherCopiedFile(config.imgSrc[0],config.destImg,false);
    gulp.start('image:copy',function(err){
//        console.log("err="+ err);
        assert(util.isNullOrUndefined(err),"image can not be copied");
        whetherCopiedFile(config.imgSrc[0],config.destImg,true);
        whetherCompressedFile(config.imgSrc[0],config.destImg,false);
      //  assert(copiedFile(config.imgSrc,config.destImg), "image should be copied to dist");
       // assert(!compressedFile(config.imgSrc,config.destImg), "images have not been compressed yet");
        //TODO: 使用 image:clean的方法来去除未压缩的内容
        touchFiles(config.imgSrc[0]);        //compressed file during partial copy

        gulp.start('image:min',function(err) {
            assert(util.isNullOrUndefined(err),"image can not be compressed");
            whetherCompressedFile(config.imgSrc[0],config.destImg,true);
            touchFiles(partialImgSrc);
            gulp.start('image:copy',function(err){
                assert(util.isNullOrUndefined(err),"image can not be copied again");
                whetherCompressedFile(partialImgSrc,config.destImg,false);

                //TODO: 使用 image:clean 的方法来代替未压缩的内容
                touchFiles(partialImgSrc);
                gulp.start('image:min',function(err){
                    assert(util.isNullOrUndefined(err),"image can not be compressed again");
                    whetherCompressedFile(partialImgSrc,config.destImg,true);

//                    assert(compressedFile(config.imgSrc,config.destImg), "compressed image should override copied images");
                    done();
                });
            });
            //TODO: compressed file make sure zhitu works
        })
    })
});

it('image watch trigger copying',function(done){
    this.timeout(60000);
    config.compressImg=false;
    gulp.start('image:watch',function(err){
        //copy new images, which should trigger watch now
        ncp(config.moreImgDir,config.strImgSrc , function (err) {
            if (err) {
                return console.error(err);
            }
//        console.log('done!');
        });
        setTimeout(whetherCopiedFile(config.moreImgSrc[0],config.destImg,true),10000);
        setTimeout(whetherCompressedFile(config.moreImgSrc[0],config.destImg,false),15000);
//        gulp.stop('image:watch');
        done();
    });
});

it('image watch trigger compressing',function(done){
    this.timeout(60000);
    config.compressImg=true;
    gulp.start('image:watch',function(err){
        //copy new images, which should trigger watch now
        ncp(config.moreImgDir,config.strImgSrc , function (err) {
            if (err) {
                //TODO: make sure when copy is slow, it still works
                return console.error(err);
            }
            console.log('done!');
        });
        //TODO: wait for watch to be activated

        setTimeout(whetherCopiedFile(config.moreImgSrc[0],config.destImg,true),10000);
        setTimeout(whetherCompressedFile(config.moreImgSrc[0],config.destImg,true),15000);
//        gulp.stop('image:watch');
        done();
    });
});

function whetherCopiedFile(src,dest,isOrNot){
    var message = "file should %1be copied to %2";
    glob(src,function(err, files){
        assert(util.isNullOrUndefined(err),"glob pattern should be ok");
//        console.log("srcFile="+srcFile+";dest="+dest);
        files.forEach(function(srcFile){
            var destPath = path.resolve(dest, path.relative(config.strImgSrc, srcFile));
            fs.access(destPath,fs.R_OK | fs.W_OK, function(err){
                if(isOrNot){
                    assert(util.isNullOrUndefined(err),message.replace(/%2/,destPath).replace(/%1/,isOrNot?"":"Not "));
                }else{
                    assert(!util.isNullOrUndefined(err), message.replace(/%2/,destPath).replace(/%1/,isOrNot?"":"Not "));
                }
            });
        });
    });
}

function whetherCompressedFile(src,dest,isOrNot){
    var message = "file should %1be compressed to %2";
    glob(src,function(err, files){
        assert(util.isNullOrUndefined(err),"image can not be compressed");
        files.forEach(function(srcFile){
            var destPath = path.resolve(dest, path.relative(config.strImgSrc, srcFile));
            var srcStat = fs.statSync(srcFile);
            var distStat = fs.statSync(destPath);
            assert.equal(srcStat.size > distStat.size,isOrNot, message.replace(/%2/,destPath).replace(/%1/,isOrNot?"":"Not "));
        });
    });
//   console.log("src="+src+";dest="+dest);
}

function touchFiles(src){
//    console.log("touchFiles start");
//    var closure = null;
    var files = glob.sync(src);
    files.forEach(function(file){
//        console.log("file="+file);
//        console.log("stat="+util.inspect(fs.statSync(file)));
        fs.utimesSync(file, NaN, NaN);
//       console.log("file.mtime="+fs.statSync(file).mtime);
//        closure =  file;
    });
//    console.log(closure);
//    console.log("touchFiles end");
}

