import { h } from 'preact';
import define from 'preact-custom-element';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';

const VoteButton = (item: { name: string; slug: string }) => {
  const discordToken = useAuth((state) => state.discordToken);
  const { ballotItems, toggleItem } = useBallot();

  if (!discordToken) return null;

  const { name, slug } = item;

  const isSelected =
    ballotItems.findIndex((ballotItem) => ballotItem.slug === slug) > -1;

  return (
    <Button danger={isSelected} onClick={() => toggleItem({ name, slug })}>
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </Button>
  );
};

define(VoteButton, 'vote-button');
