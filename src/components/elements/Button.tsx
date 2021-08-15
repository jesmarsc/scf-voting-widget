import tw, { styled } from 'twin.macro';

const Button = styled('button')([
  tw`block py-2 px-4 font-bold rounded border-none cursor-pointer tracking-wide transition-colors text-white shadow-purple bg-stellar-purple`,
  ({ danger }: any) => danger && tw`shadow-salmon bg-stellar-salmon`,
]);

export default Button;
