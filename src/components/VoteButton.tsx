import { h } from 'preact';
import define from 'preact-custom-element';
import { css, theme } from 'twin.macro';

import useBallot from '../stores/useBallot';

const styles = ({ isSelected }: { isSelected: boolean }) => css`
  display: block;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  letter-spacing: 0.025em;
  border-radius: 0.25rem;
  border-style: none;
  cursor: pointer;
  transition: background-color 150ms linear;
  font-family: 'IBM Plex Sans', sans-serif;
  box-shadow: ${isSelected ? theme`boxShadow.salmon` : theme`boxShadow.purple`};
  background-color: ${isSelected
    ? theme`colors.stellar.salmon`
    : theme`colors.stellar.purple`};
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
