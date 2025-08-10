import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@pages/HomePage/HomePage';
import CategoryPage from '@pages/CategoryPage/CategoryPage';
import FavoritesPage from '@pages/FavoritesPage/FavoritesPage';
import KnownPage from '@pages/KnownPage/KnownPage';
import HardPage from '@pages/HardPage/HardPage';
import MainLayout from '@components/Layout/MainLayout/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/category/:id',
        element: <CategoryPage />,
      },
      {
        path: '/favorites',
        element: <FavoritesPage />,
      },
      {
        path: '/known',
        element: <KnownPage />,
      },
      {
        path: '/hard',
        element: <HardPage />,
      },
      {
        path: '/category/:id/favorites',
        element: <CategoryPage listType="favorite" />,
      },
      {
        path: '/category/:id/known',
        element: <CategoryPage listType="known" />,
      },
      {
        path: '/category/:id/hard',
        element: <CategoryPage listType="hard" />,
      },
    ],
  },
]);