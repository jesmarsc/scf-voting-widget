import { h } from 'preact';
import useAuth from 'src/stores/useAuth';
import define from 'preact-custom-element';

import Container from 'src/components/elements/Container';

const ErrorBanner = () => {
  const { error, clearAuth } = useAuth();

  if (!error) return null;
  return (
    <Container danger onClick={() => clearAuth()}>
      {error}
    </Container>
  );
};

define(ErrorBanner, 'error-banner');
