import { render, h } from 'preact';
import App from './components/App';
import './components/VoteButton';

import { setup } from 'goober';
setup(h);

const root = document.createElement('div');
root.setAttribute('id', 'react_root');
document.body.appendChild(root);

render(<App />, root);
