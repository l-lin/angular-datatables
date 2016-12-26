import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';
import * as sinon from 'sinon';
import 'ignore-styles';

nock.disableNetConnect();

declare var global: any;

global.chai = chai;
global.expect = chai.expect;

chai.use(sinonChai);
chai.use(chaiAsPromised);

global.__DEV__ = false;
global.__TEST__ = true;
global.BASE_URL = 'http://localhost';

global.sinon = sinon;
