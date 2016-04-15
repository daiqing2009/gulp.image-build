# gulp.image-build
Gulpfile.js that works on js files

[![GitHub version](https://badge.fury.io/gh/zgabievi%2Fgulp.image-build.svg)](http://badge.fury.io/gh/zgabievi%2Fgulp.image-build)
[![Build Status](https://travis-ci.org/daiqing2009/gulp.image-build.svg?branch=master)](https://travis-ci.org/daiqing2009/gulp.image-build)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/c94031dde95348b6a1bd0cdf243f40f6)](https://www.codacy.com/app/daiqing2009/gulp-image-build)
[![Dependency Status](https://david-dm.org/zgabievi/gulp.image-build.svg)](https://david-dm.org/zgabievi/gulp.image-build)
[![devDependency Status](https://david-dm.org/zgabievi/gulp.image-build/dev-status.svg)](https://david-dm.org/zgabievi/gulp.image-build#info=devDependencies)

## Useage
Download repository and in your command line run `npm install`, this will download `node_modules` and you are about to go.

- `gulp cache:clear` - clears cache for compressed images
- `gulp image:clean` - cleans not compreseed images under configured `./dist/` directory 
- `gulp image:min` - optimizes image files from `./src/assets/images`. Supported extensions are: `png, svg, jpeg, jpg, gif`
- `gulp image:watch` - watches images and icons for chages
- `gulp image` - default task that clears cache, generaetes sprite and optimizes images
- `gulp sprite:build` - task to generate sprite icon 

