export const isDev = process.env.NODE_ENV === 'development';

// use http://localhost:8787 for local development
export const SCF_API = isDev
  ? 'http://localhost:8787'
  : 'https://scf-voting-dev.stellarcommunity.workers.dev';

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

export const stellarNetwork = !isDev ? 'TESTNET' : 'PUBLIC';

export const stellarExpertTxLink = (hash: string) =>
  `https://stellar.expert/explorer/${stellarNetwork.toLowerCase()}/tx/${hash}`;
