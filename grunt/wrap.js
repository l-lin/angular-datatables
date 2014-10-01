module.exports = {
    basic: {
        src: ['<%= yeoman.build %>/angular-datatables.js'],
        dest: '<%= yeoman.build %>/angular-datatables.js',
        options: {
            wrapper: ['(function (window, document, $, angular) {\n', '\n})(window, document, jQuery, angular);']
        }
    }
};
