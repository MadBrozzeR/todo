import { Splux } from 'splux';
import { host } from './host';
import { Page } from './components/page';

const STYLES = {
  '*': {
    boxSizing: 'border-box'
  },
  'body': {
    background: '#004',
    color: 'white',
    margin: 0,
    padding: '5px'
  },
  'button': {
    border: '1px solid white',
    background: '#003',
    outline: 'none',
    color: 'white'
  },
  'input': {
    width: '100%',
    border: '1px solid white',
    background: '#226',
    height: '30px',
    padding: '2px 60px 2px 10px',
    color: 'white',
    outline: 'none',

    '+button': {
      height: '30px',
      width: '50px',
      marginLeft: '-50px'
    }
  },
};

Splux.start(function (body, head) {
  const host = this.host;

  head.dom(host.styles.target);

  host.styles.add('main', STYLES);

  host.tasks.attach(function (state) {
    body.broadcast({ type: 'tasksChange', data: state });
  });

  host.cast = function (cast) {
    body.broadcast(cast);
  };

  body.dom(Page);
}, host);
