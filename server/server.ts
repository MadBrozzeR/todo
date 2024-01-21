import type { Request } from 'mbr-serv-request';

const STATIC_ROOT = __dirname + '/../../static/';
const MODULE_ROOT = __dirname + '/../../node_modules/';
const CLIENT_ROOT = __dirname + '/../client/';

const SRC_RE = /^\/src\/(.+)$/;

function getFavicon (this: Request) {
  this.send();
}

function get404 (this: Request) {
  this.status = 404;
  this.send('', 'html');
}

async function getJs (this: Request, [,path]: RegExpExecArray) {
  if (!path) {
    return get404.call(this);
  }

  try {
    const data = await this.getFile({ root: CLIENT_ROOT, file: path + '.js' });
    this.send(data, 'js');
  } catch (error) {
    console.log(error);
    get404.call(this);
  }
}

const router = {
  '/': STATIC_ROOT + 'index.html',
  '/favicon.ico': { GET: getFavicon },
  '/lib/splux.js': MODULE_ROOT + 'splux/index.js',
  '/lib/mbr-style.js': MODULE_ROOT + 'mbr-style/index.js',
  '/lib/mbr-state.js': MODULE_ROOT + 'mbr-state/index.js',

  default: get404
};

module.exports = function (request: Request) {
  request.match(SRC_RE, getJs) || request.route(router);
}
