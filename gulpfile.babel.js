'use strict';

let gulp        = require('gulp');
let loadPlugins = require('gulp-load-plugins');
let npm         = require('rollup-plugin-npm');
let wiredep     = require('wiredep');
let merge       = require('merge-stream');
let rimraf      = require('rimraf');
let browserify  = require('browserify');
let transform   = require('vinyl-transform');
let through2    = require('through2');

let fs = require('fs');

// Config
// ------

const dirs = {
    src: './src',
    dest: './dest',
    bowerComponents: './bower_components'
};

const jade = {
    src: `${dirs.src}/**/*.jade`,
    dest: `${dirs.dest}/`
};

const js = {
    src: `${dirs.src}/**/*.js`,
    dest: `${dirs.dest}/`,
    entry: `index.js`,
    app: 'app.js'
};

const coffee = {
    src: `${dirs.src}/**/*.coffee`
};

const styles = {
    src: `${dirs.src}/**/*.styl`,
    dest: `${dirs.dest}/`
};

const bowerSrc = ( ['js', 'styl', 'eot', 'svg', 'ttf', 'woff', 'woff2'] )
    .map( (extension) => `${dirs.bowerComponents}/**/*.${extension}` );

const plugins = loadPlugins();
const bower = wiredep( {
    src: bowerSrc
} );

// Tasks
// -----

gulp.task( 'default', [ 'build-jade', 'build-styles', 'browserify' ], () => {
    gulp.watch( jade.src,   [ 'build-jade' ] )
    gulp.watch( styles.src, [ 'build-styles' ] )
    gulp.watch( js.src,     [ 'build-js' ] )
    ;
} );

gulp.task( 'build-jade', () => {
    return gulp.src( jade.src )
    .pipe( plugins.plumber() )
    .pipe( plugins.jade() )
    .pipe( gulp.dest( jade.dest ) )
    ;
} );

gulp.task( 'build-styles', () => {

    let app = gulp.src( styles.src )
        .pipe( plugins.plumber() )
        .pipe( plugins.stylus() )
        ;

    let libs = gulp.src( bower.less )
        .pipe( plugins.plumber() )
        .pipe( plugins.less() )
        ;

    return merge( libs, app )
        .pipe( gulp.dest( styles.dest ) );
} );

gulp.task('browserify', () => {
    return gulp.src('./src/index.js')
        .pipe(through2.obj(function (file, enc, next){
            browserify(file.path)
                .transform('stripify')
                .bundle(function(err, res){
                    // assumes file.contents is a Buffer
                    file.contents = res;
                    next(null, file);
                });
        }))
    .pipe(gulp.dest('./build/'))
});

gulp.task( 'clean', () => {
    rimraf( dirs.dest, (errors) => {
        if (errors)
            console.log( 'Rimraf failed. Errors:', errors );
    } );
} );
