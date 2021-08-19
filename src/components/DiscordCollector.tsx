import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import define from 'preact-custom-element';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';

type Status = 'valid' | 'invalid' | 'loading';

const Container = styled('div')([
  tw`block py-2 px-4 font-bold font-sans rounded border-none cursor-pointer tracking-wide transition-colors text-white shadow-purple bg-stellar-purple`,
]);

const DiscordCollector = () => {
  const [status, setStatus] = useState<Status>('loading');
  const setDiscordToken = useAuth((state) => state.setDiscordToken);

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    const { state, access_token } = hash.split('&').reduce((acc: any, val) => {
      const [key, value] = val.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const redirectUrl = sessionStorage.getItem(state);
    sessionStorage.removeItem(state);

    if (redirectUrl && !!access_token) {
      setStatus('valid');
      setDiscordToken(access_token);
      window.location.replace(`${window.location.origin}${redirectUrl}`);
    } else {
      setStatus('invalid');
    }
  }, []);

  return (
    <Container>
      {
        {
          loading: 'Loading...',
          valid: 'Discord Connected!',
          invalid: 'Login rejected, please try again.',
        }[status]
      }
    </Container>
  );
};

define(DiscordCollector, 'discord-collector');