import { h } from 'preact';
import define from 'preact-custom-element';

import { openDiscordAuth } from 'src/utils/discord';
import useAuth from 'src/stores/useAuth';

import Button from 'src/components/elements/Button';

const DiscordButton = () => {
  const { discordToken, clearAuth } = useAuth();

  return (
    <Button
      danger={discordToken}
      onClick={discordToken ? clearAuth : openDiscordAuth}
    >
      {discordToken ? 'Logout' : 'Login'}
    </Button>
  );
};

define(DiscordButton, 'discord-button');
