const fs = require('fs');

const root = __dirname + '/html';

function getIndex () {
  this.send(this.template({
    viewport: {
      width: 'device-width',
      initialScale: 1,
      scalable: false
    },
    title: 'ToDo List',
    scripts: ['src/mbr_script.js', 'src/style.js', 'src/main.js']
  }), 'html');
}

function getResource () {
  const request = this;
  fs.readFile(root + this.getPath(), function (err, data) {
    if (err) {
      console.log(err);
      request.status = 404;
      request.send('error');
    } else {
      request.status = 200;
      request.send(data, 'js');
    }
  });
}

function getFavicon () {
  this.send();
}

function get404 () {
  this.status = 404;
  this.send('', 'html');
}

const router = {
  '/': getIndex,
  '/favicon.ico': getFavicon,
  '/src/mbr_script.js': getResource,
  '/src/style.js': getResource,
  '/src/main.js': getResource,

  default: get404
};

module.exports = function (request) {
  request.route(router);
} 
