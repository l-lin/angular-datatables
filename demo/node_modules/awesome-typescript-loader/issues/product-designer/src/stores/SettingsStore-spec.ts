import { toJS } from 'mobx';
import * as nock from 'nock';

import { iocContainer } from '../utils/ioc';
import { SettingsStore, ISettings } from './SettingsStore';

describe('Settings store', function () {
  let store: SettingsStore;

  beforeEach(function () {
    store = iocContainer.get(SettingsStore);
  });

  afterEach(function () {
    nock.cleanAll();
  });

  describe('load', function () {
    const settings: ISettings = {
      calculationTags: ['calculation-tag'],
      dimensionTags: ['dimension-tag'],
      elementTags: ['element-tag'],
      languages: ['en-US'],
    };

    it('should load settings from api', function () {
      const scope = nock(BASE_URL).get('/api/settings').reply(200);
      return store.load().then(() => scope.done());
    });

    it('should set loading status as expected', function () {
      const scope = nock(BASE_URL).get('/api/settings').reply(200);
      const promise = store.load()
        .then(() => {
          scope.done();
          expect(store.loading).to.be.false;
        });

      expect(store.loading).to.be.true;
      return promise;
    });

    it('should set the returned settings on the store', function () {
      const scope = nock(BASE_URL).get('/api/settings').reply(200, settings);
      return store.load()
        .then(result => {
          scope.done();
          expect(toJS(result)).to.deep.equal(settings);
        });
    });

    it('should handle errors as expected', function () {
      const scope = nock(BASE_URL)
        .get('/api/settings')
        .replyWithError('nope');

      const promise = expect(store.load()).to.be.rejectedWith(/nope/)
        .then(() => {
          scope.done();
          expect(store.error).to.match(/nope/);
          expect(store.loading).to.be.false;
        });

      expect(store.loading).to.be.true;

      return promise;
    });
  });
});
