'use strict';
angular.module('showcase.withAngularTranslate')
    .controller('WithAngularTranslateSwitchLanguageCtrl', WithAngularTranslateSwitchLanguageCtrl);

function WithAngularTranslateSwitchLanguageCtrl(DTOptionsBuilder, DTColumnBuilder, $translate) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json');
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id'),
        DTColumnBuilder.newColumn('firstName'),
        DTColumnBuilder.newColumn('lastName')
    ];
    vm.switchLanguage = switchLanguage;
    vm.lang = 'en';

    function switchLanguage(lang) {
        $translate.use(lang);
    }
}
