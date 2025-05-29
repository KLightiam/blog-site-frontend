import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import BlogPost from './pages/BlogPost.jsx'
import About from './pages/About.jsx'
import ContactPage from './pages/Contact.jsx'
import Categories from './pages/Categories.jsx'
import CategoryPosts from './pages/CategoryPosts.jsx'


const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />,
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      {index: true, element: <Home />},
      {path: '/blog/:id', element: <BlogPost />},
      {path: '/about', element: <About />},
      {path: '/contact', element: <ContactPage />},
      {path: '/categories', element: <Categories />},
      {path: '/categories/:categoryName/posts', element: <CategoryPosts />},
    ],
  },
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
