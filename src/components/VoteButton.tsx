import { h } from 'preact';
import define from 'preact-custom-element';
import { css, theme } from 'twin.macro';

import useBallot from '../stores/useBallot';

const styles = ({ isSelected }: { isSelected: boolean }) => css`
  display: block;
  padding: 1rem 2rem;
  text-transform: uppercase;
  color: white;
  font-weight: 800;
  letter-spacing: 0.025em;
  border-radius: 0.5rem;
  border-style: none;
  cursor: pointer;
  transition: background-color 150ms linear;
  background-color: ${isSelected
    ? theme`colors.pink.600`
    : theme`colors.blue.600`};
`;

const VoteButton = (item: { name: string; slug: string }) => {
  const { name, slug } = item;
  const ballotItems = useBallot((state) => state.ballotItems);

  const isSelected =
    ballotItems.findIndex((ballotItem) => ballotItem.slug === slug) > -1;

  return (
    <button
      class={styles({ isSelected })}
      onClick={() => useBallot.getState().toggleItem({ name, slug })}
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </button>
  );
};

define(VoteButton, 'vote-button');
