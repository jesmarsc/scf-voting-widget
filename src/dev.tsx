import { h, render } from 'preact';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';
import App from './App';

/* Web Components */

const container = document.getElementById('container');
if (container) {
  render(<App />, container);
}
