import { createBrowserRouter } from 'react-router-dom';

// layouts
import App from './App';

// pages
import Home from './pages/HomePage';
import AdminHome from './pages/admin/AdminHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'admin/home',
        element: <AdminHome />,
      },
    ],
  },
]);

export default router;
