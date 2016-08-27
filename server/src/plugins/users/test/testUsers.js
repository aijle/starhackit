import assert from 'assert';
import testMngr from '~/test/testManager';
import UserApi from '../user/UserApi';

describe('Users', function() {
  let client;
  let userApi;

  before(async () => {
      await testMngr.start();
  });
  after(async () => {
      await testMngr.stop();
  });

  describe('Admin', () => {
    before(async () => {
      client = testMngr.client('admin');
      assert(client);
      let res = await client.login();
      assert(res);
      userApi = UserApi(testMngr.app);
      assert(userApi);
    });

    it('should get all users', async () => {
      let users = await client.get('v1/users');
      assert(users);
      assert(Number.isInteger(users.count));
      assert(users.data);

      //console.log(users);
      for(let user of users.data){
        let userGetOne = await client.get(`v1/users/${user.id}`);
        assert(userGetOne);
        //console.log('user ' , userGetOne);
        //assert(_.isEqual(user, userGetOne));
        assert(user);
        //console.log('user:', user)
        assert(userGetOne.id);
        assert(userGetOne.username);
        assert(userGetOne.createdAt);
        assert(userGetOne.updatedAt);
        assert(!userGetOne.password);
        assert(!userGetOne.passwordHash);
      }
    });
    it('should get all users with filter ASC', async () => {
      let res = await client.get('v1/users?offset=1&order=ASC&limit=10');
      let users = await userApi.getAll({ offset:1, order:'ASC', limit:10 });
      assert.equal(res.data.length, users.data.length);
      //console.log(res.data[0])
      assert(res.data[0].id);
    });
    it('should get all users with filter DESC', async () => {
      let res = await client.get('v1/users?offset=10&limit=10');
      let users = await userApi.getAll({ offset:10, limit:10 });
      assert.equal(res.data.length, users.data.length);
    });

    it.skip('should not create a new user with missing username', async () => {
      try {
        await client.post('v1/users');
        assert(false);
      } catch(err){
        assert(err);
        assert.equal(err.statusCode, 400);
      }
    });
  });
  describe('User Basic ', () => {
    before(async () => {
      client = testMngr.client('alice');
      assert(client);
      let res = await client.login();
      assert(res);
    });
    it('should not list on all users', async () => {
      try {
        await client.get('v1/users');
        assert(false);
      } catch(err){
        assert(err);
        assert.equal(err.statusCode, 401);
      }
    });
  });
});
