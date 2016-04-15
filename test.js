/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* eslint-env mocha */
'use strict';
const gulp = require('gulp');
const util = require('util');
const ncp = require('ncp').ncp;
ncp.limit = 16;
const fs = require('fs');
const glob = require("glob");
const assert = require('assert');
const path = require('path');
require('./Gulpfile.js');
config.moreImgDir='./src/moreAssets/images/';
config.moreImgSrc=['./src/moreAssets/images/**/*.{png,svg,jpeg,jpg,gif}'];
//config.strImgSrc=path.dirname(config.imgSrc[0]);  result: ./src/assets/images/** 多了**
config.strImgSrc =  './src/assets/images/';
var partialImgSrc =  './src/assets/images/payment/*.{png,svg,jpeg,jpg,gif}';

it('should minpify images after copy', function (cb) {
    this.timeout(30000);
    gulp.start('image:copy',function(err){
//        console.log("err="+ err);
        assert(util.isNullOrUndefined(err),"image can not be copied");
        assert(copiedFile(config.imgSrc,config.destImg), "image should be copied to dist");
        assert(!!compressedFile(config.imgSrc,config.destImg), "images have not been compressed yet");

        gulp.start('image:min',function(err) {
            assert(util.isNullOrUndefined(err),"image can not be compressed");
            assert(compressedFile(config.imgSrc,config.destImg), "compressed image should override copied images");
            //compressed file during partial copy
            touchFiles(partialImgSrc);
            gulp.start('image:copy',function(err){
                assert(util.isNullOrUndefined(err),"image can not be copied again");
                assert(!!compressedFile(config.imgSrc,config.destImg), "part of compressed images have been overiden");
                touchFiles(partialImgSrc);
                gulp.start('image:min',function(err){
                    assert(util.isNullOrUndefined(err),"image can not be compressed again");
                    assert(compressedFile(config.imgSrc,config.destImg), "compressed image should override copied images");
                    cb();
                });
            });
            //TODO: compressed file make sure zhitu works
        })
    })
});

it('image watch trigger copying',function(cb){
    this.timeout(15000);
    config.compressImg=false;
    gulp.start('image:watch',function(err){
        //copy new images, which should trigger watch now
        ncp(config.moreImgDir,config.strImgSrc , function (err) {
            if (err) {
                return console.error(err);
            }
//        console.log('done!');
        });
        assert(copiedFile(config.moreImgSrc,config.destImg),"more image should be copied to destined folder in dist");
        assert(!!compressedFile(config.moreImgSrc,config.destImg), "but not compressed");
//        gulp.stop('image:watch');
        cb();
    });
});

it('image watch trigger compressing',function(cb){
    this.timeout(15000);
    config.compressImg=true;
    gulp.start('image:watch',function(err){
        //copy new images, which should trigger watch now
        ncp(config.moreImgDir,config.strImgSrc , function (err) {
            if (err) {
                //TODO: make sure when copy is slow it still works
                return console.error(err);
            }
            console.log('done!');
        });

        assert(compressedFile(config.moreImgSrc,config.destImg), "more images should override copied images");
//        gulp.stop('image:watch');
        cb();
    });
});

//const relativePath = path.relative(config.strImgSrc,config.destImg);
//console.log("relativePath="+relativePath);
function copiedFile(src,dest){
//    console.log("src="+src+";dest="+dest);
    return true;
}
function compressedFile(src,dest){
//   console.log("src="+src+";dest="+dest);
    src.forEach(function(srcFile){
//        console.log("srcFile="+srcFile);
        var destPath;
        var files = glob.sync(srcFile);
//        console.log("files="+files);

        for(var i in files){
//            console.log("file="+files[i]);
            destPath = path.resolve(dest, path.relative(config.strImgSrc, files[i]));
            var srcSize = fs.statSync(files[i]).size;
            var distSize = fs.statSync(destPath).size;
//            console.log("srcSize="+srcSize +"&distSize="+distSize);
            if(srcSize <= distSize){
//               console.log("found not compressed");
                return false;
            }
        }
    });
    return true;
}

function touchFiles(src){
    var files = glob.sync(src);
    files.forEach(function(file){
//        console.log("file="+file);
//        console.log("stat="+util.inspect(fs.statSync(file)));
        fs.utimesSync(file, NaN, NaN);
//       console.log("stat="+util.inspect(fs.statSync(file)));
    });
}

