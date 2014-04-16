'use strict';

describe('Directive: apTable', function () {

  // load the directive's module
  beforeEach(module('andyperlitch.apTable'));

  var element,
  scope,
  compile,
  genRows;

  beforeEach(inject(function ($compile, $rootScope) {
    // Format functions
    function inches2feet(inches){
      var feet = Math.floor(inches/12);
      inches = inches % 12;
      return feet + '\'' + inches + '"';
    }
    function feet_filter(term, value) {
      if (term === 'tall') { return value > 70; }
      if (term === 'short') { return value < 69; }
      return true;
    }

    // Random data generator
    genRows = function(num){
      var retVal = [];
      for (var i=0; i < num; i++) {
        retVal.push(genRow(i));
      }
      return retVal;
    };
    function genRow(id){

      var fnames = ['joe','fred','frank','jim','mike','gary','aziz'];
      var lnames = ['sterling','smith','erickson','burke','ansari'];
      var seed = Math.random();
      var seed2 = Math.random();
      var first_name = fnames[ Math.round( seed * (fnames.length -1) ) ];
      var last_name = lnames[ Math.round( seed * (lnames.length -1) ) ];
      
      return {
        id: id,
        selected: false,
        first_name: first_name,
        last_name: last_name,
        age: Math.ceil(seed * 75) + 15,
        height: Math.round( seed2 * 36 ) + 48,
        weight: Math.round( seed2 * 130 ) + 90
      };
    }
    
    scope = $rootScope.$new();
    compile = $compile;

    // Table columns
    scope.my_table_columns = [
      { id: 'selector', key: 'selected', label: '', select: true, width: '30px', lock_width: true },
      { id: 'ID', key: 'id', sort: 'number', filter: 'number' },
      { id: 'first_name', key: 'first_name', label: 'First Name', sort: 'string', filter: 'like',  },
      { id: 'last_name', key: 'last_name', label: 'Last Name', sort: 'string', filter: 'like',  },
      { id: 'age', key: 'age', label: 'Age', sort: 'number', filter: 'number' },
      { id: 'height', key: 'height', label: 'Height', format: inches2feet, filter: feet_filter, sort: 'number' },
      { id: 'weight', key: 'weight', label: 'Weight', filter: 'number', sort: 'number' }
    ];

    // Table data
    scope.my_table_data = genRows(30);

    element = angular.element('<ap-table columns="my_table_columns" rows="my_table_data" class="table"></ap-table>');
    element = compile(element)(scope);
    scope.$digest();
  }));

  it('should create a table', function () {
    expect(element.find('table').length).to.equal(1);
  });

  it('should display the data passed to it', function () {
    var expected = scope.my_table_data[0].first_name;
    var actual = element.find('table tbody tr:eq(0) td:eq(2)').text();
    actual = $.trim(actual);
    expect(actual).to.equal(expected);
  });

  it('should update displayed values when data has been updated', function() {
    scope.my_table_data = genRows(30);
    scope.$apply();
    var expected = scope.my_table_data[0].first_name;
    var actual = element.find('table tbody tr:eq(0) td:eq(2)').text();
    actual = $.trim(actual);
    expect(actual).to.equal(expected);
  });

  describe('column header', function() {
    
    it('should have a .column-resizer element if lock_width is not set', function() {
      expect(element.find('table th:eq(1) .column-resizer').length).to.equal(1);
    });

    it('should not have a .column-resizer element if lock_width is set to true', function() {
      expect(element.find('table th:eq(0) .column-resizer').length).to.equal(0);
    });

    it('should set the style to column.width if supplied in column definition', function() {
      expect(element.find('table th:eq(0)').css('width')).to.equal(scope.my_table_columns[0].width);
    });

    it('should display column.id if column.label is not specified', function() {
      var actual = $.trim(element.find('table th:eq(1) .column-text').text());
      expect(actual).to.equal(scope.my_table_columns[1].id);
    });

    it('should display column.label if it is present', function() {
      var actual = $.trim(element.find('table th:eq(2) .column-text').text());
      expect(actual).to.equal(scope.my_table_columns[2].label);
    });

    it('should display column.label if it is present, even if it is a falsey value', function() {
      var actual = $.trim(element.find('table th:eq(0) .column-text').text());
      expect(actual).to.equal(scope.my_table_columns[0].label);
    });

  });

});