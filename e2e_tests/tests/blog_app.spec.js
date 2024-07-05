const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { log } = require('console')

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
      await loginWith(page, 'juani', 'pdc')
      await expect(page.getByText('Juani logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'juani', 'wrongpassword')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'juani', 'pdc')
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing', 'Juani', 'no-url.com')
      await expect(
        page.getByText('A new blog Testing by Juani added')
      ).toBeVisible()
      await expect(page.getByText('Testing Juani')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page, request }) => {
        await createBlog(page, 'Testing', 'Juani', 'no-url.com')
      })
      test('it can be edited', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByTestId('like-button').click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })
    })
  })
})
