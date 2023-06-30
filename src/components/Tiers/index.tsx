import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';
import Button from 'src/components/Button';
import ConnectDiscord from '../Button/ConnectDiscord';
import useDeveloper from 'src/stores/useDeveloper';
import useWallet from 'src/utils/hooks/useWallet';
import SVGSpinner from 'src/components/icons/SVGSpinner';
import { claimTier, updateEmail, updatePublicKeys } from 'src/utils/api';
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

type CountryData = {
  name: string;
  alpha2Code: string;
};

type Country = {
  value: string;
  option: string;
};

const getAllCountries = async () => {
  return fetch('https://restcountries.com/v2/all')
    .then((response) => response.json())
    .then((data: CountryData[]) => {
      const countries: Country[] = data.map(({ name, alpha2Code }) => ({
        value: alpha2Code,
        option: name,
      }));

      return countries;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const userTypes = {
  id: 'user-type',
  title: "I'm a:",
  list: [
    { value: 'developer', option: 'Developer' },
    { value: 'entrepreneur', option: 'Entrepreneur' },
    { value: 'community-member', option: 'Community Member' },
  ],
};

const genderOptions = {
  id: 'gender',
  title: 'I identify as:**',
  list: [
    { value: 'non', option: 'Non-binary / non-gender conforming' },
    { value: 'male', option: 'Male' },
    { value: 'female', option: 'Female' },
  ],
};

const LocationSelect = ({
  onChange,
  defaultValue,
}: {
  onChange: (e: any) => void;
  defaultValue?: string;
}) => {
  const [location, setLocation] = useState({
    id: 'location',
    title: "I'm based in:**",
    list: [] as Country[],
  });

  const getCountries = async () => {
    const list = await getAllCountries();
    if (!list) return;
    setLocation(({ id, title }) => ({ id, title, list }));
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <Select
      defaultValue={defaultValue}
      {...location}
      onChange={onChange}
    ></Select>
  );
};

const Select = ({
  id,
  list,
  title,
  onChange,
  defaultValue,
}: {
  id: string;
  list: { option: string; value: string }[];
  title: string;
  onChange: (e: any) => void;
  defaultValue?: string;
}) => {
  return (
    <div tw="my-2">
      <label for={id} tw="block mb-2 text-sm font-medium text-gray-900">
        {title}
      </label>
      <select
        id={id}
        onChange={onChange}
        defaultValue={defaultValue}
        tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-stellar-purple focus:border-stellar-purple block w-full p-2.5 outline-0"
      >
        <option selected>Select one</option>
        {list.map(({ option, value }) => (
          <option value={value}>{option}</option>
        ))}
      </select>
    </div>
  );
};

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
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [email, setEmail] = useState(developer?.email);

  const [isLoadingRemove, setIsLoadingRemove] = useState<undefined | string>(
    undefined
  );
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingTier, setIsLoadingTier] = useState(false);

  const [userType, setUserType] = useState<undefined | string>(developer?.type);
  const [location, setLocation] = useState<undefined | string>(
    developer?.location
  );
  const [gender, setGender] = useState<undefined | string>(developer?.gender);

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

  const saveEmail = async (email: string) => {
    if (!discordToken) return;
    setIsLoadingEmail(true);
    await updateEmail(discordToken, email);
    await refreshDeveloper();
    setIsLoadingEmail(false);
  };

  const handleClaimTier = async () => {
    if (!discordToken || !userType || !location || !gender) return;
    setIsLoadingTier(true);
    await claimTier(discordToken, userType, location, gender);
    await refreshDeveloper();
    setIsLoadingTier(false);
  };

  const isValidSocialAccount = (type: string) =>
    type === 'github' || type === 'youtube' || type === 'twitter';

  const social = developer?.connections?.filter(
    ({ type, verified }) => isValidSocialAccount(type) && verified
  )[0];

  const claimed = !!developer && developer.tier > 0;
  const verifiedEmail =
    !!developer && !!developer.email && !!developer.verified;

  const hasOneStellarAccount = !!developer && developer.publicKeys.length > 0;

  const hasRequiredData =
    !!developer &&
    !!developer.type &&
    !!developer.location &&
    !!developer.gender &&
    verifiedEmail &&
    !!social &&
    hasOneStellarAccount;

  useEffect(() => {
    verifiedEmail && setEmail(developer.email);
  }, [verifiedEmail]);

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
          <br />
          <br />
          Claim the SCF Verified role on Discord by filling out the below:
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
                  defaultChecked={!!developer}
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
          {developer?.publicKeys.map((key) => (
            <p tw="flex justify-between items-center gap-2 my-2">
              <IoKey tw="text-gray-500" />
              <QuestKeyWrapper>
                <p>{key.slice(0, -3)}</p>
                <p>{key.slice(-3)}</p>
              </QuestKeyWrapper>
              {developer?.publicKeys.length > 1 && (
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

          <ListItem>
            <div tw="justify-between items-center flex gap-1">
              <Checkbox
                id="default-checkbox"
                type="checkbox"
                defaultChecked={verifiedEmail}
                readOnly={true}
                onClick={(e) => e.preventDefault()}
              />
              {verifiedEmail ? (
                <div tw="flex justify-between items-center flex-grow">
                  <p tw="pr-4 text-black">Email address:*</p>

                  <input
                    name="email"
                    tw="flex flex-grow text-base py-2 px-2 outline-stellar-purple border-stellar-purple [border-right: none] rounded-l"
                    value={email}
                    onChange={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      setIsValidEmail(
                        /(.+)@(.+){2,}\.(.+){2,}/.test(target.value)
                      );
                      setEmail(target.value);
                    }}
                  />
                  <Button
                    variant={'outline'}
                    color={theme`colors.stellar.purple`}
                    onClick={() => email && saveEmail(email)}
                    disabled={!email || !isValidEmail}
                    tw="shrink-0 [border-top-left-radius: 0] [border-bottom-left-radius: 0] w-24"
                  >
                    {isLoadingEmail ? <SVGSpinner /> : 'Update'}
                  </Button>
                </div>
              ) : (
                <div tw="flex justify-between items-center flex-grow">
                  <p>Verify your email address</p>
                </div>
              )}
            </div>
          </ListItem>

          <Select
            {...userTypes}
            onChange={(e) => {
              setUserType(
                e.target.value === 'Select one' ? undefined : e.target.value
              );
            }}
            defaultValue={developer?.type}
          ></Select>
          <LocationSelect
            onChange={(e) => {
              setLocation(
                e.target.value === 'Select one' ? undefined : e.target.value
              );
            }}
            defaultValue={developer?.location}
          />
          <Select
            {...genderOptions}
            onChange={(e) => {
              setGender(
                e.target.value === 'Select one' ? undefined : e.target.value
              );
            }}
            defaultValue={developer?.gender}
          ></Select>
          <Button
            color={theme`colors.stellar.purple`}
            onClick={() => handleClaimTier()}
            tw="shrink-0 mt-4"
            disabled={
              !verifiedEmail ||
              !hasOneStellarAccount ||
              !social ||
              !userType ||
              !location ||
              !gender
            }
          >
            {isLoadingTier ? (
              <SVGSpinner />
            ) : hasRequiredData ? (
              'You are a verified member!'
            ) : claimed ? (
              'Update'
            ) : (
              'Claim Role'
            )}
          </Button>
        </ol>
        <p tw="font-normal leading-6 p-0 m-0 text-black">
          * We will not reach out except for any necessary direct communication,
          and your email address will not be shared with anyone outside of the
          Stellar Development Foundation. <br /> <br /> ** We’re striving
          towards a diverse community across the globe and would love to know
          where our community is at! Your individual information will not be
          shared with anyone outside of the Stellar Development Foundation.
        </p>
      </Container>
    </div>
  );
};

export default Tiers;
