// gulp modules
'use strict';
var gulp = require('gulp');
var sync = require('gulp-sync')(gulp);
var $ = require('gulp-load-plugins')();
var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');

global.config = {
	imgSrc:['./src/assets/images/**/*.{png,svg,jpeg,jpg,gif}'],
    iconSrc:['./src/assets/icons/*.png'],
	destImg:'./dist/assets/images',
	re_prod_image:/\d+_\d+_\d+X\d+.png/i,
	compressImg:true
};

// clear cache
	gulp.task('cache:clear', function(done) {
	return $.cache.clearAll(done);
});
/**
 * 直接复制图片
 */
gulp.task('image:copy', function() {
	return gulp.src(config.imgSrc)
//		.pipe($.newer(config.destImg))
		//		.pipe($.ignore.include(config.re_prod_image))
		.pipe(gulp.dest(config.destImg));
});
/**
 * 即使智图方案失败也可以用本地压缩
 */
gulp.task('image:min', ['image:build'], function() {
	return gulp.src(config.imgSrc)
		//TODO: use more accurate way to determine whether to update
//		.pipe($.newer(config.destImg))
		.pipe($.ignore.include(config.re_prod_image))
		.pipe($.plumber())
        .pipe($.size())
        .pipe($.cache($.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe($.plumber.stop())
		.pipe($.size())
		.pipe(gulp.dest(config.destImg));
});

/**
 * 使用智图和本地压缩分别压缩图片
 */
gulp.task('image:build',['image:clean'], function() {
	return gulp.src(config.imgSrc)
//		.pipe($.newer(config.destImg))
//		.pipe($.ignore.include(config.re_prod_image))
		.pipe($.plumber())
		.pipe($.size())
		.pipe($.if(smallSize,($.cache($.zhitu({enableWebp:false})))))
		.pipe($.if(largeSize,($.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))))
		.pipe($.plumber.stop())
		.pipe($.size())			
		.pipe(gulp.dest(config.destImg));
});

/**
 * 清除未完成压缩的图片，
 */
gulp.task('image:clean', function() {
	//TODO:clear images that is too old not compressed

	//TODO:clear images whose source is different from current source but create time is older:
	// very rare case that source file changed before the compressed file is
});

// watch task
gulp.task('image:watch', ['image:build'], function() {
//	$.watch(config.imgSrc, ['image:build']);
//	$.watch(config.iconSrc, ['sprite:build']);
	$.watch(config.imgSrc, $.batch(function (events, done) {
		console.log('events'+events);
		if(config.compressImg){
			//should start copy and
			gulp.start('image:min', done);
		}else{
			//start minify iamges
			gulp.start('image:copy', done);
		}
	}));
});

// default task
gulp.task('image', sync.sync(['cache:clear', 'sprite:build', 'image:watch']));

/**
 * 判断是否是大文件，暂时以500K为界限
 */
function largeSize(file){
	//TODO: 判断文件大小逻辑
	return true;
}

function  smallSize(file){
	return !largeSize(file);
}

// sprite task
gulp.task('sprite:build', function() {
	var spriteData = gulp.src(config.iconSrc)
		.pipe(spritesmith({
			retinaSrcFilter: ['./src/assets/icons/*-2x.png'],
			retinaImgName: 'icons-2x.png',
			cssName: '_icons.scss',
			imgName: 'icons.png'
		}));
	spriteData.img.pipe(gulp.dest(config.destImg));
	spriteData.css.pipe(gulp.dest('./src/assets/sass'));
});

//exports.config=config;
