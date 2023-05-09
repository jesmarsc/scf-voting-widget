import { h, render } from 'preact';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';
import VerifyBadgesApp from './VerifyBadgesApp';

/* Web Components */

const container = document.getElementById('container');
if (container) {
  render(<VerifyBadgesApp />, container);
}
