import { DISCORD_AUTH } from 'src/constants';

export const randomString = (length: number) => {
  let charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
  let result = '';

  while (length > 0) {
    let bytes = new Uint8Array(16);
    let random = window.crypto.getRandomValues(bytes);

    random.forEach((c) => {
      if (length == 0) {
        return;
      }
      if (c < charset.length) {
        result += charset[c];
        length--;
      }
    });
  }

  return result;
};

export const openDiscordAuth = () => {
  const state = randomString(32);
  const url = new URL(DISCORD_AUTH);
  url.searchParams.set('state', state);

  sessionStorage.setItem(state, window.location.pathname);
  window.open(url.toString(), '_self');
};
