const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  // title, author, url -> create
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title).waitFor()
}

const likeTheBlogWithTitleTimes = async (page, title, times) => {
  await page.getByText(title).getByTestId('view-button').click()
  let blog = await page.getByText(title).locator('..')

  for (let i = 0; i < times; i++) {
    await blog.getByRole('button', { name: 'like', exact: true }).click()
    await blog.getByText(`likes ${i + 1}`).waitFor()
  }
}

export { loginWith, createBlog, likeTheBlogWithTitleTimes }
