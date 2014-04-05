describe('angularDatatables: Factory', function() {
    'use strict';

    beforeEach(module('angularDatatables.factory'));

    var DATA = 'data.json',
        DTColumnBuilder;
    
    beforeEach(inject(function($inject) {
        DTColumnBuilder = $inject.get('DTColumnBuilder');
    }));

    it('should build the column', function() {
        // var column = DTColumnBuilder.newColumn(DATA);
        expect(column.mData).toBe(DATA);
    });
});
