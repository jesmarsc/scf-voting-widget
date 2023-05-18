import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';
import Button from 'src/components/Button';
import ConnectDiscord from '../Button/ConnectDiscord';
import useDeveloper from 'src/stores/useDeveloper';
import useWallet from 'src/utils/hooks/useWallet';
import SVGSpinner from 'src/components/icons/SVGSpinner';
import { IoLogoGithub } from 'react-icons/io5';
import { getProofTxt, updatePublicKeys } from 'src/utils/api';
import { downloadTxt } from 'src/utils';
import { routes } from 'src/constants/routes';

const Container = styled('div')([
  tw`flex flex-col gap-4 p-8 font-bold font-sans rounded border-none tracking-wide transition-colors text-black shadow-purple mx-auto max-w-2xl min-w-min`,
  ({ danger }: { danger?: boolean }) =>
    danger ? tw`bg-stellar-salmon shadow-salmon` : '',
]);

const QuestKeyWrapper = styled('div')(
  tw`relative flex flex-1 min-w-0 [p]:first:(overflow-hidden overflow-ellipsis) px-5 text-sm`
);

const ExternalLink = styled('a')(
  tw`flex items-center justify-items-start p-2 rounded  text-stellar-purple no-underline w-full`
);

const SimpleLink = styled('a')(tw`mx-1 text-stellar-purple no-underline`);

const ListItem = styled('li')(tw`list-item py-2`);

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

  const github = developer?.connections.filter(
    ({ type, verified }) => type === 'github' && verified
  )[0];

  return (
    <div tw="h-screen flex flex-col items-center justify-center">
      <Container>
        <h1 tw="text-lg text-black font-bold text-center">
          Prove ownership of your Stellar Network knowledge
        </h1>
        <p tw="font-normal leading-6 p-0 m-0">
          With this verification tool, you and the rest of your dev team can now
          prove ownership of your knowledge of Stellar and Soroban by following
          the below four steps. Active on Discord and/or Github? Amazing! Got
          all
          <a href={routes.STELLAR_QUEST} target={'_blank'} tw="mx-1">
            SQ
          </a>
          and/or
          <a href={routes.FCAOOC} target={'_blank'} tw="mx-1">
            FCA00C
          </a>
          NFT badges? Five stars!
        </p>
        <ol tw="flex flex-col px-4 font-normal leading-6">
          <ListItem>
            <div tw="flex justify-between items-center gap-2">
              <div tw="justify-start gap-1 m-0">
                {developer ? (
                  <DeveloperHandle developer={developer} />
                ) : (
                  <p tw="p-0 m-0">
                    Join the
                    <SimpleLink href={routes.DEV_DISCORD} target={'_blank'}>
                      Stellar Developers Discord
                    </SimpleLink>
                    server and connect Discord.
                  </p>
                )}
              </div>
              <ConnectDiscord />
            </div>
          </ListItem>
          <ListItem>
            <div tw="flex justify-between items-center">
              {developer?.publicKeys && developer.publicKeys.length > 0 ? (
                'Connected Wallets'
              ) : (
                <p>
                  Connect the Albedo Wallet(s) you’ve used to collect badges in
                  <SimpleLink href={routes.STELLAR_QUEST} target={'_blank'}>
                    Stellar Quest
                  </SimpleLink>
                  and/or{' '}
                  <SimpleLink href={routes.FCAOOC} target={'_blank'}>
                    FCA00C
                  </SimpleLink>
                  .
                </p>
              )}
              <Button
                variant={'outline'}
                color={theme`colors.stellar.purple`}
                disabled={!developer}
                onClick={addPublicKey}
                tw="shrink-0"
              >
                {isLoadingAdd ? <SVGSpinner /> : 'Connect Albedo Wallet(s)'}
              </Button>
            </div>
          </ListItem>
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

          <ListItem>
            <div tw="flex justify-between items-center">
              {github ? (
                <div tw="flex items-center justify-between w-full">
                  Github Connected
                  <ExternalLink
                    tw="w-auto"
                    href={`https://github.com/${github?.name}`}
                    target="__blank"
                  >
                    <IoLogoGithub tw="mr-2 text-2xl" />
                    {github?.name}
                  </ExternalLink>
                </div>
              ) : (
                <p>
                  Connect your Github account to your Discord account (
                  <SimpleLink
                    href={
                      'https://support.discord.com/hc/en-us/articles/8063233404823-Connections-Linked-Roles-Community-Members#:~:text=You%20will%20be%20able%20to,details%2C%20for%20example%3A%20Steam.'
                    }
                    target={'_blank'}
                  >
                    instructions
                  </SimpleLink>
                  ).
                </p>
              )}
            </div>
          </ListItem>

          <ListItem>
            <div tw="justify-between items-center flex">
              <p tw="pr-4">
                Export this proof and upload it (along with those of other devs
                in your team) to the Proof-of-Knowledge field in your SCF
                submission form on{' '}
                <SimpleLink href={'http://submittable.com'} target={'_blank'}>
                  Submittable
                </SimpleLink>
                !
              </p>
              <Button
                variant={'outline'}
                color={theme`colors.stellar.purple`}
                onClick={exportProof}
                disabled={!developer || !developer?.publicKeys.length}
                tw="shrink-0"
              >
                {isLoadingExport ? <SVGSpinner /> : 'Download'}
              </Button>
            </div>
          </ListItem>
        </ol>
      </Container>
    </div>
  );
};

export default VerifyBadges;
