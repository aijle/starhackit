let log = require('logfilename')(__filename);

export default function (app, koaApp, config){
  // convert koa legacy ( v0.x & v1.x ) generator middleware to promise middleware ( v2.x )
  const convert = require('koa-convert');
  // connect-like session middleware
  const session = require('koa-generic-session');
  // redis session store base on koa-generic-session
  const redisStore = require('koa-redis');
  //TODO use secret from config
  koaApp.keys = ['your-super-session-secret'];
  const redisConfig = config.redis;
  if(app.store.client()){
    log.debug("middlewareInit use redis ", redisConfig);
    koaApp.use(convert(session({
      store: redisStore(app.store.client())
    })));
  } else {
    log.debug("middlewareInit memory session ");
    koaApp.use(convert(session()));
  }
}
