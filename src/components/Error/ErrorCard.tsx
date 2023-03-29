import { h } from 'preact';
import tw, { styled } from 'twin.macro';
import Button from 'src/components/Button';

const ErrorCard = ({ error, onClose, ...restProps }: ErrorCardProps) => {
  const errorString = JSON.stringify(error, null, 2);

  return (
    <div tw="flex flex-col gap-4" {...restProps}>
      <p tw="font-semibold uppercase">Error:</p>

      <CodeBlock
        tw="flex-1"
        dangerouslySetInnerHTML={{
          __html: errorString,
        }}
      />

      <Button tw="w-full shadow-none" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

interface ErrorCardProps {
  error: any;
  onClose?: () => void;
}

const CodeBlock = styled('pre')([
  tw`text-xs leading-6 p-2 rounded overflow-auto bg-gray-300 shadow`,
]);

export default ErrorCard;
