const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Juani',
        username: 'juani',
        password: 'pdc',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('login to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('juani')
      await page.getByTestId('password').fill('pdc')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Juani logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('juani')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByTestId('username').fill('juani')
      await page.getByTestId('password').fill('pdc')
      await page.getByRole('button', { name: 'login' }).click()
    })
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      // title, author, url -> create
      await page.getByTestId('title').fill('Testing')
      await page.getByTestId('author').fill('Juani')
      await page.getByTestId('url').fill('no-url.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('A new blog Testing by Juani added')
      ).toBeVisible()
      await expect(page.getByText('Testing Juani')).toBeVisible()
    })
  })
})
