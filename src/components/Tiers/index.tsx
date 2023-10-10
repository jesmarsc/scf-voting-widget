import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';
import Button from 'src/components/Button';
import ConnectDiscord from '../Button/ConnectDiscord';
import useDeveloper from 'src/stores/useDeveloper';
import useWallet from 'src/utils/hooks/useWallet';
import SVGSpinner from 'src/components/icons/SVGSpinner';
import { claimTier, updatePublicKeys } from 'src/utils/api';
import { routes } from 'src/constants/routes';
import { IoKey } from 'react-icons/io5';

const Container = styled('div')([
  tw`flex flex-col overflow-y-scroll gap-4 p-8 font-bold font-sans rounded border-none tracking-wide transition-colors text-black shadow-purple mx-auto max-w-2xl min-w-min w-full`,
  ({ danger }: { danger?: boolean }) =>
    danger ? tw`bg-stellar-salmon shadow-salmon` : '',
]);

const QuestKeyWrapper = styled('div')(
  tw`relative flex flex-1 min-w-0 [p]:first:(overflow-hidden overflow-ellipsis) text-sm`
);

const ExternalLink = styled('a')(
  tw`flex items-center justify-items-start p-2 rounded  text-stellar-purple no-underline w-full`
);

const Checkbox = styled('input')(
  tw`w-4 h-4 mr-1 accent-stellar-purple disabled:accent-stellar-purple  text-stellar-purple rounded focus:ring-stellar-purple focus:ring-2`
);

const SimpleLink = styled('a')(tw`mx-1 text-stellar-purple no-underline`);

const ListItem = styled('li')(tw`py-2 [list-style: none]`);

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

const Tiers = () => {
  const { developer, discordToken, refreshDeveloper } = useDeveloper();
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);

  const [isLoadingRemove, setIsLoadingRemove] = useState<undefined | string>(
    undefined
  );
  const [isLoadingTier, setIsLoadingTier] = useState(false);

  const [submitMessage, setSubmitMessage] = useState<string>('Claim Role');

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

  const handleClaimTier = async () => {
    if (!discordToken) return;
    setIsLoadingTier(true);
    await claimTier(discordToken);
    await refreshDeveloper();
    setIsLoadingTier(false);
  };

  const isValidSocialAccount = (type: string) =>
    type === 'github' || type === 'youtube' || type === 'twitter';

  const social = developer?.connections?.filter(
    ({ type, verified }) => isValidSocialAccount(type) && verified
  )[0];

  const claimed = !!developer && developer.tier > -1;

  const hasOneStellarAccount =
    !!developer && developer?.public_keys?.length > 0;

  const hasRequiredData =
    !!developer &&
    !!developer.type &&
    !!developer.location &&
    !!developer.gender &&
    !!social &&
    hasOneStellarAccount;

  const disableClaim = !hasOneStellarAccount || !social || !location;

  useEffect(() => {
    if (claimed) {
      if (hasRequiredData) {
        setSubmitMessage('You are a verified member!');
      } else {
        setSubmitMessage('Update info (already verified)');
      }
    }
  }, [hasRequiredData, claimed]);

  return (
    <div tw="h-screen flex flex-col items-center justify-center">
      <Container>
        <h1 tw="text-lg text-black font-bold text-center">
          Get verified in the Stellar Community Fund (SCF)
        </h1>
        <p tw="font-normal leading-6 p-0 m-0 text-black">
          As your first entry into being SCF verified, get exclusive access to
          the #verified-members channel to keep up to date with SCF round,
          influence governance and structure updates, and more (coming soon).
          Before filling out this form, please register on{' '}
          <a href="https://dashboard.communityfund.stellar.org">
            dashboard.communityfund.stellar.org
          </a>{' '}
          first.
          <br />
          <br />
          Claim the SCF Verified or Pathfinder role* on Discord by filling out
          the below:
        </p>
        <ol tw="flex flex-col px-4 font-normal leading-6">
          <ListItem>
            <div tw="flex justify-between items-center gap-2">
              <div tw="justify-start flex items-center gap-1 m-0">
                <Checkbox
                  id="default-checkbox"
                  type="checkbox"
                  defaultChecked={!!developer}
                  readOnly={true}
                  onClick={(e) => e.preventDefault()}
                />
                {developer ? (
                  <DeveloperHandle developer={developer} />
                ) : (
                  <p tw="p-0 m-0">
                    Join the
                    <SimpleLink href={routes.DEV_DISCORD} target={'_blank'}>
                      Stellar Developers Discord
                    </SimpleLink>
                    server and connect your Discord account
                  </p>
                )}
              </div>
              <ConnectDiscord />
            </div>
          </ListItem>
          <ListItem>
            <div tw="flex justify-between items-center">
              <div tw="justify-start flex items-center gap-1 m-0">
                <Checkbox
                  id="default-checkbox"
                  type="checkbox"
                  defaultChecked={!!hasOneStellarAccount}
                  readOnly={true}
                  onClick={(e) => e.preventDefault()}
                />
                {hasOneStellarAccount ? (
                  'Connected Stellar Account'
                ) : (
                  <p>
                    Connect at least one Stellar wallet (ideally an Albedo
                    wallet you’ve used to acquire badges of Stellar and Soroban
                    Quest, FCA00C and/or RPCiege)
                  </p>
                )}
              </div>
              <Button
                variant={'outline'}
                color={theme`colors.stellar.purple`}
                disabled={!developer}
                onClick={addPublicKey}
                tw="shrink-0 ml-2"
              >
                {isLoadingAdd ? <SVGSpinner /> : 'Connect Albedo Wallet(s)'}
              </Button>
            </div>
          </ListItem>
          {developer?.public_keys?.map((key) => (
            <p tw="flex justify-between items-center gap-2 my-2">
              <IoKey tw="text-gray-500" />
              <QuestKeyWrapper>
                <p>{key.slice(0, -3)}</p>
                <p>{key.slice(-3)}</p>
              </QuestKeyWrapper>
              {developer?.public_keys?.length > 1 && (
                <Button
                  variant={'outline'}
                  color={theme`colors.stellar.salmon`}
                  onClick={() => removePublicKey(key)}
                >
                  {isLoadingRemove === key ? <SVGSpinner /> : 'Remove'}
                </Button>
              )}
            </p>
          ))}

          <ListItem>
            <div tw="flex justify-between items-center">
              <div tw="justify-start flex items-center gap-1 m-0">
                <Checkbox
                  id="default-checkbox"
                  type="checkbox"
                  defaultChecked={!!social}
                  readOnly={true}
                  onClick={(e) => e.preventDefault()}
                />
                {social ? (
                  <div tw="flex items-center justify-between w-full">
                    Social Account Connected ({social.type} - {social.name})
                  </div>
                ) : (
                  <p>
                    Connect one of the following to your Discord account: Github
                    (preferred), Twitter, or Youtube (
                    <SimpleLink
                      href={
                        'https://support.discord.com/hc/en-us/articles/8063233404823-Connections-Linked-Roles-Community-Members#:~:text=You%20will%20be%20able%20to,details%2C%20for%20example%3A%20Steam.'
                      }
                      target={'_blank'}
                    >
                      instructions
                    </SimpleLink>
                    )
                  </p>
                )}
              </div>
            </div>
          </ListItem>
          <Button
            color={theme`colors.stellar.purple`}
            onClick={() => handleClaimTier()}
            tw="shrink-0 mt-4"
            disabled={disableClaim}
          >
            {isLoadingTier ? <SVGSpinner /> : submitMessage}
          </Button>
        </ol>
        <p tw="font-normal leading-6 p-0 m-0 text-black">
          * Depending on the number of NFT badges your wallet(s) have of a
          particular educational program (including Stellar Quest), check out
          the{' '}
          <a href="https://stellar-development-foundation-1.gitbook.io/scf-handbook/community-involvement/governance/become-a-verified-member">
            SCF Handbook
          </a>{' '}
          for details.
        </p>
      </Container>
    </div>
  );
};

export default Tiers;
