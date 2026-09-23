export interface NewUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  state: string;
  postalCode: string;
}

/** Builds unique demo credentials safe for Advantage Shopping registration. */
export function buildNewUser(prefix = "pwuser"): NewUser {
  const stamp = Date.now().toString(36);
  const username = `${prefix}_${stamp}`;
  return {
    username,
    email: `${username}@mailinator.com`,
    password: `Pw!${stamp}9`,
    firstName: "Play",
    lastName: "Wright",
    phone: "9999999999",
    country: "United States",
    city: "Austin",
    address: "123 Demo Street",
    state: "Texas",
    postalCode: "73301",
  };
}
