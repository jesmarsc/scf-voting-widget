import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import useAuth from 'src/stores/useAuth';
import Container from 'src/components/Container';

type Status = 'valid' | 'invalid' | 'loading';

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
    <Container danger={status === 'invalid'}>
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

export default DiscordCollector;
