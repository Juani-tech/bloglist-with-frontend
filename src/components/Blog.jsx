import { useState } from "react";
import blogService from "../services/blogs";

const addLike = async (blog, setLikes, updateBlog) => {
  const updatedBlog = { ...blog, likes: blog.likes + 1 };
  try {
    await blogService.update(blog.id, updatedBlog);
    updateBlog(updatedBlog);
    setLikes(updatedBlog.likes);
  } catch (error) {
    console.log(error);
  }
};

const Blog = ({ blog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        {!visible && <button onClick={toggleVisibility}>view</button>}
        {visible && <button onClick={toggleVisibility}>hide</button>}
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {likes}{" "}
          <button onClick={() => addLike(blog, setLikes, updateBlog)}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  );
};

export default Blog;
