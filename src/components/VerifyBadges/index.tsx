import { h } from 'preact';
import tw, { styled, theme } from 'twin.macro';
import Button from 'src/components/Button';
import ConnectDiscord from '../Button/ConnectDiscord';
import useDeveloper from 'src/stores/useDeveloper';
import useWallet from 'src/utils/hooks/useWallet';
import { updatePublicKeys } from 'src/utils/api';

const Container = styled('div')([
  tw`block relative py-2 px-4 font-bold font-sans rounded border-none tracking-wide transition-colors text-black shadow-purple mx-auto max-w-2xl`,
  ({ danger }: { danger?: boolean }) =>
    danger ? tw`bg-stellar-salmon shadow-salmon` : '',
]);

const ExternalLink = styled('a')(
  tw`flex items-center justify-center px-2 py-1.5 rounded text-center border-2 border-solid border-stellar-purple no-underline text-sm`
);

const DeveloperHandle = ({ developer }: { developer: Developer }) => {
  return (
    <div tw="flex text-left w-auto">
      Connected as
      <span tw="text-stellar-purple mx-1">
        {developer.username}#{developer.discriminator}
      </span>
    </div>
  );
};

const VerifyBadges = () => {
  const { developer, discordToken, refreshDeveloper } = useDeveloper();
  const { wallet } = useWallet('albedo');

  const addPublicKey = async () => {
    if (!discordToken) return;
    console.log('adding wallet');
    const signedMessage = await wallet.signMessage();
    await updatePublicKeys(discordToken, signedMessage);
    refreshDeveloper();
  };

  const removePublicKey = async (pk: string) => {
    if (!discordToken) return;
    console.log('adding wallet');
    await updatePublicKeys(discordToken, { pk: pk });
    refreshDeveloper();
  };

  return (
    <Container>
      <h1 tw="text-lg text-black font-bold text-center">
        Prove ownership of your Stellar Network knowledge
      </h1>
      <div tw="flex justify-between items-center">
        <p tw="flex gap-1">
          {'1. '}
          {developer ? (
            <DeveloperHandle developer={developer} />
          ) : (
            'Connect Discord'
          )}
        </p>
        <ConnectDiscord />
      </div>
      <p tw="flex justify-between items-center">
        2. Connect Wallets
        <Button
          variant={'outline'}
          color={theme`colors.stellar.purple`}
          onClick={addPublicKey}
        >
          {'Add Wallet'}
        </Button>
      </p>
      {developer?.publicKeys.map((key) => (
        <p tw="flex justify-between items-center">
          {key}
          <Button
            variant={'outline'}
            color={theme`colors.stellar.purple`}
            onClick={() => removePublicKey(key)}
          >
            {'Remove'}
          </Button>
        </p>
      ))}

      <p tw="flex justify-between items-center">
        3. Export Proof
        <Button variant={'outline'} color={theme`colors.stellar.purple`}>
          {'Download File'}
        </Button>
      </p>
      <p tw="flex justify-between items-center">
        4. Upload file on Submittable
        <ExternalLink>{'Go to Submittable'}</ExternalLink>
      </p>
    </Container>
  );
};

export default VerifyBadges;
