// static file serving middleware
const serve = require('koa-static');
// convert koa legacy ( v0.x & v1.x ) generator middleware to promise middleware ( v2.x )
const convert = require('koa-convert');
let log = require('logfilename')(__filename);

export default function (app, koaApp, config){
  const {serveStaticFiles} = config;
  if(!serveStaticFiles){
    return;
  }

  log.info("serve static files")
  koaApp.use(convert(serve('build')));
}
