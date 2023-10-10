import { SCF_API } from 'src/constants';

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
  return await fetch(`${SCF_API}/user`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getVotes = async (discordToken: string): Promise<Project[]> => {
  return await fetch(`${SCF_API}/vote`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const voteProject = async (
  id: string,
  score: -1 | 0 | 1,
  discordToken: string,
  needs_work?: boolean
): Promise<{ project: PartialProject }> => {
  return await fetch(`${SCF_API}/vote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({
      id,
      score,
      needs_work,
    }),
  }).then(handleResponse);
};

export const getDeveloper = async (
  discordToken: string
): Promise<Developer> => {
  return await fetch(`${SCF_API}/user?type=developer`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getProjects = async (discordToken: string): Promise<Project[]> => {
  return await fetch(`${SCF_API}/projects`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getProjectsCsv = async (
  discordToken: string
): Promise<{ csv: string }> => {
  return await fetch(`${SCF_API}/projects?csv=true`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getDevelopersCsv = async (
  discordToken: string
): Promise<{ csv: string }> => {
  return await fetch(`${SCF_API}/developers?csv=true`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const getPanelistsCsv = async (
  discordToken: string
): Promise<{ csv: string }> => {
  return await fetch(`${SCF_API}/users?csv=true`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const submitVote = async (
  discordToken: string,
  publicKey: string
): Promise<{ xdr: string }> => {
  return await fetch(`${SCF_API}/submit?public_key=${publicKey}`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};

export const submitXdr = async (discordToken: string, signedXdr: string) => {
  return await fetch(`${SCF_API}/submit`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({ xdr: signedXdr }),
  }).then(handleResponse);
};

export const updatePublicKeys = async (
  discordToken: string,
  signedMessage: SignedMessage
) => {
  return await fetch(`${SCF_API}/user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({ signed_message: signedMessage }),
  }).then(handleResponse);
};

export const claimTier = async (discordToken: string) => {
  return await fetch(`${SCF_API}/tiers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({}),
  }).then(handleResponse);
};

export const updateEmail = async (discordToken: string, email: string) => {
  return await fetch(`${SCF_API}/user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
    body: JSON.stringify({ email: email }),
  }).then(handleResponse);
};

export const getProofTxt = async (
  discordToken: string
): Promise<{ proofs: { txt: string; pk: string }[] }> => {
  return await fetch(`${SCF_API}/proof`, {
    headers: {
      Authorization: `Bearer ${discordToken}`,
    },
  }).then(handleResponse);
};
