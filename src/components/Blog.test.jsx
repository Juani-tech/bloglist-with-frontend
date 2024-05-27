import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let blog
  let mockHandler
  let renderedBlog

  beforeEach(() => {
    const user = {
      username: 'test',
      name: 'test',
    }
    blog = {
      title: 'testing a form...',
      author: 'test author',
      url: 'http://test.com',
      user,
    }
    mockHandler = vi.fn()

    renderedBlog = render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
        removeBlog={mockHandler}
        username={'Test user'}
      />
    )
  })

  test('at start only title and author are displayed', () => {
    const title_author = screen.getByText('testing a form... test author')
    expect(title_author).toBeDefined()

    const togglableContent =
      renderedBlog.container.querySelector('.togglableContent')
    expect(togglableContent).toHaveStyle('display: none')
  })
})
