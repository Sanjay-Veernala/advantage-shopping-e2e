export interface NewUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Builds unique demo credentials safe for Advantage Shopping registration. */
export function buildNewUser(prefix = 'pwuser'): NewUser {
  const stamp = Date.now().toString(36);
  const username = `${prefix}_${stamp}`;
  return {
    username,
    email: `${username}@mailinator.com`,
    password: `Pw!${stamp}9`,
    firstName: 'Play',
    lastName: 'Wright',
  };
}
