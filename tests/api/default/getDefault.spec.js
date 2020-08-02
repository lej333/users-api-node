/*
* This tests our default alive endpoint on its response.
* */
process.env.NODE_ENV = 'test';

const _ = require('lodash');
const Chai = require('chai');
const ChaiHttp = require('chai-http');

const Server = require('../../../src/index');
const Package = require('../../../package');
const Config = require('../../../src/lib/config');

const Should = Chai.should();
Chai.use(ChaiHttp);

const Uri = `http://${Config.server.host}:${Config.server.port}`;
const Path = '/';

describe('api/default/getDefault', () => {

  let server = null;
  before(async () => {
    server = await Server.start();
  });

  it('getDefault', async () => {

    return await Chai.request(Uri)
      .get(Path)
      .then((res) => {
        res.status.should.be.eql(200);
        res.text.should.be.contain('is at your servers');
        res.text.should.be.contain(Package.version);
      });

  });

  after(async () => {
    server.stop();
  });

});