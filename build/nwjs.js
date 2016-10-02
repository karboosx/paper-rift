// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')


var distPath = path.join(config.build.assetsRoot, '**/**')

var spinner = ora('building application...')
spinner.start()

var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: distPath, // use the glob format
    platforms: ['win64'],
    version: '0.14.6',
    buildDir:'./nwjs'
});

nw.build().then(function () {
    console.log('all done!');
    spinner.stop()
}).catch(function (error) {
    console.error(error);
    spinner.stop()
});