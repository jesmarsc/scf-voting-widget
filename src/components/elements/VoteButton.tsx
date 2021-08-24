import { h } from 'preact';
import define from 'preact-custom-element';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';
import { approveProject, unapproveProject } from 'src/stores/api';

const VoteButton = ({ name, slug }: { name: string; slug: string }) => {
  const discordToken = useAuth((state) => state.discordToken);
  const { includes, addApprovedProject, removeProject } = useBallot();

  if (!discordToken) return null;

  const isSelected = includes(slug);

  const handleAddApprovedProject = async() => {
    addApprovedProject(slug, name);
    const res = await approveProject(slug);
    if (!res.id){
      removeProject(slug)
    }
  }

  const handleRemoveProject = async() => {
    removeProject(slug);
    const res = await unapproveProject(slug);
    if (!res.id){
      removeProject(slug)
    }
  }

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
