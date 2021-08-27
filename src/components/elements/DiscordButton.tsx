import { h } from 'preact';
import define from 'preact-custom-element';
import { theme } from 'twin.macro';

import { openDiscordAuth } from 'src/utils/discord';
import useAuth from 'src/stores/useAuth';

import Button, { WebComponentProps } from 'src/components/elements/Button';
import useBallot from 'src/stores/useBallot';

const DiscordButton = ({
  variant,
  activeColor,
  inactiveColor,
}: WebComponentProps) => {
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

define(DiscordButton, 'discord-button');
