import { h } from 'preact';
import { useState } from 'preact/hooks';
import define from 'preact-custom-element';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';
import { approveProject, unapproveProject } from 'src/utils/api';

const ButtonWrapper = styled(Button)(tw`min-width[20ch]`);

const VoteButton = ({ name, slug }: { name: string; slug: string }) => {
  const discordToken = useAuth((state) => state.discordToken);
  const { user, isApproved, addApprovedProject, removeApprovedProject } =
    useBallot();

  const [isLoading, setIsLoading] = useState(false);

  if (!discordToken || !user || user.voted) return null;

  const isSelected = isApproved(slug);

  const handleAddApprovedProject = async () => {
    setIsLoading(true);
    approveProject(slug, discordToken)
      .then(() => addApprovedProject(slug, name))
      .finally(() => setIsLoading(false));
  };

  const handleRemoveProject = async () => {
    setIsLoading(true);
    unapproveProject(slug, discordToken)
      .then(() => removeApprovedProject(slug))
      .finally(() => setIsLoading(false));
  };

  return (
    <ButtonWrapper
      danger={isSelected}
      isLoading={isLoading}
      loadingText={isSelected ? 'Removing' : 'Adding'}
      onClick={() =>
        isSelected ? handleRemoveProject() : handleAddApprovedProject()
      }
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </ButtonWrapper>
  );
};

define(VoteButton, 'vote-button');
