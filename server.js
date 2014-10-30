'use strict';

var _firstNameList = ['Foo', 'Toto', 'Louis', 'Cartman', 'Luke', 'Zed', 'Superman', 'Batman', 'Someone First Name'],
    _lastNameList = ['Bar', 'Titi', 'Someone Last Name', 'Kyle', 'Yoda', 'Lara', 'Moliku', 'Whateveryournameis'];

var _randomNumber = function(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
};
var _randomInArray = function(array) {
    return array[_randomNumber(array.length)];
};
var _userList = [];
for (var index = 0; index < 3000; index++) {
    _userList.push({
        id: _randomNumber(10000),
        firstName: _randomInArray(_firstNameList),
        lastName: _randomInArray(_lastNameList)
    });
}

var _findData = function (dataList, parameters) {
    var _userList = [];
    for (var index = 0; index < parameters.length; index++) {
        _userList.push({
            id: _randomNumber(10000),
            firstName: _randomInArray(_firstNameList),
            lastName: _randomInArray(_lastNameList)
        });
    }
    return {
        draw: parameters.draw,
        recordsTotal: _userList.length * 10,
        recordsFiltered: _userList.length * 10,
        data: _userList
    };
};

// -----------
// EXPRESS
// -----------

var bodyParser = require('body-parser');
var express = require('express');

// -----------
// INIT
// -----------

var app = express();
// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// -----------
// ROUTING
// -----------

app.use('/angular-datatables', express.static(__dirname));

app.get('/angular-datatables/data', function(req, res) {
    var _userList = [];
    for (var index = 0; index < 3000; index++) {
        _userList.push({
            id: _randomNumber(10000),
            firstName: _randomInArray(_firstNameList),
            lastName: _randomInArray(_lastNameList)
        });
    }
    res.json(_userList);
});

app.post('/angular-datatables/data/serverSideProcessing', function (req, res) {
    var parameters = req.body;

    res.json(_findData(_userList, parameters));
});

module.exports = app;
