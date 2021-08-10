import { h } from 'preact';
import define from 'preact-custom-element';
import tw, { styled } from 'twin.macro';

import useBallot from '../stores/useBallot';

const Button = styled('button')([
  tw`block mt-2 py-4 px-8 uppercase text-white font-extrabold tracking-wide rounded-lg border-none cursor-pointer transition-colors shadow-md bg-blue-600`,
  (props) => props?.isSelected && tw`bg-pink-600`,
]);

const VoteButton = (item: { name: string; slug: string }) => {
  const { name, slug } = item;
  const ballotItems = useBallot((state) => state.ballotItems);

  const isSelected =
    ballotItems.findIndex((ballotItem) => ballotItem.slug === slug) > -1;

  return (
    <button
      //isSelected={isSelected}
      onClick={() => useBallot.getState().toggleItem({ name, slug })}
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </button>
  );
};

define(VoteButton, 'vote-button');
