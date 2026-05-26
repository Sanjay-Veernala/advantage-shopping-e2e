import { test } from '../../src/fixtures/test.fixture';
import users from '../../test-data/users.json';

test.describe('Search', () => {
  test('should display results when searching for laptops', async ({ homePage }) => {
    await homePage.goto();
    await homePage.header.search(users.searchQueries.laptop);
    await homePage.expectSearchResultsFor(users.searchQueries.laptop);
  });
});
