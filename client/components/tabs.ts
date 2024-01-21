import { createComponent } from '../host';
import type { Mode } from '../types';

const STYLES = {
  '.tab': {
    display: 'inline-block',
    height: '30px',
    width: '100px',
    border: '1px solid white',
    borderBottom: 0,
    lineHeight: '24px',
    padding: '2px 5px',

    '-group': {
      borderBottom: '1px solid white'
    }
  },
  '.dropdown': {
    float: 'right',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 900,
    transform: 'rotate(90deg)',
    cursor: 'pointer',

    ':before': {
      lineHeight: '30px',
      content: '">"'
    }
  },
};

type Props = {
  onClick: (mode: Mode) => void;
};

export const Tabs = createComponent('div', function (_, { onClick }: Props) {
  const host = this.host;

  host.styles.add('tabs', STYLES);

  this.params({ className: 'tab-group' });

  this.dom('span').params({
    innerText: 'Checks',
    className: 'tab tab-checklist',
    onclick: function () {
      onClick('checklist');
    }
  });
  this.dom('span').params({
    innerText: 'Edit',
    className: 'tab tab-edit',
    onclick: function () {
      onClick('edit');
    }
  });
  this.dom('div').params({
    className: 'dropdown',
    onclick: function () {
      host.cast({ type: 'modal', data: 'taskList' });
    },
  });
});
