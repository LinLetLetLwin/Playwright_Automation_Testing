
import { test, expect } from '@playwright/test';

test('Simple API test', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.ok()).toBeTruthy();

  const post = await response.json();
  expect(post).toMatchObject({
    userId: 1,
    id: 1,
  });
  expect(post.title).toEqual(expect.any(String));
  expect(post.body).toEqual(expect.any(String));
});

