const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeTheBlogWithTitleTimes } = require('./helper')

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
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Other',
        username: 'other',
        password: 'other',
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

      test('it can be removed', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        page.on('dialog', async (dialog) => await dialog.accept())
        await expect(page.getByTestId('title')).not.toBeVisible()
      })

      test('only its creator can see the remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'other', 'other')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })
    describe('and multiple blogs exists', () => {
      beforeEach(async ({ page, request }) => {
        await createBlog(page, 'blog1', 'Juani', 'nourl')
        await createBlog(page, 'blog2', 'Juani', 'nourl')
        await createBlog(page, 'blog3', 'Juani', 'nourl')
      })

      test('can be shown sorted by likes', async ({ page }) => {
        await likeTheBlogWithTitleTimes(page, 'blog3', 3)
        await likeTheBlogWithTitleTimes(page, 'blog2', 2)
        await likeTheBlogWithTitleTimes(page, 'blog1', 1)
        await page
          .getByRole('button', { name: 'Sort by likes', exact: true })
          .click()
        const allBlogs = await page.getByText(/blog\d+ Juani/).all()
        await expect(allBlogs[0]).toHaveText('blog3 Juani hide')
        await expect(allBlogs[1]).toHaveText('blog2 Juani hide')
        await expect(allBlogs[2]).toHaveText('blog1 Juani hide')
      })
    })
  })
})
