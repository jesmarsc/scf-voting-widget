import { h } from 'preact';
import define from 'preact-custom-element';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';
import { approveProject, unapproveProject } from 'src/utils/api';

const VoteButton = ({ name, slug }: { name: string; slug: string }) => {
  const discordToken = useAuth((state) => state.discordToken);
  const { user, isApproved, addApprovedProject, removeProject } = useBallot();

  if (!discordToken || !user) return null;

  const isSelected = isApproved(slug);

  const handleAddApprovedProject = async () => {
    addApprovedProject(slug, name);
    approveProject(slug, discordToken).catch(() => removeProject(slug));
  };

  const handleRemoveProject = async () => {
    removeProject(slug);
    unapproveProject(slug, discordToken).catch(() =>
      addApprovedProject(slug, name)
    );
  };

  return (
    <Button
      danger={isSelected}
      onClick={() =>
        isSelected ? handleRemoveProject() : handleAddApprovedProject()
      }
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </Button>
  );
};

define(VoteButton, 'vote-button');
