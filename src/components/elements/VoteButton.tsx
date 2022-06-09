import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button, { WebComponentProps } from 'src/components/elements/Button';
import { approveProject, unapproveProject } from 'src/utils/api';

const ButtonWrapper = styled(Button)(tw`min-width[20ch]`);

type Props = {
  name: string;
  slug: string;
} & WebComponentProps;

const VoteButton = ({
  name,
  slug,
  variant,
  activeColor,
  inactiveColor,
}: Props) => {
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
      variant={variant}
      color={
        isSelected
          ? activeColor || theme`colors.stellar.green`
          : inactiveColor || theme`colors.stellar.purple`
      }
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

export default VoteButton;
