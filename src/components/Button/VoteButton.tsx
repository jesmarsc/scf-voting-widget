import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button, { WebComponentProps } from 'src/components/Button';
import {
  approveProject,
  unapproveProject,
  needsWorkProject,
  removeNeedsWork,
} from 'src/utils/api';
import useBallotState from 'src/stores/useBallotState';

const ButtonWrapper = styled(Button)(tw`min-w-[12ch]`);

type Props = {
  slug: string;
} & WebComponentProps;

const VoteButton = ({ slug, ...restProps }: Props) => {
  useBallotState();
  const discordToken = useAuth((state) => state.discordToken);

  const {
    user,
    needsWork,
    isApproved,
    addApprovedProject,
    removeApprovedProject,
    addNeedsWorkProject,
    removeNeedsWorkProject,
  } = useBallot();

  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const [isLoadingNeedsWork, setIsLoadingNeedsWork] = useState(false);

  if (!discordToken || !user || user.voted) return null;

  const isSelected = isApproved(slug);
  const isNeutral = needsWork(slug);

  const handleAddApprovedProject = async () => {
    setIsLoadingVote(true);

    approveProject(slug, discordToken)
      .then(({ project }) => addApprovedProject(project))
      .finally(() => setIsLoadingVote(false));
  };

  const handleRemoveProject = async () => {
    setIsLoadingVote(true);

    unapproveProject(slug, discordToken)
      .then(() => removeApprovedProject(slug))
      .finally(() => setIsLoadingVote(false));
  };

  const handleAddNeedsWorkProject = async () => {
    setIsLoadingNeedsWork(true);

    needsWorkProject(slug, discordToken)
      .then(({ project }) => addNeedsWorkProject(project))
      .finally(() => setIsLoadingNeedsWork(false));
  };

  const handleRemoveNeedsWorkProject = async () => {
    setIsLoadingNeedsWork(true);

    removeNeedsWork(slug, discordToken)
      .then(() => removeNeedsWorkProject(slug))
      .finally(() => setIsLoadingNeedsWork(false));
  };

  return (
    <div tw="flex gap-2">
      <ButtonWrapper
        color={
          isSelected
            ? theme`colors.stellar.green`
            : theme`colors.stellar.purple`
        }
        disabledText="Exceeds Budget"
        isLoading={isLoadingVote}
        loadingText={isSelected ? 'Removing' : 'Adding'}
        onClick={() =>
          isSelected ? handleRemoveProject() : handleAddApprovedProject()
        }
        {...restProps}
        disabled={isNeutral}
      >
        {isSelected ? 'Remove Vote' : 'Add Vote'}
      </ButtonWrapper>
      <ButtonWrapper
        color={
          isNeutral
            ? theme`colors.stellar.salmon`
            : theme`colors.stellar.yellow`
        }
        isLoading={isLoadingNeedsWork}
        loadingText={isNeutral ? 'Removing' : 'Adding'}
        onClick={() =>
          isNeutral
            ? handleRemoveNeedsWorkProject()
            : handleAddNeedsWorkProject()
        }
        {...restProps}
        disabled={isSelected}
      >
        {isNeutral ? 'Remove Needs Work' : 'Needs Work'}
      </ButtonWrapper>
    </div>
  );
};

export default VoteButton;
