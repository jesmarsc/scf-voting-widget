import { h } from 'preact';
import tw, { theme, styled } from 'twin.macro';

import { openDiscordAuth } from 'src/utils/discord';
import useAuth from 'src/stores/useAuth';
import useError from 'src/stores/useError';

import Button, { WebComponentProps } from 'src/components/Button';
import { IoLogoDiscord } from 'react-icons/io5';

const ConnectDiscord = ({
  variant,
  activeColor,
  inactiveColor,
}: WebComponentProps) => {
  const { discordToken, cleanupAuth } = useAuth();
  const { error } = useError();

  const handleLogout = () => {
    cleanupAuth();
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
      tw="shrink-0"
    >
      {discordToken ? 'Disconnect' : 'Connect'}{' '}
      <IoLogoDiscord tw="text-stellar-purple ml-2 text-lg" />
    </Button>
  );
};

export default ConnectDiscord;
