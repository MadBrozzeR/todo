function Task (title) {
  this.title = title;
  this.done = false;
}

var storagePrefix = 'TASKS:';

function save (name, tasks) {
  localStorage.setItem(storagePrefix + name, JSON.stringify(tasks));
}
function load (name) {
  var result = localStorage.getItem(storagePrefix + name);
  return result ? JSON.parse(result) : [];
}

mbr.win.onload(function (body, head) {
  mbr.styleSheet(styles, head);
  var ifc = {};

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
  var tasks;

  mbr.dom('div', body, function (page) {
    var pageCN = mbr.classname(page).set('page').switch('checklist');
    var beingEdited;
    ifc.editItem = function (itemCN) {
      beingEdited && beingEdited.del('edit');
      beingEdited = itemCN;
      itemCN && itemCN.add('edit');
    }

    mbr.dom('div', page, function (tabs) {
      tabs.className = 'tab-group';
      mbr.dom('span', tabs, {
        innerHTML: 'Checks',
        className: 'tab tab-checklist',
        onclick: function () {
          pageCN.switch('checklist');
          ifc.editItem();
        }
      });
      mbr.dom('span', tabs, {
        innerHTML: 'Edit',
        className: 'tab tab-edit',
        onclick: function () {
          pageCN.switch('edit')
        }
      });
      mbr.dom('div', tabs, {
        className: 'dropdown',
        onclick: function () {
          ifc.modalShow(taskLists.modal);
        }
      });
    });
    mbr.dom('div', page, function (formBlock) {
      formBlock.className = 'add-form';
      var field = mbr.dom('input', formBlock, {
        placeholder: 'Item'
      });
      function addTask () {
        if (field.value) {
          var task = new Task(field.value);
          field.value = '';
          tasks.push(task);
          save(taskLists.current, tasks);
          ifc.add(task);
          ifc.counter.show();
        }
      }
      mbr.dom('button', formBlock, {
        innerHTML: 'Add',
        onclick: addTask
      });
      formBlock.onkeydown = function (event) {
        if (event.keyCode === 13) {
          addTask();
        }
      };
    });
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
    mbr.dom('div', page, function (list) {
      list.className = 'task-list';

      ifc.clearList = function () {
        list.innerHTML = '';
      }
      ifc.add = function (task) {
        mbr.dom('div', list, function (item) {
          var input;
          var title;
          var itemCN = mbr.classname(item).set('task');
          task.done && itemCN.add('done');
          mbr.dom('span', item, {
            className: 'btn task-check',
            onclick: function () {
              task.done = !task.done;
              if (task.done) {
                itemCN.add('done');
                ifc.counter.add();
                ifc.counter.show();
              } else {
                itemCN.del('done');
                ifc.counter.sub();
                ifc.counter.show();
              }
              save(taskLists.current, tasks);
            }
          });
          mbr.dom('span', item, {
            className: 'btn task-edit',
            onclick: function () {
              ifc.editItem(itemCN);
              input.focus();
            }
          });
          title = mbr.dom('span', item, {
            className: 'task-title',
            innerHTML: task.title
          });
          mbr.dom('span', item, {
            className: 'btn task-remove',
            onclick: function () {
              list.removeChild(item);
              var index = tasks.indexOf(task);
              if (index > -1) {
                tasks.splice(index, 1);
                save(taskLists.current, tasks);
                ifc.counter.show();
              }
            }
          });
          mbr.dom('span', item, {
            className: 'btn task-edit-apply',
            onclick: function () {
              task.title = input.value;
              title.innerHTML = input.value;
              save(taskLists.current, tasks);
              ifc.editItem();
            }
          });
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
  });
  mbr.dom('div', body, function (curtain) {
    var curtainCN = mbr.classname(curtain).set('curtain');
    mbr.dom('div', curtain, function (modal) {
      modal.className = 'modal';
      ifc.modalHide = function () {
        curtainCN.del('active');
      }
      mbr.dom('div', modal, {
        className: 'modal-close',
        onclick: ifc.modalHide
      });
      mbr.dom('div', modal, function (contents) {
        ifc.modalShow = function (content) {
          contents.innerHTML = '';
          contents.appendChild(content);
          curtainCN.add('active');
        }
      });
    });
  });

  ifc.fillList = function (tasks) {
    ifc.clearList();
    ifc.counter.reset();
    for (var index = 0 ; index < tasks.length ; ++index) {
      ifc.add(tasks[index]);
      tasks[index].done && ifc.counter.add();
    }
    ifc.counter.show();
  }
  ifc.setList = function (name) {
    tasks = load(name);
    ifc.fillList(tasks);
    ifc.setTitle(name);
  }
  ifc.switchList = function (name) {
    taskLists.current = name;
    localStorage.setItem('TASKS.current', name);
    ifc.setList(name);
  };
  taskLists.current && ifc.setList(taskLists.current);
});
