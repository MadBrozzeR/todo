import { createComponent } from '../host';
import { Mode } from '../types';
import { Tabs } from './tabs';
import { AddForm } from './add-form';
import { Task } from '../features/tasks';
import { Modal } from './modal';
import { ListTitle } from './list-title';
import { TaskList } from './task-list';

const STYLES = {
  '.page': {
    maxWidth: '500px',
    margin: '0 auto',

    '.edit': {
      ' .tab-edit': {
        background:  '#338'
      },
      ' .add-form': {
        display: 'block'
      },
      ' .task-remove': {
        display: 'block'
      },
      ' .task-edit': {
        display: 'block'
      }
    },
    '.checklist': {
      ' .tab-checklist': {
        background: '#338'
      },
      ' .task-check': {
        display: 'block'
      },
      ' .task-list-clear': {
        display: 'none'
      }
    }
  },
};

export const Page = createComponent('div', function (page) {
  const { host } = this;

  host.styles.add('page', STYLES);

  let mode: Mode = 'checklist';

  page.params({ className: 'page ' + mode });

  function setMode (newMode: Mode) {
    page.node.classList.replace(mode, newMode);
    mode = newMode;
  };

  setMode(mode);

  this.dom(Tabs, { onClick: setMode });
  this.dom(AddForm, {
    onAdd(task: Task) {
      host.tasks.push(task);
    },
  });
  this.dom(ListTitle);
  this.dom(TaskList);
  this.dom(Modal);
});
