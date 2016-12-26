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
(function (window, document) {
  var factory = function ($, ColumnFilter) {
    'use strict';

    // dans bootstrap
    ColumnFilter.filter.selectBase = $.extend(true, {}, ColumnFilter.filter.select);
    ColumnFilter.filter.select = {};
    $.extend(
      ColumnFilter.filter.select,
      ColumnFilter.filter.selectBase,
      {
        dom: function (th) {
          ColumnFilter.filter.selectBase.dom.call(this, th);

          this.elements.addClass('form-control input-sm');

          return this.elements;
        }
      }
    );

    ColumnFilter.filter.textBase = $.extend(true, {}, ColumnFilter.filter.text);
    ColumnFilter.filter.text = {};
    $.extend(
      ColumnFilter.filter.text,
      ColumnFilter.filter.textBase,
      {
        dom: function (th) {
          ColumnFilter.filter.textBase.dom.call(this, th);

          this.elements.addClass('form-control input-sm');

          return this.elements;
        }
      }
    );

    ColumnFilter.filter.dateRangeBase = $.extend(true, {}, ColumnFilter.filter.dateRange);
    ColumnFilter.filter.dateRange = {};
    $.extend(ColumnFilter.filter.dateRange, ColumnFilter.filter.dateRangeBase, {
      separator: '~',
      dom: function(th) {
          var self = this, input1, input2;

          this.div = $('<div>').addClass('input-group input-daterange');
          input1 = $('<input>', {
            type: 'text'
          }).addClass('form-control input-sm').attr('name', 'start').appendTo(this.div);

          input2 = $('<input>', {
            type: 'text'
          }).addClass('form-control input-sm').attr('name', 'end').appendTo(this.div);

          this.elements = input1.add(input2);

          this.div.appendTo(th);

          return this.elements;
      },
      bindEvents: function () {
        var self = this;

        this.div.datepicker('clearDates').on('changeDate', function () {
          self.search();
        });
      },
      format: function (value) {
        return value.split('/').reverse().join('-');
      },
      request: function () {
        var
                self = this,
                search = []
                ;

        self.elements.each(function () {
          var value = $(this).val();
          value = self.options.format(value);
          search.push(value);
        });

        return search.join(self.options.separator);
      }
    });
  };

  // Define as an AMD module if possible
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables-light-columnfilter'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'), require('datatables-light-columnfilter'));
  } else if (jQuery) {
    // Otherwise simply initialise as normal, stopping multiple evaluation
    factory(jQuery, jQuery.fn.dataTable.ColumnFilter);
  }
})(window, document);
