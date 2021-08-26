import { h } from 'preact';
import useAuth from 'src/stores/useAuth';
import define from 'preact-custom-element';
import { Container } from './elements/Container';

const ErrorBanner = () => {
  const { error } = useAuth();

  if (!error) return null;
  return <Container>{error}</Container>;
};


define(ErrorBanner, 'error-banner');
