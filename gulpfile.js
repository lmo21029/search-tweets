const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

const path = {
	build: {
		main: './build',
	},
	src: {
		css: './src/scss/main.scss',
		js: './src/js/**/*.js',
	},
	watch: {
		css: './src/scss/**/*.scss',
		js: './src/js/**/*.js',
		html: './src/html/**/*.html'
	}
};

var config = {
	css: {
		minify: false
	},
	js: {
		uglify: false
	},
	autoprefixer: {
		grid: true,
		browsers: ['>99%']
	}
}

const commonTasks = [ 'html', 'css', 'js'];

gulp.task('html', () => {
	gulp.src(['./index.html', './src/html/*.html'])
	.pipe(gulp.dest(path.build.main))
	.pipe(connect.reload());
});

gulp.task('css', () => {
	gulp.src([path.src.css])
		.pipe(plumber())
		.pipe(concat('styles.min.css'))
		.pipe(sass())
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(plumber.stop())
		.pipe(gulp.dest(path.build.main))
		.pipe(connect.reload());
});

gulp.task('js', () => {
	gulp.src([path.src.js])
		.pipe(plumber())
		.pipe(gulpif(config.js.uglify, uglify()))
		.pipe(plumber.stop())
		.pipe(concat('bundle.min.js'))
		.pipe(gulp.dest(path.build.main))
		.pipe(connect.reload());
});

gulp.task('connect', () => {
	connect.server({
		port: 8080,
		root: './build',
		livereload: true
	});
});

gulp.task('watch', () => {
	watch([path.watch.css], (event, cb) => {
		gulp.start('css');
	});
	watch([path.watch.js], (event, cb) => {
		gulp.start('js');
	});
	watch(['./index.html', './src/html/*.html'], () => {
		gulp.start('html');
	});
});

gulp.task('build', () => {
	config.css.minify = true;
	config.js.uglify = true;
	gulp.start(commonTasks);
});

gulp.task('default', [...commonTasks, 'connect', 'watch']);
