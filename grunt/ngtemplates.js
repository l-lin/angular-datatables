module.exports = {
    main: {
        options: {
            module: 'datatables',
            base: '<%= yeoman.src %>'
        },
        src: '<%= yeoman.src %>/*.html',
        dest: '<%= yeoman.build %>/angular-datatables.template.js'
    }
};
