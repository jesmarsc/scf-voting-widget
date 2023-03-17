export const isDev = process.env.NODE_ENV === 'development';

export const stellarNetwork = isDev ? 'TESTNET' : 'PUBLIC';
