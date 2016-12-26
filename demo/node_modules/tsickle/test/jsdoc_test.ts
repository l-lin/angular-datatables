import {expect} from 'chai';

import * as jsdoc from '../src/jsdoc';

describe('jsdoc.parse', () => {
  it('does not get non-jsdoc values', () => {
    let source = '/* ordinary comment */';
    expect(jsdoc.parse(source)).to.equal(null);
  });
  it('grabs plain text from jsdoc', () => {
    let source = '/** jsdoc comment */';
    expect(jsdoc.parse(source)).to.deep.equal({tags: [{text: 'jsdoc comment'}]});
  });
  it('gathers @tags from jsdoc', () => {
    let source = `/**
  * @param foo
  * @param bar multiple
  *    line comment
  * @return foobar
  * @nosideeffects
  */`;
    expect(jsdoc.parse(source)).to.deep.equal({
      tags: [
        {tagName: 'param', parameterName: 'foo'},
        {tagName: 'param', parameterName: 'bar', text: 'multiple line comment'},
        {tagName: 'return', text: 'foobar'},
        {tagName: 'nosideeffects'},
      ]
    });
  });
  it('warns on type annotations in parameters', () => {
    let source = `/**
  * @param {string} foo
*/`;
    expect(jsdoc.parse(source)).to.deep.equal({
      tags: [],
      warnings: ['type annotations (using {...}) are redundant with TypeScript types']
    });
  });
  it('warns on @type annotations', () => {
    let source = `/** @type {string} foo */`;
    expect(jsdoc.parse(source)).to.deep.equal({
      tags: [],
      warnings: ['@type annotations are redundant with TypeScript equivalents']
    });
  });
  it('allows @suppress annotations', () => {
    let source = `/** @suppress {checkTypes} I hate types */`;
    expect(jsdoc.parse(source)).to.deep.equal({
      tags: [{tagName: 'suppress', text: '{checkTypes} I hate types'}]
    });
  });
});
