module.exports = {
    advanced: {
        cwd: '<%= yeoman.build %>/',
        expand: true,
        src: ['**/*.js'],
        dest: '<%= yeoman.build %>/',
        options: {
            wrapper: function(filePath) {
                var regexpAngularModule = /angular-(\S+)\.js/i;
                regexpAngularModule.exec(filePath);
                var ngModule = RegExp.$1;
                var start =
                        '/* commonjs package manager support (eg componentjs) */\n' +
                        'if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {\n' +
                        '   module.exports = \'' + ngModule + '\';\n' +
                        '}\n' +
                        '(function (window, document, $, angular) {\n';
                var end = '\n})(window, document, jQuery, angular);';
                return [start, end]
            }
        }
    }
};
