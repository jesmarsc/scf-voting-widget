import { h } from 'preact';
import tw, { theme, styled } from 'twin.macro';

import { openDiscordAuth } from 'src/utils/discord';
import useAuth from 'src/stores/useAuth';
import useError from 'src/stores/useError';

import Button, { WebComponentProps } from 'src/components/Button';
import { routes } from 'src/constants/routes';
import { mustJoinError } from 'src/constants/errors';

const ExternalLink = styled('a')(
  tw`flex items-center justify-center p-2 rounded text-center text-white bg-stellar-purple no-underline`
);

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

  if (error === mustJoinError) {
    return (
      <ExternalLink href={routes.DEV_DISCORD} target="_blank">
        Join Stellar Dev
      </ExternalLink>
    );
  }

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
      {discordToken ? 'Disconnect' : 'Connect'}
    </Button>
  );
};

export default ConnectDiscord;
