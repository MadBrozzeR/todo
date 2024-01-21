import { State } from 'mbr-state';
import { Component } from 'splux';
import { createComponent, Host } from '../host';
import { Cast } from '../types';

const STYLES = {
  '.long-button': {
    height: '30px',
    width: '100%'
  },
  '.curtain': {
    position: 'fixed',
    background: 'rgba(200, 200, 200, .7)',
    top: '30%',
    right: '30%',
    bottom: '70%',
    left: '30%',
    transition: 'all .3s',
    overflow: 'hidden',

    '.active': {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  '.modal': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '500px',
    maxWidth: '100%',
    height: '300px',
    margin: 'auto',
    background: '#115',
    padding: '30px 10px 10px',

    '-close': {
      position: 'absolute',
      top: 0,
      right: 0,
      cursor: 'pointer',

      ':before': {
        width: '30px',
        height: '30px',
        display: 'block',
        lineHeight: '30px',
        textAlign: 'center',
        fontSize: '26px',
        fontWeight: 900,
        content: '"⨉"'
      }
    }
  },
  '.menu-item': {
    margin: '3px 0',
    cursor: 'pointer',

    '-name': {
      display: 'inline-block',
      height: '30px',
      width: '100%',
      border: '1px solid white',
      lineHeight: '26px',
      padding: '2px 5px'
    },
    '-remove': {
      display: 'inline-block',
      marginLeft: '-30px',

      ':before': {
        width: '30px',
        height: '30px',
        display: 'block',
        lineHeight: '30px',
        textAlign: 'center',
        fontSize: '26px',
        fontWeight: 900,
        content: '"⨉"'
      }
    }
  },

  '@media (max-width: 500px)': {
    '.modal': {
      height: '100%',
    },
  },
};

const TaskList = createComponent('div', function () {
  const host = this.host;
  const state = new State('');
  let list = host.tasks.get();

  function submit () {
    if (state.state) {
      host.tasks.add(state.state);
      state.set('');
    }
  }

  this.dom('input', function (input) {
    state.listen(function (value) {
      input.node.value = value;
    });

    this.params({
      placeholder: 'list name',
      onkeydown: function (event) {
        if (event.keyCode === 13) {
          submit();
        }
      },
      onkeyup: function () {
        state.set(input.node.value);
      }
    });
  });
  this.dom('button').params({
    innerText: 'Add',
    onclick: submit,
  });

  const taskList = this.dom('div', function (taskList) {
    return {
      set(newList: string[]) {
        taskList.clear();

        for (let index = 0 ; index < newList.length ; ++index) {
          const key = newList[index];

          key && taskList.dom('div', function () {
            this.params({ className: 'menu-item' });

            this.dom('span').params({
              className: 'menu-item-name',
              innerText: key,
              onclick() {
                host.tasks.set(key);
                host.cast({ type: 'modal', data: 'close' });
              },
            });
            this.dom('span').params({
              className: 'menu-item-remove',
              onclick() {
                host.tasks.remove(key);
              }
            });
          });
        }
      },
    };
  });

  taskList.set(list);

  this.tuneIn(function (cast: Cast) {
    if (cast.type === 'tasksChange') {
      const newState = Object.keys(cast.data.boards);

      if (newState.join('|') !== list.join('|')) {
        taskList.set(newState);
        list = newState;
      }
    }
  });
});

const Prompt = createComponent('div', function (_, { query, action }: { query: string; action: () => void }) {
  const host = this.host;
  this.node.innerText = query;
  this.dom('button').params({
    innerText: 'I am sure',
    className: 'long-button',
    onclick() {
      action();
      host.cast({ type: 'modal', data: 'close' });
    },
  });
});

export const Modal = createComponent('div', function (modal) {
  const { host } = this;

  host.styles.add('modal', STYLES);

  this.params({ className: 'curtain' });

  function hideModal () {
    modal.node.classList.remove('active');
  }

  const modalIfc = this.dom('div', function () {
    this.params({ className: 'modal' });

    this.dom('div').params({ className: 'modal-close', onclick: hideModal });

    const contentIfc = this.dom('div', function (content) {
      return {
        set<E = void>(container: Component<'div', Host, void, E>, data: E) {
          content.clear();
          content.dom(container, data);
          modal.node.classList.add('active');
        }
      };
    });

    return contentIfc;
  });

  this.tuneIn(function (cast: Cast) {
    if (cast.type === 'modal') {
      switch (cast.data) {
        case 'taskList':
          modalIfc.set(TaskList, undefined);
          break;
        case 'close':
          hideModal();
          break;
      }
    } else if (cast.type === 'prompt') {
      modalIfc.set(Prompt, cast.data);
    }
  });
});
