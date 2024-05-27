import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let blog
  let mockHandler
  let renderedBlog

  beforeEach(() => {
    const testUser = {
      username: 'test',
      name: 'test',
    }
    blog = {
      title: 'testing a form...',
      author: 'test author',
      likes: 0,
      url: 'http://test.com',
      user: testUser,
    }
    mockHandler = vi.fn()

    renderedBlog = render(
      <Blog
        blog={blog}
        updateBlog={mockHandler}
        // removeBlog={mockHandler}
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

  // Realiza una prueba que verifique que la URL del blog y el número de likes se muestran cuando se hace clic en el botón que controla los detalles mostrados.
  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const togglableContent =
      renderedBlog.container.querySelector('.togglableContent')
    expect(togglableContent).not.toHaveStyle('display: none')
  })

  // 5.15: Pruebas de Listas de Blogs, paso 3
  // Realiza una prueba que garantice que si se hace clic dos veces en el botón like, se llama dos veces al controlador de eventos que el componente recibió como props.
  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
