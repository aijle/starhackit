require('babel-register');

const path = require( 'path' );
const gulp = require( 'gulp' );
const runSequence = require( 'run-sequence' );
const clean = require( 'gulp-rimraf' );
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const pm2 = require('pm2');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  src: ['src/**/*.js'],
  test: ['src/**/test*.js'],
  build: 'build'
};

gulp.task( 'default', function ( done ) {
    runSequence(
        'build',
        'watch',
        'run',
        done
    );
} );

gulp.task('build:code', function () {
    return gulp.src(paths.src)
        .pipe(babel())
        .pipe(gulp.dest(paths.build));
});

gulp.task( 'build:production', function ( done ) {
    runSequence(
        'clean',
        'build:code',
        'cp:assets',
        done
    );
} );

gulp.task( 'build', function ( done ) {
    runSequence(
        'build:code',
        'cp:assets',
        done
    );
} );

gulp.task( 'clean', function () {
    return gulp.src( ['build/*', 'coverage'], { read: false } )
        .pipe( clean() );
} );

gulp.task( 'cp:assets', function () {
    return gulp.src( [
        './package.json', './src/**/*.html', './src/**/*.json', './src/**/*.sql'
    ] )
    .pipe(debug())
    .pipe( gulp.dest( 'build/' ) );
} );

gulp.task( 'build:restart', function ( done ) {
    runSequence(
        'build:code',
        'pm2:restart',
        done
    );
} );

gulp.task( 'watch', function () {
  gulp.watch(paths.src, ['build:restart']);
} );

gulp.task('pm2:restart', function () {
    pm2.connect(true, function () {
        pm2.restart('all', function () {
            console.log('pm2 restart');
        });
    });
});

gulp.task('run', function () {
    pm2.connect(true, function () {
        var pm2Config = require('./pm2.json');
        pm2.start(pm2Config, function () {
            console.log('pm2 started');
            pm2.streamLogs('all', 0);
        });
    });
});
