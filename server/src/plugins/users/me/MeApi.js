let log = require('logfilename')(__filename);

export default function MeApi(app) {
  let models = app.data.models();
  let validateJson = app.utils.api.validateJson;

  return {
    async getByUserId(userId) {
      log.debug("index userId: ", userId);
      let user = await models.User.findByUserId(userId);
      //log.debug("index user: ", user.get());
      return user.toJSON();
    },
    async patch(userId, data) {
      validateJson(data, require('./schema/patch.json'));
      log.debug("patch userId %s, data: ", userId, data);
      //TODO refactor with nested data
      await app.data.sequelize.transaction(async t => {
        await models.User.update(data, {
          where: {
            id: userId
          }
        }, { transaction: t });
        //TODO upsert ?
        await models.Profile.update(data, {
          where: {
            user_id: userId
          }
        }, { transaction: t });
        log.debug("patch done");
      });
      let updatedUser = await this.getByUserId(userId);
      return updatedUser;
    }
  };
}
