export const discordApiUrl = 'https://discord.com/api';
export const redirectUrl =
  process.env.NODE_ENV === 'development'
    ? window.location.origin
    : `${window.location.origin}/auth`;

export const discordAuthUrl = `${discordApiUrl}/oauth2/authorize?client_id=876286801944387605&redirect_uri=${encodeURIComponent(
  redirectUrl
)}&response_type=token&scope=identify%20email%20connections`;

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
  const url = new URL(discordAuthUrl);
  url.searchParams.set('state', state);

  sessionStorage.setItem(state, window.location.pathname);
  window.open(url.toString(), '_self');
};
