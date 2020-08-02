/*
* This tests our default hello endpoint, which allows you to test you authentication header.
* */
process.env.NODE_ENV = 'test';

const _ = require('lodash');
const Chai = require('chai');
const ChaiHttp = require('chai-http');

const Server = require('../../../src/index');
const Config = require('../../../src/lib/config');
const Security = require('../../../src/lib/helpers/security');

const Should = Chai.should();
Chai.use(ChaiHttp);

const Uri = `http://${Config.server.host}:${Config.server.port}`;
const Path = '/hello';

describe('api/users/putUserById', () => {

  let server = null;
  before(async () => {
    server = await Server.start();
  });

  it('with correct authorization header', async () => {

    const object = {
      id: 'user-id',
      contactName: 'Jelle de Boer',
      companyName: 'Swalbe',
      admin: true
    }
    const token = Security.createToken(object);

    return await Chai.request(Uri)
      .get(Path)
      .set('Authorization', token)
      .then((res) => {
        res.status.should.be.eql(200);
        res.text.should.be.contain('this is a fine authorization token');
        res.text.should.be.contain(object.id);
        res.text.should.be.contain(object.contactName);
      });

  });

  it('with bad token', async () => {

    return await Chai.request(Uri)
      .get(Path)
      .set('Authorization', 'not-a-valid-token')
      .then((res) => {
        res.status.should.be.eql(401);
        res.text.should.be.contain('Missing authentication');
      });

  });

  it('with bad object in token', async () => {

    const object = {
      notanid: 'user-id'
    }
    const token = Security.createToken(object);

    return await Chai.request(Uri)
      .get(Path)
      .set('Authorization', token)
      .then((res) => {
        res.status.should.be.eql(401);
        res.text.should.be.contain('Invalid credentials');
      });

  });

  after(async () => {
    server.stop();
  });

});