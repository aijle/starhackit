import assert from 'assert';
import sinon from 'sinon';
import _ from 'lodash';
import {Publisher} from 'rabbitmq-pubsub';
import config from 'config';

import MailJob from './MailJob';

describe('MailJob', function () {
  let publisher;
  let sandbox;

  before(async() => {
    let options = {exchange:"user", url: config.rabbitmq.url};
    publisher = new Publisher(options, config.log);
    await publisher.start();
  });

  after(async() => {
    await publisher.stop();
  });

  beforeEach(function (done) {
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  let user = {
    email: 'aijle@qq.com',
    code:'1234567890123456'
  };

  let emailType = 'user.registering';

  describe('Basic', () => {
    let mailJob;
    beforeEach(function (done) {
      mailJob = new MailJob(config);
      done();
    });

    afterEach(function (done) {
      done();
    });
    it('getTemplate ok', async() => {
      let content = await mailJob.getTemplate(emailType);
      assert(content);
    });
    it('getTemplate ko', async() => {
      let content = await mailJob.getTemplate(emailType);
      assert(content);
    });
    it('send user registration email', async() => {
      await mailJob._sendEmail(emailType, user);
    });
    it('send reset password email', async() => {
      let passwordReset = 'user.resetpassword';
      await mailJob._sendEmail(passwordReset, user);
    });
    it('invalid email type', async() => {
      try {
        await mailJob._sendEmail('invalidEmailType', user);
      } catch(error){
        assert(error);
        assert.equal(error.code, 'ENOENT');
      }
    });
    it('no email', async() => {
      try {
        await mailJob._sendEmail(emailType, {});
      } catch(error){
        assert(error);
        assert.equal(error.name, 'email not set');
      }
    });
    it('no token', async() => {
      try {
        await mailJob._sendEmail(emailType, {email:user.email});
      } catch(error){
        assert(error);
        assert.equal(error.name, 'token not set');
      }
    });
  });

  describe('StartStop', () => {
    let mailJob;
    beforeEach(async () => {
      mailJob = new MailJob(config);
      await mailJob.start();
    });

    afterEach(async () => {
      mailJob._sendEmail.restore();
      await mailJob.stop();
    });

    it('publish user.register', async() => {
      const prom = new Promise(function(resolve, reject) {
        sinon.stub(mailJob, "_sendEmail", (type, userToSend) => {
          //console.log("_sendEmail has been called");
          assert.equal(type, 'user.registering');
          assert(userToSend);
          assert.equal(userToSend.email, user.email);
          resolve();
        });
      });

      const prom2 = publisher.publish("user.registering", JSON.stringify(user));
      await Promise.all([prom, prom2]);
    });

    it('publish user.resetpassword', async() => {
      const prom = new Promise(function(resolve, reject) {
        sinon.stub(mailJob, "_sendEmail", (type, userToSend) => {
          //console.log("_sendEmail has been called");
          assert.equal(type, 'user.resetpassword');
          assert(userToSend);
          assert.equal(userToSend.email, user.email);
          resolve();
        });
      });

      const prom2 =  publisher.publish("user.resetpassword", JSON.stringify(user));
      await Promise.all([prom, prom2]);
    });

    // it('publish a non JSON message', async() => {
    //   const prom = new Promise(function(resolve, reject) {
    //     sinon.stub(mailJob, "_sendEmail", () => {
    //       resolve();
    //     });
    //   });
    //
    //   const prom2 = publisher.publish("user.resetpassword", "not a json");
    //   await Promise.all([prom, prom2]);
    // });
  });

  describe('Ko', () => {
    it.skip('login failed', async() => {
      let badPasswordConfig = _.clone(config, true);
      //console.log(JSON.stringify(badPasswordConfig));
      badPasswordConfig.mail.smtp.auth.pass = "1234567890";

      let mailJob = new MailJob(badPasswordConfig);

      try {
        await mailJob._sendEmail(emailType, user);
      } catch(error){
        assert(error);
        assert.equal(error.code, "EAUTH");
      }
    });
  });
});
