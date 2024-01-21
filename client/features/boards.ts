import { State } from 'mbr-state';
import { TaskState } from '../types';
import { Task } from './tasks';

export const taskState = function (localStorageKey: string) {
  const state = new State<TaskState>({
    current: null,
    boards: {},
  }, { localStorageKey: localStorageKey });

  return {
    get: function () {
      return Object.keys(state.state.boards);
    },
    add: function (key: string) {
      state.assign({
        boards: {
          ...state.state.boards,
          [key]: [],
        }
      });
    },
    remove: function (key: string) {
      if (!(key in state.state.boards)) {
        return;
      }

      const newState = { ...state.state.boards };
      delete newState[key];

      state.assign({ boards: newState });
    },
    set: function (key: string) {
      if (key === state.state.current) {
        return;
      }

      state.assign({ current: key });
    },

    push: function (task: Task) {
      if (state.state.current) {
        const current = state.state.boards[state.state.current];

        current && state.assign({
          boards: {
            ...state.state.boards,
            [state.state.current]: [ ...current, task ],
          }
        });
      }
    },
    clearTasks: function () {
      if (state.state.current) {
        state.assign({
          boards: {
            ...state.state.boards,
            [state.state.current]: [],
          }
        });
      }
    },
    update: function (task: Task, data: Partial<Task>) {
      if (state.state.current) {
        const tasks = state.state.boards[state.state.current];
        const index = tasks ? tasks.indexOf(task) : -1;

        if (tasks && index > -1) {
          const updated = [...tasks];
          updated[index] = { ...task, ...data };

          state.assign({
            boards: {
              ...state.state.boards,
              [state.state.current]: updated,
            }
          });
        }
      }
    },
    removeTask: function (task: Task) {
      if (state.state.current) {
        const tasks = state.state.boards[state.state.current];
        const index = tasks ? tasks.indexOf(task) : -1;

        if (tasks && index > -1) {
          const updated = [...tasks];
          updated.splice(index, 1);

          state.assign({
            boards: {
              ...state.state.boards,
              [state.state.current]: updated,
            }
          });
        }
      }
    },

    getState: function () {
      return state.state;
    },

    attach: function (callback: (current: TaskState) => void) {
      state.listen(callback);
    },
  };
}

/*
var taskLists = {
  list: [],
  current: null,
  modal: mbr.dom('div', null, function (modal) {
    var input;
    function submit () {
      if (input.value) {
        taskLists.add(input.value);
        input.value = '';
      }
    }
    input = mbr.dom('input', modal, {
      placeholder: 'list name',
      onkeydown: function (event) {
        if (event.keyCode === 13) {
          submit();
        }
      }
    });
    mbr.dom('button', modal, {
      innerHTML: 'add',
      onclick: submit
    });
  }),
  get: function () {
    var list = localStorage.getItem('TASKS');
    if (list) {
      this.list = JSON.parse(list);
    } else {
      localStorage.setItem('TASKS', '[]');
      this.list = [];
    }
    return this.list;
  },
  add: function (key) {
    this.list.push(key);
    save(key, []);
    localStorage.setItem('TASKS', JSON.stringify(this.list));
    this.append(key);
  },
  remove: function (key) {
    var index = this.list.indexOf(key);
    if (index > -1) {
      this.list.splice(index, 1);
      localStorage.setItem('TASKS', JSON.stringify(this.list));
      localStorage.removeItem(storagePrefix + key);
    }
  },
  append: function (key) {
    var modal = this.modal;
    mbr.dom('div', modal, function (item) {
      item.className = 'menu-item',
      mbr.dom('span', item, {
        className: 'menu-item-name',
        innerHTML: key,
        onclick: function () {
          ifc.switchList(key);
          ifc.modalHide();
        }
      });
      mbr.dom('span', item, {
        className: 'menu-item-remove',
        onclick: function () {
          taskLists.remove(key);
          modal.removeChild(item);
        }
      });
    });
  },
  init: function () {
    taskLists.get();
    for (var index = 0 ; index < taskLists.list.length ; ++index) {
      taskLists.append(taskLists.list[index]);
    }
    this.current = localStorage.getItem('TASKS.current') || taskLists.list[0] || null;
  }
};
taskLists.init();
*/
