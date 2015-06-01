// gulp modules
var del = require('del');
var gulp = require('gulp');
var sync = require('gulp-sync')(gulp);
var $ = require('gulp-load-plugins')();
var pngquant = require('imagemin-pngquant');
var spritesmith = require('gulp.spritesmith');

// clear cache
gulp.task('cache:clear', function(done) {
	return $.cache.clearAll(done);
});

// clean task
gulp.task('image:clean', function() {
	del(['./dist/assets/images/*']);
});

// sprite task
gulp.task('sprite:build', function() {
	var spriteData = gulp.src('./src/assets/icons/*.png')
		.pipe(spritesmith({
			retinaSrcFilter: ['./src/assets/icons/*-2x.png'],
			retinaImgName: 'icons-2x.png',
			cssName: '_icons.scss',
			imgName: 'icons.png'
		}));
		
	spriteData.img.pipe(gulp.dest('./src/assets/images'));
	spriteData.css.pipe(gulp.dest('./src/assets/sass'));
});

// build task
gulp.task('image:build', ['image:clean'], function() {
	return gulp.src('./src/assets/images/**/*.{png,svg,jpeg,jpg,gif}')
		.pipe($.plumber())
		.pipe($.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
		.pipe($.plumber.stop())
		.pipe($.size())			
		.pipe(gulp.dest('./dist/assets/images'));
});

// watch task
gulp.task('image:watch', ['image:build'], function() {
	gulp.watch('./src/assets/images/**/*.{png,svg,jpeg,jpg,gif}', ['image:build']);
	gulp.watch('./src/assets/icons/*.png', ['sprite:build']);
});

// default task
gulp.task('image', sync.sync(['cache:clear', 'sprite:build', 'image:watch']));