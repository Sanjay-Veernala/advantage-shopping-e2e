export const env = {
  baseUrl:
    process.env.BASE_URL ?? 'https://www.advantageonlineshopping.com',
  testUser: {
    username: process.env.TEST_USERNAME ?? '',
    password: process.env.TEST_PASSWORD ?? '',
    email: process.env.TEST_EMAIL ?? '',
  },
} as const;

export function hasStoredTestUser(): boolean {
  const { username, password, email } = env.testUser;
  return Boolean(username && password && email);
}
