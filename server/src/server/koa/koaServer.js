let config = require('config');
let Promise = require('bluebird');

import Koa from'koa';
// Router for koa v2
import Router from 'koa-66';

let log = require('logfilename')(__filename);

export default function(app) {
  let koaApp = new Koa();
  koaApp.experimental = true;

  let httpHandle;
  let rootRouter = new Router();
  let baseRouter = new Router();
  middlewareInit(app, koaApp, config);

  return {
    koa: koaApp,
    auth: require('./middleware/PassportMiddleware')(app, koaApp, config),
    baseRouter(){
      return baseRouter;
    },
    /**
     * 初始化路由表
     */
    mountRootRouter(){
      rootRouter.mount('/api/v1', baseRouter);
      koaApp.use(rootRouter.routes());
    },
    /**
     * 打印路由表
     */
    diplayRoutes(){
      rootRouter.stacks.forEach(function(stack){
        log.debug(`${stack.methods} : ${stack.path}`);
      });
    },
    /**
     * Start the express server
     */
    async start() {
      let configHttp = config.get('http');
      let port = process.env.PORT || configHttp.port;

      log.info('start koa on port %s', port);
      return new Promise(function(resolve) {
        httpHandle = koaApp.listen(port, function() {
          log.info('koa server started');
          resolve();
        });
      });
    },

    /**
     * Stop the express server
     */
    async stop () {
      log.info('stopping web server');
      if(!httpHandle){
        log.info('koa server is already stopped');
        return;
      }
      return new Promise(function(resolve) {
        httpHandle.close(function() {
          log.info('koa server is stopped');
          resolve();
        });
      });
    }
  };
};

function middlewareInit(app, koaApp, configParam) {
  log.debug("middlewareInit");

  // SessionMiddlware
  require('./middleware/SessionMiddlware')(app, koaApp, configParam);

  // a body parser for koa, base on co-body
  const bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());

  //LoggerMiddlware
  require('./middleware/LoggerMiddleware')(app, koaApp, configParam);

  //Serve static html files such as the generated api documentation.
  require('./middleware/StaticMiddleware')(app, koaApp, configParam);
}
