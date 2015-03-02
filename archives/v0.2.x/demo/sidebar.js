'use strict';
angular.module('datatablesSampleApp')
.controller('sidebarCtrl', function($scope, $resource, USAGES) {
    var _isUsageActive = function(usages, currentView) {
        var active = false;
        angular.forEach(usages, function(usage) {
            if (currentView === usage.name) {
                active = true;
            }
        });
        return active;
    };
    $scope.currentView = 'gettingStarted';
    $scope.basicUsages = USAGES.basic;
    $scope.advancedUsages = USAGES.advanced;
    $scope.withPluginsUsages = USAGES.withPlugins;
    $scope.archives = $resource('/angular-datatables/archives.json').query();

    // Functions
    $scope.isActive = function (view) {
        return $scope.currentView === view;
    };
    $scope.isBasicUsageActive = function () {
        return _isUsageActive(USAGES.basic, $scope.currentView);
    };
    $scope.isAdvancedUsageActive = function () {
        return _isUsageActive(USAGES.advanced, $scope.currentView);
    };
    $scope.isWithPluginsUsageActive = function () {
        return _isUsageActive(USAGES.withPlugins, $scope.currentView);
    };

    // Listeners
    $scope.$on('event:changeView', function (event, view) {
        $scope.currentView = view;
        $scope.isBasicUsageCollapsed = $scope.isBasicUsageActive();
        $scope.isAdvancedUsageCollapsed = $scope.isAdvancedUsageActive();
        $scope.isWithPluginsUsageCollapsed = $scope.isWithPluginsUsageActive();
    });
});
