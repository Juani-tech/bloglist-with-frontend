import { render, screen } from '@testing-library/react'
import BlogsForm from './BlogsForm'
import userEvent from '@testing-library/user-event'

// 5.16: Pruebas de Listas de Blogs, paso 4
// Haz una prueba para el nuevo formulario de blog. La prueba debe verificar que el formulario llama al controlador de eventos que recibió como props con los detalles correctos cuando se crea un nuevo blog.

test('when the form is submitted, the event handler is called with the right details', async () => {
  const createBlog = vi.fn()

  const { container } = render(<BlogsForm createBlog={createBlog} />)

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  //   const form = container.querySelector('form')
  const createButton = screen.getByText('create')

  await userEvent.type(title, 'test title')
  await userEvent.type(author, 'test author')
  await userEvent.type(url, 'http://test.com')

  await userEvent.click(createButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'test title',
    author: 'test author',
    url: 'http://test.com',
  })
})
