import { h, FunctionComponent, VNode } from 'preact';
import React, { forwardRef } from 'preact/compat';
import tw, { styled } from 'twin.macro';

import SVGSpinner from 'src/assets/SVGSpinner';

type Props = {
  danger?: boolean;
  isLoading?: boolean;
  loadingText?: string;
} & JSX.IntrinsicElements['button'];

const SCFButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { isLoading, loadingText, disabled, ...restProps } = props;

  return (
    <Button
      {...restProps}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      ref={ref}
    >
      {isLoading && <Spinner />}
      {isLoading && loadingText ? loadingText : props.children}
    </Button>
  );
});

const Button = styled(
  'button',
  forwardRef
)([
  tw`flex items-center justify-center py-2 px-4 font-bold rounded border-none cursor-pointer tracking-wide transition-all text-white shadow-purple bg-stellar-purple`,
  tw`disabled:(cursor-not-allowed filter[grayscale(0.5)])`,
  ({ danger }: Props) => (danger ? tw`shadow-salmon bg-stellar-salmon` : ''),
]);

const Spinner = styled(SVGSpinner)(tw`mr-2`);

export default SCFButton;
