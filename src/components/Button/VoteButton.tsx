import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button, { WebComponentProps } from 'src/components/Button';
import { approveProject, unapproveProject } from 'src/utils/api';

const ButtonWrapper = styled(Button)(tw`min-w-[20ch]`);

type Props = {
  slug: string;
} & WebComponentProps;

const VoteButton = ({ slug, ...restProps }: Props) => {
  const discordToken = useAuth((state) => state.discordToken);

  const { user, isApproved, addApprovedProject, removeApprovedProject } =
    useBallot();

  const [isLoading, setIsLoading] = useState(false);

  if (!discordToken || !user || user.voted) return null;

  const isSelected = isApproved(slug);

  const handleAddApprovedProject = async () => {
    setIsLoading(true);

    approveProject(slug, discordToken)
      .then(({ project }) => addApprovedProject(project))
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
      color={
        isSelected ? theme`colors.stellar.green` : theme`colors.stellar.purple`
      }
      disabledText="Exceeds Budget"
      isLoading={isLoading}
      loadingText={isSelected ? 'Removing' : 'Adding'}
      onClick={() =>
        isSelected ? handleRemoveProject() : handleAddApprovedProject()
      }
      {...restProps}
    >
      {isSelected ? 'Remove Vote' : 'Add Vote'}
    </ButtonWrapper>
  );
};

export default VoteButton;
