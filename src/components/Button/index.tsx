import { ComponentChildren, h, FunctionComponent } from 'preact';
import tw, { styled } from 'twin.macro';

import SVGSpinner from 'src/components/icons/SVGSpinner';

const Button: FunctionComponent<ButtonProps> = (props) => {
  const { disabledText, isDisabled, isLoading, loadingText, ...restProps } =
    props;

  return (
    <ButtonContainer disabled={isDisabled || isLoading} {...restProps}>
      {isLoading && <Spinner />}

      <Wrapper>
        {isLoading && loadingText
          ? loadingText
          : isDisabled && disabledText
          ? disabledText
          : props.children}
      </Wrapper>
    </ButtonContainer>
  );
};

export type Variant = 'primary' | 'outline';

export interface WebComponentProps {
  activeColor?: string;
  inactiveColor?: string;
  variant?: Variant;
}

type HTMLButtonProps = JSX.IntrinsicElements['button'];

export interface ButtonProps extends HTMLButtonProps {
  color?: string;
  disabledText?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  variant?: Variant;
}

const ButtonContainer = styled<ButtonProps>('button')([
  tw`flex items-center justify-center py-2 px-4 font-bold rounded cursor-pointer tracking-wide transition-all [min-height: 2.75rem]`,
  tw`border-none text-white shadow-purple border-stellar-purple bg-stellar-purple`,
  tw`disabled:(cursor-not-allowed [filter: grayscale(0.5)])`,
  ({ color }) => {
    if (!color || !CSS.supports('color', color)) return '';

    return {
      boxShadow: `0px 8px 16px -8px ${color}`,
      borderColor: `${color}`,
      backgroundColor: `${color}`,
    };
  },
  ({ variant }) => {
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

export default Button;
