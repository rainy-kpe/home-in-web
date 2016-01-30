'use strict';

import gulp from "gulp";
import ts from "gulp-typescript";
import tslint from "gulp-tslint";
import jade from "gulp-jade";
import less from "gulp-less";
import changed from "gulp-changed";
import rename from "gulp-rename";
import runSequence from "gulp-run-sequence";

const tsProject = ts.createProject('tsconfig.json');

gulp.task('less', () =>
  gulp.src('frontend/styles/*.less')
    .pipe(changed('output/frontend/css'))
    .pipe(less())
    .pipe(gulp.dest('output/frontend/css'))
);

gulp.task("tslint", () =>
  gulp.src(["backend/**/*.ts", "frontend/**/*.ts"])
    .pipe(tslint())
    .pipe(tslint.report("verbose"))
);

gulp.task('backend-ts', () =>
  gulp.src(["backend/**/*.ts"])
    .pipe(changed('output/backend'))
    .pipe(ts(tsProject))
    .pipe(gulp.dest('output/backend'))
);

gulp.task('frontend-ts', () =>
  gulp.src(["frontend/**/*.ts"])
    .pipe(changed('output/frontend/js'))
    .pipe(ts(tsProject))
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('output/frontend/js'))
);

gulp.task('jade', () =>
  gulp.src(['frontend/templates/*.jade', 'frontend/components/**/*.jade'])
    .pipe(changed('output/frontend'))
    .pipe(jade())
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('output/frontend'))
);

gulp.task('build', function(done) {
  runSequence('tslint',
              ['jade', 'less'],
              'backend-ts',
              'frontend-ts',
              done);
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], () => {
  gulp.watch(['backend/**/*.ts',
              'frontend/**/*.ts',
              'frontend/templates/*.jade'],
             ['build'])
});
