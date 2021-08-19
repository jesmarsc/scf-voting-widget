import { h } from 'preact';
import define from 'preact-custom-element';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';

const VoteButton = ({ name, slug }: { name: string; slug: string }) => {
  const discordToken = useAuth((state) => state.discordToken);
  const { includes, addApprovedProject, removeProject } = useBallot();

  if (!discordToken) return null;

  const isSelected = includes(slug);

  return (
    <Button
      danger={isSelected}
      onClick={() =>
        isSelected ? removeProject(slug) : addApprovedProject(slug, name)
      }
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </Button>
  );
};

define(VoteButton, 'vote-button');
