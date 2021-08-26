import { h } from 'preact';
import tw, { styled } from 'twin.macro';

export const Container = styled('div')([
  tw`block py-2 px-4 font-bold font-sans rounded border-none cursor-pointer tracking-wide transition-colors text-white shadow-salmon bg-stellar-salmon`,
]);