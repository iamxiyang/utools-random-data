const gulp = require('gulp');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const watch = require('gulp-watch');
const clean = require('gulp-clean');


gulp.task("default", function (done) {

  // 清空旧的
  gulp.src('dist/', { read: false })
    .pipe(clean());

  // 拷贝静态资源
  gulp.src([
    'src/*.json',
    'src/random/*.json',
    'src/static/*',
  ], { base: './src' })
    .pipe(gulp.dest('dist'))

  // 编译ts
  tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));

  // todo 持续监听变化，拷贝静态资源、编译ts
});