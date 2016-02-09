/*!
 * @author Thomas <thansen@solire.fr>
 * @licence CC BY-NC 4.0 http://creativecommons.org/licenses/by-nc/4.0/
 *
 * Wrapper module for bootstrap datepicker
 *
 * https://github.com/eternicode/bootstrap-datepicker
 * to install : bower install bootstrap-datepicker#1.3.*
 * or add : "bootstrap-datepicker": "1.3.*" in your bower.json
 */
!function(a,b){var c=function(a,b){"use strict";a.fn.datepicker.defaults.format="dd/mm/yyyy",a.extend(b.filter.dateRange,{separator:"~",bindEvents:function(){var a=this;a.elements.datepicker().on("changeDate",function(){a.search()})},format:function(a){return a.split("/").reverse().join("-")},request:function(){var b=this,c=[];return b.elements.each(function(){var d=a(this).val();d=b.options.format(d),c.push(d)}),c.join(b.options.separator)}})};"function"==typeof define&&define.amd?define(["jquery","datatables-light-columnfilter","datepicker"],c):"object"==typeof exports?c(require("jquery"),require("datatables-light-columnfilter"),require("datepicker")):jQuery&&c(jQuery,jQuery.fn.dataTable.ColumnFilter)}(window,document);