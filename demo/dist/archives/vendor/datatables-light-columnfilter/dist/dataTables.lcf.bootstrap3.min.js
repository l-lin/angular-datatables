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
!function(a,b){var c=function(a,b){"use strict";b.filter.selectBase=a.extend(!0,{},b.filter.select),b.filter.select={},a.extend(b.filter.select,b.filter.selectBase,{dom:function(a){return b.filter.selectBase.dom.call(this,a),this.elements.addClass("form-control input-sm"),this.elements}}),b.filter.textBase=a.extend(!0,{},b.filter.text),b.filter.text={},a.extend(b.filter.text,b.filter.textBase,{dom:function(a){return b.filter.textBase.dom.call(this,a),this.elements.addClass("form-control input-sm"),this.elements}}),b.filter.dateRangeBase=a.extend(!0,{},b.filter.dateRange),b.filter.dateRange={},a.extend(b.filter.dateRange,b.filter.dateRangeBase,{separator:"~",dom:function(b){var c,d;return this.div=a("<div>").addClass("input-group input-daterange"),c=a("<input>",{type:"text"}).addClass("form-control input-sm").attr("name","start").appendTo(this.div),d=a("<input>",{type:"text"}).addClass("form-control input-sm").attr("name","end").appendTo(this.div),this.elements=c.add(d),this.div.appendTo(b),this.elements},bindEvents:function(){var a=this;this.div.datepicker("clearDates").on("changeDate",function(){a.search()})},format:function(a){return a.split("/").reverse().join("-")},request:function(){var b=this,c=[];return b.elements.each(function(){var d=a(this).val();d=b.options.format(d),c.push(d)}),c.join(b.options.separator)}})};"function"==typeof define&&define.amd?define(["jquery","datatables-light-columnfilter"],c):"object"==typeof exports?c(require("jquery"),require("datatables-light-columnfilter")):jQuery&&c(jQuery,jQuery.fn.dataTable.ColumnFilter)}(window,document);