import { ComponentChildren, h } from 'preact';
import { forwardRef } from 'preact/compat';
import tw, { styled } from 'twin.macro';

import SVGSpinner from 'src/components/icons/SVGSpinner';

export type Variant = 'primary' | 'outline';

export type WebComponentProps = {
  activeColor?: string;
  inactiveColor?: string;
  variant?: Variant;
};

type Props = {
  danger?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
  disabledText?: string;
  variant?: Variant;
  color?: string;
} & JSX.IntrinsicElements['button'];

const SCFButton = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    isLoading,
    loadingText,
    isDisabled,
    disabledText,
    disabled,
    ...restProps
  } = props;

  return (
    <Button
      {...restProps}
      disabled={isDisabled || isLoading || disabled}
      ref={ref}
    >
      {isLoading && <Spinner />}

      <Wrapper>
        {isLoading && loadingText
          ? loadingText
          : isDisabled && disabledText
          ? disabledText
          : props.children}
      </Wrapper>
    </Button>
  );
});

const Button = styled(
  'button',
  forwardRef
)([
  tw`flex items-center justify-center py-2 px-4 font-bold rounded cursor-pointer tracking-wide transition-all`,
  tw`border-none text-white shadow-purple border-stellar-purple bg-stellar-purple`,
  tw`disabled:(cursor-not-allowed [filter: grayscale(0.5)])`,
  ({ color }: Props) => {
    if (!color || !CSS.supports('color', color)) return '';

    return {
      boxShadow: `0px 8px 16px -8px ${color}`,
      borderColor: `${color}`,
      backgroundColor: `${color}`,
    };
  },
  ({ variant }: Props) => {
    switch (variant) {
      case 'outline':
        return tw`border-2 border-solid text-black shadow-none bg-white`;
      default:
        return '';
    }
  },
]);

const Spinner = styled(SVGSpinner)(tw`mr-2`);

const Wrapper = ({ children }: { children: ComponentChildren }) =>
  children ? (
    <span tw="flex items-center pointer-events-none">{children}</span>
  ) : null;

export default SCFButton;
