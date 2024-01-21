import { createComponent } from '../host';
import { Cast, TaskState } from '../types';

const STYLES = {
  '.counter': {
    width: '80px',
    whiteSpace: 'nowrap',

    '-row': {
      marginTop: '10px',
      fontSize: '20px',
      width: '100%',
      tableLayout: 'fixed'
    },
    '-title': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    '-clear_list': {
      textAlign: 'right',
      width: '60px'
    }
  },
};

function getTasks (taskState: TaskState) {
  return taskState.current && taskState.boards[taskState.current] || [];
}

export const ListTitle = createComponent('table', function () {
  const host = this.host;

  host.styles.add('list-title', STYLES);

  this.params({ className: 'counter-row' });
  let state: TaskState | null = null;

  this.dom('tr', function () {
    const counter = this.dom('td').params({ className: 'counter' });
    const title = this.dom('td').params({ className: 'counter-title' });
    this.dom('td').params({
      innerText: 'clear',
      className: 'counter-clear_list',
      onclick() {
        host.cast({ type: 'prompt', data: {
          query: 'Clear list? Are you sure?',
          action() {
            host.tasks.clearTasks();
          }
        } });
      }
    });

    function set(newState: TaskState) {
      title.node.innerText = newState.current || '';
      const tasks = getTasks(newState);

      if (!state || getTasks(state) !== tasks) {
        const total = tasks.length;
        let done = 0;

        for (let index = 0 ; index < total ; ++index) {
          if (tasks[index]?.done) {
            ++done;
          }
        }

        counter.node.innerText = done + ' / ' + total;
      }

      state = newState;
    }

    this.tuneIn(function (cast: Cast) {
      if (cast.type === 'tasksChange') {
        set(cast.data);
      }
    });

    set(host.tasks.getState());
  });
});

/*
    mbr.dom('table', page, function (table) {
      table.className = 'counter-row';
      mbr.dom('tr', table, function (row) {
        mbr.dom('td', row, function (counter) {
          counter.className = 'counter';
          var checked = 0;
          
          ifc.counter = {
            add: function () {
              ++checked;
            },
            sub: function () {
              --checked;
            },
            show: function () {
              counter.innerHTML = checked + ' / ' + tasks.length;
            },
            reset: function () {
              checked = 0;
            }
          };
        });
        var title = mbr.dom('td', row, {
          className: 'counter-title'
        });
        ifc.setTitle = function (titleName) {
          title.innerHTML = titleName;
        }
        var clearModalContent = mbr.dom('div', null, function (content) {
          content.innerHTML = 'Clear list? Are you sure?'
          mbr.dom('button', content, {
            innerHTML: 'I am sure',
            className: 'long-button',
            onclick: function () {
              tasks = [];
              save(taskLists.current, tasks);
              ifc.fillList(tasks);
              ifc.modalHide();
            }
          });
        });
        mbr.dom('td', row, {
          innerHTML: 'clear',
          className: 'task-list-clear',
          onclick: function () {
            ifc.modalShow(clearModalContent);
          }
        });
      });
    });
    */
