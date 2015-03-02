'use strict';
angular.module('datatablesSampleApp')
.controller('SidebarCtrl', SidebarCtrl);

function SidebarCtrl($scope, $resource, USAGES) {
    var vm = this;
    vm.currentView = 'gettingStarted';
    vm.basicUsages = USAGES.basic;
    vm.advancedUsages = USAGES.advanced;
    vm.withPluginsUsages = USAGES.withPlugins;
    vm.archives = $resource('/angular-datatables/archives.json').query();
    // Functions
    vm.isActive = isActive;
    vm.isBasicUsageActive = isBasicUsageActive;
    vm.isAdvancedUsageActive = isAdvancedUsageActive;
    vm.isWithPluginsUsageActive = isWithPluginsUsageActive;

    // Listeners
    $scope.$on('event:changeView', function (event, view) {
        vm.currentView = view;
        vm.isBasicUsageCollapsed = vm.isBasicUsageActive();
        vm.isAdvancedUsageCollapsed = vm.isAdvancedUsageActive();
        vm.isWithPluginsUsageCollapsed = vm.isWithPluginsUsageActive();
    });

    function _isUsageActive(usages, currentView) {
        var active = false;
        angular.forEach(usages, function(usage) {
            if (currentView === usage.name) {
                active = true;
            }
        });
        return active;
    }

    function isActive(view) {
        return vm.currentView === view;
    }
    function isBasicUsageActive() {
        return _isUsageActive(USAGES.basic, vm.currentView);
    }
    function isAdvancedUsageActive() {
        return _isUsageActive(USAGES.advanced, vm.currentView);
    }
    function isWithPluginsUsageActive() {
        return _isUsageActive(USAGES.withPlugins, vm.currentView);
    }
}
