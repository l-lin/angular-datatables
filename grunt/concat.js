module.exports = {
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
        src: ['<%= yeoman.src %>/datatables.bootstrap.css'],
        dest: '<%= yeoman.dist %>/datatables.bootstrap.css'
    }
};
