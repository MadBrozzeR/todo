import { createComponent } from '../host';
import { State } from 'mbr-state';
import { Task } from '../features/tasks';

const STYLES = {
  '.add-form': {
    display: 'none',
    marginTop: '15px'
  },
};

type Props = {
  onAdd: (task: Task) => void;
};

export const AddForm = createComponent('div', function (_, { onAdd }: Props) {
  this.host.styles.add('add-form', STYLES);

  this.params({ className: 'add-form' });
  const state = new State('');

  function addTask () {
    if (state.state) {
      var task = new Task(state.state);
      state.set('');
      onAdd(task);
    }
  }

  this.dom('input', function (input) {
    state.listen(function (value) {
      input.node.value = value;
    });

    input.params({
      placeholder: 'Item',
      onkeyup() {
        state.set(input.node.value);
      },
      onkeydown(event) {
        if (event.keyCode === 13) {
          addTask();
        }
      }
    });
  });

  this.dom('button').params({
    innerText: 'Add',
    onclick: addTask,
  });
});
/*
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
    */
