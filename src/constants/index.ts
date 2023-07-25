export const isDev = process.env.NODE_ENV === 'development';

// console.log(process.env.REACT_APP_ENVIRONMENT);

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';
const HORIZON_PUBLIC = 'https://horizon.stellar.org';

export const getSetup = (): {
  SCF_API: string;
  STELLAR_NETWORK: 'TESTNET' | 'PUBLIC';
  HORIZON_URL: typeof HORIZON_TESTNET | typeof HORIZON_PUBLIC;
} => {
  switch (process.env.REACT_APP_ENVIRONMENT) {
    case 'development':
      return {
        SCF_API: 'http://localhost:8787',
        STELLAR_NETWORK: 'TESTNET',
        HORIZON_URL: HORIZON_TESTNET,
      };
    case 'staging':
      return {
        SCF_API: 'https://scf-sanity-testnet.stellarcommunity.workers.dev',
        STELLAR_NETWORK: 'TESTNET',
        HORIZON_URL: HORIZON_TESTNET,
      };
    default:
      return {
        SCF_API: 'https://scf-sanity.stellarcommunity.workers.dev',
        STELLAR_NETWORK: 'PUBLIC',
        HORIZON_URL: HORIZON_PUBLIC,
      };
  }
};

export const SCF_API = getSetup().SCF_API;

export const DISCORD = 'https://discord.com/api';

export const DISCORD_REDIRECT = isDev
  ? window.location.origin
  : `${window.location.origin}/auth`;

const discordSearchParams = new URLSearchParams({
  client_id: '869940034428604476',
  redirect_uri: DISCORD_REDIRECT,
  response_type: 'token',
  scope: 'identify email connections',
}).toString();

export const DISCORD_AUTH = `${DISCORD}/oauth2/authorize?${discordSearchParams}`;

export const stellarNetwork = getSetup().STELLAR_NETWORK;

export const stellarExpertTxLink = (hash: string) =>
  `https://stellar.expert/explorer/${stellarNetwork.toLowerCase()}/tx/${hash}`;
