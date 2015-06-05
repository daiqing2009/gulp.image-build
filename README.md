# gulp.image-build
Gulpfile.js that works on js files

[![Build Status](https://semaphoreci.com/api/v1/projects/ea10fe32-87a6-4059-92fe-8294dc5cab1b/444290/shields_badge.svg)](https://semaphoreci.com/zgabievi/gulp-image-build)

## Dependencies
- ["gulp": "^3.8.11"](https://npmjs.org/package/gulp/)
- ["del": "^1.2.0"](https://www.npmjs.com/package/del/)
- ["gulp-cache": "^0.2.9"](https://www.npmjs.com/package/gulp-cache/)
- ["gulp-imagemin": "^0.3.1"](https://www.npmjs.com/package/gulp-imagemin/)
- ["gulp-if": "^1.2.5"](https://www.npmjs.com/package/gulp-if/)
- ["gulp-load-plugins": "^0.10.0"](https://www.npmjs.com/package/gulp-load-plugins/)
- ["gulp-plumber": "^1.0.1"](https://www.npmjs.com/package/gulp-plumber/)
- ["gulp-size": "^1.2.1"](https://www.npmjs.com/package/gulp-size/)
- ["gulp-sync": "^0.1.4"](https://www.npmjs.com/package/gulp-sync/)
- ["gulp.spritesmith": "^0.10.0"](https://www.npmjs.com/package/gulp.spritesmith/)
- ["imagemin-pngquant": "^1.2.0"](https://www.npmjs.com/package/imagemin-pngquant/)

## Useage
Download repository and in your command line run `npm install`, this will download `node_modules` and you are about to go.

- `gulp cache:clear` - clears cache for compressed images
- `gulp image:clean` - cleans `./dist/assets/images` directory
- `gulp sprite:build` - generates **icons.png**, **icons-2x.png** and **_icons.scss** files and saves them in source directory
- `gulp image:build` - optimizes image files from `./src/assets/images`. Supported extensions are: `png, svg, jpeg, jpg, gif`
- `gulp image:watch` - watches images and icons for chages
- `gulp image` - default task that clears cache, generaetes sprite and optimizes images
