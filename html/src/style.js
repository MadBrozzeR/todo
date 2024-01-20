var styles = {
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
  '.long-button': {
    height: '30px',
    width: '100%'
  },
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
  '.add-form': {
    display: 'none',
    marginTop: '15px'
  },
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

      '-clear': {
        textAlign: 'right',
        width: '60px'
      }
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
  }
};

styles['@media (max-width: 500px)'] = {
  '.modal': {
    height: '100%'
  }
}
