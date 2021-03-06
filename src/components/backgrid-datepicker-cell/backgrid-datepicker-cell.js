/*
 backgrid-datepicker-cell

 This is a simple datepicker cell based on MomentCell and
 showing the bootstrap datepicker onclick.

 Beware that this Datepicker does never show any time, just date.
 But as momentjs always works with the time, we still have to deal
 with it for the value (meaning, the resulting value from the formatter
 after toRaw()) *does* contain time again.

 We force date-only display by getting the "L" date format from momentjs.
 This should be pretty locale safe.

 I am aware that this is more complicated then just using the DateCell;
 but again, DateCell can only deal with ISO-formatted dates.

 Copyright (c) 2014 Dario Nuevo
 */
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore', 'backgrid'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require("underscore"),
      require("backgrid"));
  } else {
    // Browser globals
    factory(root._, root.Backgrid);
  }

}(this, function (_, Backgrid) {

  /**
   Renders an input box with a datepicker for date selection.

   @class Backgrid.Extension.DatePickerEditor
   @extends Backgrid.InputCellEditor
   */

  var DatePickerEditor = Backgrid.Extension.DatePickerEditor = Backgrid.InputCellEditor.extend({

    /** @property */
    dateFormat: false,
    calendarVisible: false,

    datePickerOptions: {},

    // sadly, our datepicker uses a different date format as moment.js ;-((
    dateFormatReplacements: {
      'DD': 'dd',
      'MM': 'mm',
      'YYYY': 'yyyy'
    },

    initialize: function (options) {
      DatePickerEditor.__super__.initialize.apply(this, arguments);

      if (this.dateFormat == false) {
        var formatterFormat = this.formatter.displayFormat;

        // replace for bootstrap datepicker format..
        for (key in this.dateFormatReplacements) {
          formatterFormat = formatterFormat.replace(key, this.dateFormatReplacements[key]);
        }

        this.dateFormat = formatterFormat;
      }
    },

    saveOrCancel: function (e) {
      // here, we block the blur event if a calendar is visible..
      if (this.calendarVisible == false) {
        DatePickerEditor.__super__.saveOrCancel.apply(this, arguments);
      }
    },

    /**
     Renders the datepicker on our editor
     */
    render: function () {

      DatePickerEditor.__super__.render.apply(this, arguments);

      this.delegateEvents();

      var initOptions = $.extend(this.datePickerOptions, {
        format: this.dateFormat
      });

      // set language just now ;-)
      initOptions.language = moment.lang();

      this.$el.datepicker(initOptions)
        // pass on blur..
        .on('show', function(e) {
          this.calendarVisible = true;
        }.bind(this))
        .on('hide', function(e) {
          this.calendarVisible = false;
          this.$el.trigger('blur');
       }.bind(this));

      return this;
    }

  });

  var DatepickerCell = Backgrid.Extension.DatepickerCell = Backgrid.Extension.MomentCell.extend({
    editor: DatePickerEditor,
    datePickerOptions: {},
    displayFormat: moment.langData().longDateFormat("L"),

    initialize: function (options) {
      DatepickerCell.__super__.initialize.apply(this, arguments);

      this.editor = this.editor.extend({
        datePickerOptions: _.extend({}, this.editor.datePickerOptions, this.datePickerOptions)
      });
    }

  });

}));
