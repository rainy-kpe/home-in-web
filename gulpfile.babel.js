'use strict';

import gulp from "gulp";
import ts from "gulp-typescript";
import tslint from "gulp-tslint";
import jade from "gulp-jade";
import less from "gulp-less";
import rename from "gulp-rename";
import runSequence from "gulp-run-sequence";
import debug from "gulp-debug";
import clean from "gulp-clean";
import polybuild from "polybuild";
import shell from "gulp-shell";
import replace from "gulp-replace";

const tsProject = ts.createProject('tsconfig.json');

gulp.task('less', () =>
  gulp.src('frontend/**/*.less')
//  	.pipe(debug({title: 'less:'}))
    .pipe(less())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('output/frontend/css'))
);

gulp.task("tslint", () =>
  gulp.src(["backend/**/*.ts", "frontend/**/*.ts"])
    .pipe(tslint())
    .pipe(tslint.report("verbose"))
);

gulp.task('backend-ts', () =>
  gulp.src(["backend/**/*.ts"])
//  	.pipe(debug({title: 'backend-ts:'}))
    .pipe(ts(tsProject))
    .pipe(gulp.dest('output/backend'))
);

gulp.task('frontend-ts', () =>
  gulp.src(["frontend/**/*.ts"])
//  	.pipe(debug({title: 'frontend-ts:'}))
    .pipe(ts(tsProject))
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('output/frontend/js'))
);

gulp.task('jade', () =>
  gulp.src(['frontend/templates/*.jade', 'frontend/components/**/*.jade'])
//  	.pipe(debug({title: 'jade:'}))
    .pipe(jade())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('output/frontend'))
);

gulp.task('polybuild', () =>
  gulp.src(['output/frontend/index.html'])
    .pipe(polybuild({maximumCrush: true, suffix: ''}))
    .pipe(gulp.dest('output/frontend/'))
);

gulp.task('clean-output', () =>
  gulp.src(['output/frontend/css', 'output/frontend/js', 'output/frontend/rf-*.html'])
    .pipe(clean())
);

gulp.task('replace-dev', function(){
  gulp.src(['output/frontend/index.js'])
    .pipe(replace('rainfeeds-dev', 'rainfeeds'))
    .pipe(gulp.dest('output/frontend/'));
});

gulp.task('firebase-deploy', shell.task([
  'firebase deploy'
]))

gulp.task('build', function(done) {
  runSequence('tslint',
              'less',
              'jade',
              'backend-ts',
              'frontend-ts',
              done);
});

gulp.task('deploy', function(done) {
  runSequence('build',
              'polybuild',
              'clean-output',
              'replace-dev',
              'firebase-deploy',
              done);
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  gulp.watch(['backend/**/*.ts',
              'frontend/**/*.ts',
              'frontend/**/*.less',
              'frontend/**/*.jade'],
             ['build'])
});
