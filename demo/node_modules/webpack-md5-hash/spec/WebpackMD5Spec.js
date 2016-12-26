'use strict';

var path = require('path'),
    rimraf = require('rimraf'),
    webpack = require('webpack'),
    fs = require('fs');

var OUTPUT_DIR = path.join(__dirname, '../dist'),
    FIXTURES = path.join(__dirname, './fixtures');

describe('WebpackMd5Hash', function () {

    beforeEach (function (done) {
        rimraf(OUTPUT_DIR, done);
    });

    it('Compile without plugin', function (done) {
        webpack({
            entry: {
                entry: path.join(FIXTURES, 'entry.js')
            },
            output: {
                path: OUTPUT_DIR,
                filename: '[name]-bundle.js',
                chunkFilename: '[chunkhash].[id].chunk.js'
            }
        }, function (err, stats) {
            expect(err).toBeFalsy();
            expect(stats.compilation.errors).toEqual([]);
            expect(stats.compilation.warnings).toEqual([]);
            var outputDir = fs.readdirSync(OUTPUT_DIR);
            expect(outputDir.length).toEqual(2);
            done();
        });
    });

    it('Compile twice without plugin', function (done) {
        var config = {
            entry: {
                entry: path.join(FIXTURES, 'entry.js')
            },
            output: {
                path: OUTPUT_DIR,
                filename: '[name]-bundle.js',
                chunkFilename: '[chunkhash].[id].chunk.js'
            }
        };
        webpack(config, function (err, stats) {
            expect(err).toBeFalsy();
            expect(stats.compilation.errors).toEqual([]);
            expect(stats.compilation.warnings).toEqual([]);
            var outputDir = fs.readdirSync(OUTPUT_DIR);
            expect(outputDir.length).toEqual(2);
            webpack(config, function (err, stats) {
                expect(err).toBeFalsy();
                expect(stats.compilation.errors).toEqual([]);
                expect(stats.compilation.warnings).toEqual([]);
                var outputDir = fs.readdirSync(OUTPUT_DIR);
                expect(outputDir.length).toEqual(2);
                done();
            });
        });
    });
});
