// Generated on 2013-11-23 using generator-angular 0.6.0-rc.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: {
            // configurable paths
            src: 'src',
            dist: 'dist',
            build: '.tmp',
            banner: '/*!\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
                ' * https://github.com/<%= pkg.author %>/<%= pkg.name %>\n' +
                ' */\n'
        },
        /** ------------- WATCH FILES FOR DEBUG PURPOSES ------------- */
        watch: {
            livereload: {
                options: {
                    livereload: '<%= express.options.livereload %>'
                },
                files: [
                    '<%= yeoman.src %>/**/*.html',
                    '<%= yeoman.src %>/styles/{,*/}*.css',
                    '<%= yeoman.src %>/{,*/}*.js',
                    '<%= yeoman.src %>/{,*/}*.css',
                    '<%= yeoman.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            test: {
                options: {
                    livereload: {
                        port: 35728
                    }
                },
                files: [
                    '<%= yeoman.src %>/{,*/}*.html',
                    '{<%= yeoman.build %>,<%= yeoman.src %>}/app/{,*/}*.js'
                ],
                tasks: ['test']
            }
        },
        express: {
            options: {
                port: 9000,
                hostname: '127.0.0.1',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    bases: path.resolve(__dirname)
                }
            },
            test: {
                options: {
                    port: 9001,
                    bases: [
                        'test',
                        '<%= yeoman.src %>'
                    ]
                }
            }
        },
        /** ------------- CLEAN TMP FOLDERS ------------- */
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= yeoman.build %>',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '<%= yeoman.build %>'
        },
        /** ------------- FORMAT JS CODES ------------- */
        jsbeautifier: {
            files: [
                '<%= yeoman.src %>/{,*/}*.js',
                'test/{,*/}*.js',
                'Gruntfile.js'
            ],
            options: {}
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.src %>/{,*/}*.js'
            ]
        },
        /** ------------- SOURCE CODES MINIMIZATION ------------- */
        ngtemplates: {
            main: {
                options: {
                    module: 'angularDatatables',
                    base: '<%= yeoman.src %>'
                },
                src: '<%= yeoman.src %>/*.html',
                dest: '<%= yeoman.build %>/angular-datatables.template.js'
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= yeoman.banner %>'
            },
            build: {
                options: {
                    stripBanners: false
                },
                src: ['<%= yeoman.src %>/*.js',
                    '<%= yeoman.build %>/angular-datatables.template.js'
                ],
                dest: '<%= yeoman.build %>/angular-datatables.js'
            },
            // Copy the source files with the banner in dist folder
            banner: {
                src: ['<%= yeoman.build %>/angular-datatables.js'],
                dest: '<%= yeoman.dist %>/angular-datatables.js'
            },
            bannerCSS: {
                src: ['<%= yeoman.src %>/angular-datatables.css'],
                dest: '<%= yeoman.dist %>/angular-datatables.css'
            }
        },
        cssmin: {
            options: {
                banner: '<%= yeoman.banner %>'
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/angular-datatables.min.css': [
                        '<%= yeoman.src %>/*.css'
                    ]
                }
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.build %>',
                    src: '*.js',
                    dest: '<%= yeoman.build %>'
                }]
            }
        },
        uglify: {
            options: {
                banner: '<%= yeoman.banner %>'
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/angular-datatables.min.js': [
                        '<%= yeoman.build %>/angular-datatables.js'
                    ]
                }
            }
        },
        /** ------------- JS UNIT TESTING + CODE COVERAGE ------------- */
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });

    /** ---------------------------------------------------- */
    /** ------------- GRUNT TASKS REGISTRATION ------------- */
    /** ---------------------------------------------------- */

    // Task to format js source code
    grunt.registerTask('format', [
        'jsbeautifier'
    ]);

    grunt.registerTask('test', [
        'karma'
    ]);

    grunt.registerTask('serve', [
        'clean:server',
        'express:livereload',
        'watch:livereload'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'ngtemplates',
        'concat:build',
        'ngmin',
        'cssmin',
        'uglify',
        'concat:banner',
        'concat:bannerCSS'
    ]);

    grunt.registerTask('default', [
        'format',
        'jshint',
        'test',
        'build'
    ]);
};
