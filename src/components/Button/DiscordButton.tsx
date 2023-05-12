import { h } from 'preact';
import { theme } from 'twin.macro';

import { openDiscordAuth } from 'src/utils/discord';
import useAuth from 'src/stores/useAuth';

import Button, { WebComponentProps } from 'src/components/Button';
import useBallot from 'src/stores/useBallot';
import useBallotState from 'src/stores/useBallotState';

const DiscordButton = ({
  variant,
  activeColor,
  inactiveColor,
}: WebComponentProps) => {
  useBallotState();

  const { discordToken, cleanupAuth } = useAuth();
  const cleanupBallot = useBallot((state) => state.cleanupBallot);

  const handleLogout = () => {
    cleanupAuth();
    cleanupBallot();
  };

  return (
    <Button
      variant={variant || 'outline'}
      color={
        !!discordToken
          ? activeColor || theme`colors.stellar.purple`
          : inactiveColor || theme`colors.stellar.purple`
      }
      onClick={discordToken ? handleLogout : openDiscordAuth}
    >
      {discordToken ? 'Log out' : 'Log in'}
    </Button>
  );
};

export default DiscordButton;
