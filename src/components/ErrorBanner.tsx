import { h } from 'preact';
import tw, { styled } from 'twin.macro';

import Container from 'src/components/elements/Container';
import useError from 'src/stores/useError';

import { IoClose } from 'react-icons/io5';

const ErrorBanner = () => {
  const { error, cleanupError } = useError();
  if (!error) return null;

  return (
    <Container danger>
      {error}
      <CloseButton title="Close" onClick={() => cleanupError()}>
        <IoClose />
      </CloseButton>
    </Container>
  );
};

const CloseButton = styled('button')(
  tw`absolute top-1 right-1 flex items-center justify-center p-1 cursor-pointer rounded border-none text-white svg:(fill-current) bg-black bg-opacity-30`
);

export default ErrorBanner;
