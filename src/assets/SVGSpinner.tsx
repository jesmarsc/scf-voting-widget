import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { styled } from 'twin.macro';

const StyledSpinnerAlt = styled('i')`
  @keyframes spinneralt {
    0% {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  & {
    transform: scale(var(--ggs, 1));
  }
  &,
  &::before {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 1em;
    height: 1em;
  }
  &::before {
    content: '';
    position: absolute;
    border-radius: 100px;
    animation: spinneralt 1s cubic-bezier(0.6, 0, 0.4, 1) infinite;
    border: 3px solid transparent;
    border-top-color: currentColor;
  }
`;

const SpinnerAlt = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    return <StyledSpinnerAlt {...props} ref={ref} icon-role="spinner-alt" />;
  }
);

export default SpinnerAlt;
