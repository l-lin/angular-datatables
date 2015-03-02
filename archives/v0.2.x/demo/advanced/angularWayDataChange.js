'use strict';
angular.module('datatablesSampleApp').controller('angularWayChangeDataCtrl', function ($scope, $resource, DTOptionsBuilder, DTColumnDefBuilder) {
    var _buildPerson2Add = function (id) {
        return {
            id: id,
            firstName: 'Foo' + id,
            lastName: 'Bar' + id
        };
    };

    $scope.persons = $resource('data1.json').query();
    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];

    $scope.person2Add = _buildPerson2Add(1);
    $scope.addPerson = function () {
        $scope.persons.push(angular.copy($scope.person2Add));
        $scope.person2Add = _buildPerson2Add($scope.person2Add.id + 1);
    };

    $scope.modifyPerson = function (index) {
        $scope.persons.splice(index, 1, angular.copy($scope.person2Add))
        $scope.person2Add = _buildPerson2Add($scope.person2Add.id + 1);
    };

    $scope.removePerson = function (index) {
        $scope.persons.splice(index, 1);
    };
});
