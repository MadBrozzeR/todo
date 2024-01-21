import { State } from 'mbr-state';
import type { Splux } from 'splux';
import type { Task } from '../features/tasks';
import { createComponent, Host } from '../host';
import { Cast, TaskState } from '../types';

const STYLES = {
  '.btn': {
    position: 'absolute',
    top: '2px',
    bottom: '2px',
    width: '30px',
    textAlign: 'center',
    display: 'none',
    overflow: 'hidden',

    ':before': {
      lineHeight: '28px',
      fontSize: '26px',
      fontWeight: 900
    }
  },
  '.task': {
    padding: '2px 33px',
    position: 'relative',
    border: '1px solid white',
    margin: '2px 0',

    '.done': {
      background: '#338'
    },
    '-list': {
      marginTop: '15px',
    },
    '-title': {
      height: '30px',
      lineHeight: '26px',
      display: 'inline-block',
      width: '100%',
      padding: '2px 5px'
    },
    '-check': {
      left: 0,

      ':before': {
        content: '"✓"'
      }
    },
    '-edit': {
      left: 0,

      ':before': {
        content: '"✎"',
        fontWeight: 300
      },
      '-apply': {
        left: 0,

        ':before': {
          content: '"✓"'
        }
      },
      '-cancel': {
        right: 0,

        ':before': {
          content: '"⨉"'
        }
      },
      '-input': {
        display: 'none'
      }
    },
    '-remove': {
      right: 0,
      transition: 'width .7s step-end',

      ':before': {
        content: '"⨉"'
      }
    },
    '.edit': {
      ' .task-edit': {
        display: 'none'
      },
      ' .task-remove': {
        width: 0,
        transition: 'all 0s'
      },
      ' .task-title': {
        display: 'none'
      },
      ' .task-edit-input': {
        display: 'inline-block'
      },
      ' .task-edit-apply': {
        display: 'block'
      },
      ' .task-edit-cancel': {
        display: 'block'
      }
    }
  },
};

type Params = {
  task: Task;
  onEdit: (element: TaskElement | null) => void;
};

type TaskElement = Splux<HTMLDivElement, Host>;

function getTasks (state: TaskState) {
  return state.current && state.boards[state.current] || [];
}

const TaskItem = createComponent('div', function (taskItem, { task, onEdit }: Params) {
  const host = this.host;
  const state = new State(task.title);

  this.params({ className: 'task' });
  task.done && taskItem.node.classList.add('done');
  this.dom('span').params({ className: 'btn task-check', onclick: function () {
    host.tasks.update(task, { done: !task.done });
  } });
  this.dom('span').params({ className: 'btn task-edit', onclick: function () {
    onEdit(taskItem);
    input.node.focus();
  } });
  this.dom('span').params({ innerText: task.title, className: 'task-title' });
  this.dom('span').params({ className: 'btn task-remove', onclick: function () {
    host.tasks.removeTask(task);
  } });
  this.dom('span').params({ className: 'btn task-edit-apply', onclick: function () {
    host.tasks.update(task, { title: state.state });
    onEdit(null);
  } });
  const input = this.dom('input', function (input) {
    state.listen(function (value) {
      input.node.value = value;
    });

    this.params({ className: 'task-edit-input', value: state.state, onkeyup: function () {
      state.set(input.node.value);
    } });
  });
  this.dom('span').params({ className: 'btn task-edit-cancel', onclick: function () {
    state.set(task.title);
    onEdit(null);
  } });
});

export const TaskList = createComponent('div', function (taskList) {
  const host = this.host;
  host.styles.add('task-list', STYLES);
  this.params({ className: 'task-list' });
  let beingEdited: TaskElement | null = null;

  function handleEdit (element: TaskElement | null) {
    if (beingEdited) {
      beingEdited.node.classList.remove('edit');
    }
    beingEdited = element;
    element && element.node.classList.add('edit');
  }

  let currentTasks: Task[] = [];

  function set (tasks: Task[]) {
    taskList.clear();

    for (let index = 0 ; index < tasks.length ; ++index) {
      const task = tasks[index];

      task && taskList.dom(TaskItem, { task: task, onEdit: handleEdit });
    }
  }

  this.tuneIn(function (cast: Cast) {
    if (cast.type === 'tasksChange') {
      const newTasks = getTasks(cast.data);

      if (newTasks && currentTasks !== newTasks) {
        set(newTasks);

        currentTasks = newTasks;
      }
    }
  });

  set(getTasks(host.tasks.getState()));
});

/*
    mbr.dom('div', page, function (list) {
      list.className = 'task-list';

      ifc.clearList = function () {
        list.innerHTML = '';
      }
      ifc.add = function (task) {
          input = mbr.dom('input', item, {
            className: 'task-edit-input',
            value: task.title
          });
          mbr.dom('span', item, {
            className: 'btn task-edit-cancel',
            onclick: function () {
              input.value = task.title;
              ifc.editItem();
            }
          });
        });
      }
    });
 */
