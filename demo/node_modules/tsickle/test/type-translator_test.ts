import {expect} from 'chai';

import * as typeTranslator from '../src/type-translator';

describe('isBuiltinLibDTS', () => {
  it('matches builtins', () => {
    expect(typeTranslator.isBuiltinLibDTS('lib.d.ts')).to.equal(true);
    expect(typeTranslator.isBuiltinLibDTS('lib.es6.d.ts')).to.equal(true);
  });

  it('doesn\'t match others', () => {
    expect(typeTranslator.isBuiltinLibDTS('lib.ts')).to.equal(false);
    expect(typeTranslator.isBuiltinLibDTS('libfoo.d.tts')).to.equal(false);
    expect(typeTranslator.isBuiltinLibDTS('lib.a/b.d.tts')).to.equal(false);
  });
});
