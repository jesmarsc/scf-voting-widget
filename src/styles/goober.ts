import { h } from 'preact';
import { setup, glob } from 'goober';

setup(h);

glob`
:root {
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
  }`;
