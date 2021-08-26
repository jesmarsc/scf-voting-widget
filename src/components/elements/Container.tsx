import tw, { styled } from 'twin.macro';

const Container = styled('div')([
  tw`block relative py-2 px-4 font-bold font-sans rounded border-none tracking-wide transition-colors text-white shadow-purple bg-stellar-purple`,
  ({ danger }: { danger?: boolean }) =>
    danger ? tw`bg-stellar-salmon shadow-salmon` : '',
]);

export default Container;
