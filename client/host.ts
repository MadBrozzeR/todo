import { Styles } from 'mbr-style';
import { Splux } from 'splux';
import { taskState } from './features/boards';
import { Cast } from './types';

const host = {
  styles: Styles.create(),
  tasks: taskState('TASKS'),
  cast: function (_cast: Cast) {},
};

type Host = typeof host;

const createComponent = Splux.createComponent<typeof host>();

export { host, createComponent, Host };
