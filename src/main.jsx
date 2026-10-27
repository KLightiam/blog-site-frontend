import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource-variable/figtree'
import './index.css'
import App from './App.jsx'
import RouteError from './components/RouteError.jsx'
import Home from './pages/Home.jsx'
import BlogPost from './pages/BlogPost.jsx'
import About from './pages/About.jsx'
import ContactPage from './pages/Contact.jsx'
import Categories from './pages/Categories.jsx'
import CategoryPosts from './pages/CategoryPosts.jsx'

// Loaded only when someone opens /admin, so readers never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

const router = createBrowserRouter([
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading admin…</div>}>
        <AdminApp />
      </Suspense>
    ),
    errorElement: <RouteError />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: '/blog/:id', element: <BlogPost /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/categories', element: <Categories /> },
      { path: '/categories/:categoryName/posts', element: <CategoryPosts /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
