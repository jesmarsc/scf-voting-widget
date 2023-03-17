export const apiUrl = 'https://scf-voting.stellarcommunity.workers.dev';

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

export const getUser = async (discordToken: string): Promise<User> => {
  return await fetch(`${apiUrl}/auth`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getProjects = async (
  discordToken: string
): Promise<{ total: number; projects: DetailedProject[] }> => {
  return await fetch(`${apiUrl}/projects`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getProjectsCsv = async (
  discordToken: string
): Promise<{ csv: string }> => {
  return await fetch(`${apiUrl}/projects/csv`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getPanelists = async (
  discordToken: string
): Promise<{ panelists: User[] }> => {
  return await fetch(`${apiUrl}/panelists`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getPanelistsCsv = async (
  discordToken: string
): Promise<{ csv: string }> => {
  return await fetch(`${apiUrl}/panelists/csv`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const approveProject = async (
  slug: string,
  discordToken: string
): Promise<{ project: Project }> => {
  return await fetch(`${apiUrl}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      slug,
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
      slug,
    }),
  }).then(handleResponse);
};

export const saveFavorites = async (
  favorites: string[],
  discordToken: string
): Promise<Project[]> => {
  return await fetch(`${apiUrl}/favorites`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      favorites,
    }),
  }).then(handleResponse);
};

export const submitVote = async (discordToken: string, publicKey: string) => {
  return await fetch(`${apiUrl}/submit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({ publicKey }),
  }).then(handleResponse);
};

export const submitXdr = async (discordToken: string, signedXdr: string) => {
  return await fetch(`${apiUrl}/submit-xdr`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({ xdr: signedXdr }),
  }).then(handleResponse);
};
