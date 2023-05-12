import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';
import Button from 'src/components/Button';
import ConnectDiscord from '../Button/ConnectDiscord';
import useDeveloper from 'src/stores/useDeveloper';
import useWallet from 'src/utils/hooks/useWallet';
import SVGSpinner from 'src/components/icons/SVGSpinner';

import { getProofTxt, updatePublicKeys } from 'src/utils/api';
import { downloadTxt } from 'src/utils';

const Container = styled('div')([
  tw`flex flex-col gap-4 p-8 font-bold font-sans rounded border-none tracking-wide transition-colors text-black shadow-purple mx-auto max-w-2xl`,
  ({ danger }: { danger?: boolean }) =>
    danger ? tw`bg-stellar-salmon shadow-salmon` : '',
]);

const QuestKeyWrapper = styled('div')(
  tw`relative flex flex-1 min-w-0 [p]:first:(overflow-hidden overflow-ellipsis) px-5 text-sm`
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
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState<undefined | string>(
    undefined
  );
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  const { wallet } = useWallet('albedo');

  const addPublicKey = async () => {
    if (!discordToken) return;
    setIsLoadingAdd(true);
    console.log('adding wallet');
    const signedMessage = await wallet.signMessage();
    await updatePublicKeys(discordToken, signedMessage);
    await refreshDeveloper();
    setIsLoadingAdd(false);
  };

  const removePublicKey = async (pk: string) => {
    if (!discordToken) return;
    setIsLoadingRemove(pk);
    console.log('adding wallet');
    await updatePublicKeys(discordToken, { pk: pk });
    await refreshDeveloper();
    setIsLoadingRemove(undefined);
  };

  const exportProof = async () => {
    if (!discordToken) return;
    setIsLoadingExport(true);
    console.log('adding wallet');
    const { proofs } = await getProofTxt(discordToken);
    for (const { txt, pk } of proofs) {
      downloadTxt(txt, `${pk}.txt`);
    }

    setIsLoadingExport(false);
  };

  return (
    <div tw="h-screen flex flex-col items-center justify-center">
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
          2.{' '}
          {developer?.publicKeys && developer.publicKeys.length > 0
            ? 'Connected Public Keys'
            : 'Connect Wallet'}
          <Button
            variant={'outline'}
            color={theme`colors.stellar.purple`}
            onClick={addPublicKey}
          >
            {isLoadingAdd ? <SVGSpinner /> : 'Add Public Key'}
          </Button>
        </p>
        {developer?.publicKeys.map((key) => (
          <p tw="flex justify-between items-center">
            <QuestKeyWrapper>
              <p>{key.slice(0, -3)}</p>
              <p>{key.slice(-3)}</p>
            </QuestKeyWrapper>
            <Button
              variant={'outline'}
              color={theme`colors.stellar.salmon`}
              onClick={() => removePublicKey(key)}
            >
              {isLoadingRemove === key ? <SVGSpinner /> : 'Remove'}
            </Button>
          </p>
        ))}

        <p tw="flex justify-between items-center">
          3. Export Proof
          <Button
            variant={'outline'}
            color={theme`colors.stellar.purple`}
            onClick={exportProof}
          >
            {isLoadingExport ? <SVGSpinner /> : 'Download'}
          </Button>
        </p>
      </Container>
    </div>
  );
};

export default VerifyBadges;
