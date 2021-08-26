import { h } from 'preact';
import define from 'preact-custom-element';
import tw, { styled } from 'twin.macro';

import Container from 'src/components/elements/Container';
import useError from 'src/stores/useError';
import SVGClose from 'src/assets/SVGClose';

const ErrorBanner = () => {
  const { error, clearError } = useError();

  if (!error) return null;
  return (
    <Container danger>
      {error}
      <CloseButton onClick={() => clearError()}>
        <SVGClose />
      </CloseButton>
    </Container>
  );
};

const CloseButton = styled('button')(
  tw`absolute top-1 right-1 flex items-center justify-center p-1 cursor-pointer rounded border-none text-white svg:(fill-current) bg-black bg-opacity-30`
);

define(ErrorBanner, 'error-banner');
