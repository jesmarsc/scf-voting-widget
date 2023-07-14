import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';

import useAuth from 'src/stores/useAuth';

import Button, { WebComponentProps } from 'src/components/Button';
import useBallotState from 'src/stores/useBallotState';

const ButtonWrapper = styled(Button)(tw`min-w-[12ch]`);

type Props = {
  id: string;
} & WebComponentProps;

const VoteButton = ({ id, ...restProps }: Props) => {
  const discordToken = useAuth((state) => state.discordToken);

  const {
    user,
    needsWork,
    isApproved,
    isUnapproved,
    addApprovedProject,
    removeApprovedProject,
    addUnapprovedProject,
    removeUnapprovedProject,
    addNeedsWorkProject,
    removeNeedsWorkProject,
  } = useBallotState();

  const [isLoadingApproved, setIsLoadingApproved] = useState(false);
  const [isLoadingUnapproved, setIsLoadingUnapproved] = useState(false);
  const [isLoadingNeedsWork, setIsLoadingNeedsWork] = useState(false);

  if (!discordToken || !user || user.voted) return null;

  const approved = isApproved(id);
  const needs = needsWork(id);
  const unapproved = isUnapproved(id);

  const handleAddApprovedProject = async () => {
    setIsLoadingApproved(true);

    addApprovedProject(id).finally(() => setIsLoadingApproved(false));
  };

  const handleRemoveProject = async () => {
    setIsLoadingApproved(true);

    removeApprovedProject(id).finally(() => setIsLoadingApproved(false));
  };

  const handleAddUnapprovedProject = async () => {
    setIsLoadingUnapproved(true);

    addUnapprovedProject(id).finally(() => setIsLoadingUnapproved(false));
  };

  const handleRemoveUnapprovedProject = async () => {
    setIsLoadingUnapproved(true);

    removeUnapprovedProject(id).finally(() => setIsLoadingUnapproved(false));
  };

  const handleAddNeedsWorkProject = async () => {
    setIsLoadingNeedsWork(true);

    addNeedsWorkProject(id).finally(() => setIsLoadingNeedsWork(false));
  };

  const handleRemoveNeedsWorkProject = async () => {
    setIsLoadingNeedsWork(true);

    removeNeedsWorkProject(id).finally(() => setIsLoadingNeedsWork(false));
  };

  return (
    <div tw="flex gap-2">
      <ButtonWrapper
        color={
          approved ? theme`colors.stellar.salmon` : theme`colors.stellar.purple`
        }
        isLoading={isLoadingApproved}
        loadingText={''}
        onClick={() =>
          approved ? handleRemoveProject() : handleAddApprovedProject()
        }
        {...restProps}
        disabled={
          needs || unapproved || isLoadingUnapproved || isLoadingNeedsWork
        }
      >
        {approved ? 'Remove' : '👍'}
      </ButtonWrapper>
      <ButtonWrapper
        color={
          unapproved
            ? theme`colors.stellar.salmon`
            : theme`colors.stellar.purple`
        }
        isLoading={isLoadingUnapproved}
        loadingText={''}
        onClick={() =>
          unapproved
            ? handleRemoveUnapprovedProject()
            : handleAddUnapprovedProject()
        }
        {...restProps}
        disabled={needs || approved || isLoadingApproved || isLoadingNeedsWork}
      >
        {unapproved ? 'Remove' : '👎'}
      </ButtonWrapper>
      <ButtonWrapper
        color={
          needs ? theme`colors.stellar.salmon` : theme`colors.stellar.yellow`
        }
        isLoading={isLoadingNeedsWork}
        loadingText={''}
        onClick={() =>
          needs ? handleRemoveNeedsWorkProject() : handleAddNeedsWorkProject()
        }
        {...restProps}
        disabled={
          approved || unapproved || isLoadingApproved || isLoadingUnapproved
        }
      >
        {needs ? 'Remove Needs Work' : 'Needs Work'}
      </ButtonWrapper>
    </div>
  );
};

export default VoteButton;
