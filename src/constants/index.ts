// export const isDev = process.env.NODE_ENV === 'development';
export const isDev = true;

// use http://localhost:8787 for local development
export const SCF_API = isDev
  ? 'http://scf-voting-dev.stellarcommunity.workers.dev'
  : 'https://scf-voting.stellarcommunity.workers.dev';

export const DISCORD = 'https://discord.com/api';

// export const DISCORD_REDIRECT = isDev
//   ? window.location.origin
//   : `${window.location.origin}/auth`;

export const DISCORD_REDIRECT = `${window.location.origin}/auth`;

const discordSearchParams = new URLSearchParams({
  client_id: '869940034428604476',
  redirect_uri: DISCORD_REDIRECT,
  response_type: 'token',
  scope: 'identify email connections',
}).toString();

export const DISCORD_AUTH = `${DISCORD}/oauth2/authorize?${discordSearchParams}`;

export const stellarNetwork = isDev ? 'TESTNET' : 'PUBLIC';
