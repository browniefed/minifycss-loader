'use strict';
var path = require('path');
var chai = require('chai');
var webpack = require('webpack');
var fs = require('fs');
var csso = require('csso');

var expect = chai.expect;
var CR = /\r/g;

function readCss(ext, id) {
    return fs.readFileSync(path.join(__dirname, ext, id + '.css'), 'utf8').replace(CR, '');
}

function test(name, id, compareTo, query) {
    it(name, function (done) {
        var ext = 'css';

        query = query || '';

        var expectedCss = readCss(ext, compareTo);
        var cssFile = 'raw-loader!' + path.resolve(__dirname, '../index.js') + '?' + query + '!' + path.join(__dirname, ext, id + '.' + ext);
        var actualCss;

        // run asynchronously
        webpack({
            entry: cssFile,
            output: {
                path: __dirname + '/output',
                filename: 'bundle.' + ext + '.js',
                libraryTarget: 'commonjs2'
            }
        }, function onCompilationFinished(err, stats) {
            if (err) {
                return done(err);
            }
            if (stats.hasErrors()) {
                return done(stats.compilation.errors[0]);
            }
            if (stats.hasWarnings()) {
                return done(stats.compilation.warnings[0]);
            }
            delete require.cache[path.resolve(__dirname, './output/bundle.' + ext + '.js')];

            actualCss = require('./output/bundle.' + ext + '.js');
            expect(actualCss).to.equal(expectedCss);
            done();
        });
        
    });
}

describe('minifycss-loader', function () {
    test('should minify css', 'unminified', 'minified', 'minify');
    test('should not compile css', 'unminified', 'unminified');
});
