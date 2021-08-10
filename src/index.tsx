import { render, h } from 'preact';
import { setup } from 'goober';
setup(h);

import App from './components/App';
import './components/VoteButton';

const root = document.createElement('div');
root.setAttribute('id', 'react_root');
document.body.appendChild(root);

render(<App />, root);
