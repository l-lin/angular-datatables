(function() {
    'use strict';

    var express = require('express'),
        $ = require('./vendor/jquery/jquery.min');
        
    var app = express();
    app.configure(function() {
        app.use(express.bodyParser());
        app.use(express.methodOverride());
    });
    
    var firstNameList = ['Foo', 'Toto', 'Louis', 'Cartman', 'Luke', 'Zed', 'Superman', 'Batman', 'Someone First Name'],
        lastNameList = ['Bar', 'Titi', 'Someone Last Name', 'Kyle', 'Yoda', 'Lara', 'Moliku', 'Whateveryournameis']
    
    var randomNumber = function(maxNumber) {
        return Math.floor(Math.random() * maxNumber);
    };
    var randomInArray = function(array) {
        return array[randomNumber(array.length)];
    };
    var userList = [];
    for (var index = 0; index < 3000; index++) {
        userList.push({
            id: randomNumber(10000),
            firstName: randomInArray(firstNameList),
            lastName: randomInArray(lastNameList)
        });
    }

    var findData = function (dataList, parameters) {
        var userList = [];
        for (var index = 0; index < parameters.length; index++) {
            userList.push({
                id: randomNumber(10000),
                firstName: randomInArray(firstNameList),
                lastName: randomInArray(lastNameList)
            });
        }
        return {
            draw: parameters.draw,
            recordsTotal: userList.length * 10,
            recordsFiltered: userList.length * 10,
            data: userList
        };
    };
    
    app.get('/data', function(req, res) {
        var userList = [];
        for (var index = 0; index < 3000; index++) {
            userList.push({
                id: randomNumber(10000),
                firstName: randomInArray(firstNameList),
                lastName: randomInArray(lastNameList)
            });
        }
        res.json(userList);
    });

    app.post('/data/serverSideProcessing', function (req, res) {
        var parameters = req.body;

        res.json(findData(userList, parameters));
    });
    
    module.exports = app;
})();
