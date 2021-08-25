export const apiUrl =
  'https://wrangler-scf-voting.stellarcommunity.workers.dev';

export async function handleResponse(response: Response) {
  const { headers, ok } = response;
  const contentType = headers.get('content-type');

  const content = contentType
    ? contentType.includes('json')
      ? response.json()
      : response.text()
    : { status: response.status, message: response.statusText };

  if (ok) return content;
  else throw await content;
}

export const getUser = async (discordToken: string) => {
  return await fetch(`${apiUrl}/auth`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getProjects = async (discordToken: string) => {
  return await fetch(`${apiUrl}/projects`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getPanelists = async (discordToken: string) => {
  return await fetch(`${apiUrl}/panelists`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const approveProject = async (slug: string, discordToken: string) => {
  return await fetch(`${apiUrl}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      slug: slug,
    }),
  }).then(handleResponse);
};

export const unapproveProject = async (slug: string, discordToken: string) => {
  return await fetch(`${apiUrl}/unapprove`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      slug: slug,
    }),
  }).then(handleResponse);
};

export const submitFavorites = async (
  slugs: string[],
  discordToken: string
) => {
  return await fetch(`${apiUrl}/favorites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      favorites: slugs,
    }),
  }).then(handleResponse);
};
