/*!
 * @author Thomas <thansen@solire.fr>
 * @licence CC BY-NC 4.0 http://creativecommons.org/licenses/by-nc/4.0/
 *
 * A light filter column pluggin for jquery.dataTables#1.10
 */
(function(window, document) {
  var factory = function($, dataTable) {
    'use strict';

    var
      /**
       * Create a new Column instance
       *
       * @param {DataTable} dataTable       The DataTables object
       * @param {integer}   index           The index of the column
       * @param {DataTable} dataTableColumn The DataTables Column object
       * @param {object}    options         The columnfilter options for this column
       *
       * @returns {Column}
       */
      Column = function(dataTable, index, dataTableColumn, options) {
        var
          self = this,
          defaultOptions,
          methods = [
            'dom',
            'bindEvents',
            'request'
          ]
        ;

        if (options.type in ColumnFilter.filter) {
          defaultOptions = $.extend({}, ColumnFilter.filter[options.type]);
        } else {
          defaultOptions = {};
        }
        self.options = $.extend({}, defaultOptions, options);

        $.each(methods, function(ii, method){
          if (method in self.options) {
            self[method] = self.options[method];
          }
        })

        self.dataTable = dataTable;
        self.dataTableColumn = dataTableColumn;
        self.index = index;
      },
      /**
       * Create a new ColumnFilter instance
       *
       * @param {DataTable} dataTable The DataTables object
       * @param {object}    options   The columnfilter options
       *
       * @returns {ColumnFilter}
       */
      ColumnFilter = function(dataTable, options) {
        var self = this;

        self.columns = [];
        self.dataTable = null;
        self.init(dataTable, options);
      }
    ;

    Column.prototype = {
      /**
       * Build the form DOM elements
       *
       * @param {type} th The th element where to put the elements
       *
       * @returns {jQuery}
       */
      dom: function(th){},
      /**
       * Binds event to the DOM elements
       *
       * @returns {void}
       */
      bindEvents: function(){},
      /**
       * Return the searched string
       *
       * @returns {string}
       */
      request: function(){},
      /**
       * Trigger the datatable search with the request
       *
       * @returns {void}
       */
      search: function(){
        var self = this;

        self
          .dataTableColumn
          .search(self.request())
          .draw()
        ;
      }
    }

    ColumnFilter.prototype = {
      /**
       * Initialize the filter pluggin
       *
       * @param {DataTable} dataTable
       * @param {object}    options
       *
       * @returns {void}
       */
      init: function(dataTable, options){
        var
          self = this,
          tr
        ;

        self.dataTable = dataTable;

        tr = $('<tr>').appendTo(self.dataTable.table().header());

        self.dataTable.columns().eq(0).each(function(index){
          var
            className = self.dataTable.column(index).header().className,
            never = className.match(/\bnever\b/),
            columnOptions,
            column,
            th
          ;

          if (never && ('responsive' in self.dataTable)) {
            return;
          }

          columnOptions = index in options ? options[index] : {};
          column = new Column(
            self.dataTable,
            index,
            self.dataTable.column(index),
            columnOptions
          );
          th = $('<th>').appendTo(tr);
          self.columns.push(column);

          column.dom(th);
          column.bindEvents();
        });

        // Hide and Show column filter th according to datatable build-in columns visibility
        $(self.dataTable.table().node()).on('column-visibility.dt', function (e, settings, column, state) {
          if (state) {
            $('th', tr).eq(column - 1).show()
          } else {
            $('th', tr).eq(column - 1).hide()
          }
        });
      },
      /**
       * Add a custom filter
       *
       * @param {string} name
       * @param {object} filter
       *
       * @returns {void}
       */
      addFilter: function(name, filter){
        ColumnFilter.filter[name] = filter;
      }
    };

    /**
     * Default Column configuration
     */
    ColumnFilter.default = {
      type: 'text'
    };

    ColumnFilter.filter = {
      text: {
        /**
         * Build the form DOM elements
         *
         * @param {type} th The th element where to put the elements
         *
         * @returns {jQuery}
         */
        dom: function(th){
          var self = this;

          self.elements = $('<input>', {
            type: 'text'
          }).appendTo(th);

          if (typeof self.options.width !== 'undefined') {
            self.elements.css('width', self.options.width);
          } else {
            self.elements.css('width', '100%');
          }

          return self.elements;
        },
        /**
         * Binds event to the DOM elements
         *
         * @returns {void}
         */
        bindEvents: function(){
          var
            self = this,
            time = 200,
            timeOutId = 0
          ;

          if ('time' in self.options) {
            time = self.options.time;
          }

          self.elements.keyup(function(){
            clearTimeout(timeOutId);
            timeOutId = window.setTimeout(function(){
              self.search();
            }, time);
          });
        },
        /**
         * Return the searched string
         *
         * @returns {string}
         */
        request: function(){
          var self = this;

          return self.elements.val();
        }
      },
      select: {
        dom: function(th){
          var self = this, select;

          select = $('<select>').append('<option></option>');

          select.addClass(self.options.cssClass);

          $.each(self.options.values, function(ii, value){
            $('<option>').val(value.value).text(value.label).appendTo(select);
          });

          self.elements = select.appendTo(th);

          if (typeof self.options.width !== 'undefined') {
            self.elements.css('width', self.options.width);
          } else {
            self.elements.css('width', '100%');
          }

          return self.elements;
        },
        bindEvents: function(){
          var self = this;

          self.elements.on('change', function(){
            self.search();
          });
        },
        request: function(){
          var self = this;

          return self.elements.val();
        }
      },
      dateRange: {
        separator: '~',
        /**
         * Build the form DOM elements
         *
         * @param {type} th The th element where to put the elements
         *
         * @returns {jQuery}
         */
        dom: function(th){
          var self = this;

          self.elements = $('<input>', {
            type: 'text'
          }).add($('<input>', {
              type: 'text'
          })).appendTo(th);

          if (typeof self.options.width !== 'undefined') {
            self.elements.css('width', self.options.width);
          } else {
            self.elements.css('width', '50%');
          }

          return self.elements;
        },
        /**
         * Binds event to the DOM elements
         *
         * @returns {void}
         */
        bindEvents: function(){
          var self = this;

          self.elements.change(function(){
            self.search();
          });
        },
        /**
         * Return the searched string
         *
         * @returns {string}
         */
        request: function(){
          var
            self = this,
            request = []
          ;

          self.elements.each(function(){
            request.push($(this).val());
          });

          return request.join(self.options.separator);
        }
      }
    };

    $.fn.dataTable.ColumnFilter = ColumnFilter;
    $.fn.DataTable.ColumnFilter = ColumnFilter;

    return ColumnFilter;
  };

  // Define as an AMD module if possible
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'), require('datatables'));
  } else if (jQuery && !jQuery.fn.dataTable.ColumnFilter) {
    // Otherwise simply initialise as normal, stopping multiple evaluation
    factory(jQuery, jQuery.fn.dataTable);
  }
})(window, document);
