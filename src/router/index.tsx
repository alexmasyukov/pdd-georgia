import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import Header from '@components/Header/Header';
import CategoryList from '@components/CategoryList/CategoryList';
import HomePage from '@pages/HomePage/HomePage';
import CategoryPage from '@pages/CategoryPage/CategoryPage';
import FavoritesPage from '@pages/FavoritesPage/FavoritesPage';
import KnownPage from '@pages/KnownPage/KnownPage';
import HardPage from '@pages/HardPage/HardPage';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout 
            header={<Header />} 
            sidebar={<CategoryList />}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="category/:id/favorites" element={<CategoryPage filter="favorite" />} />
        <Route path="category/:id/known" element={<CategoryPage filter="known" />} />
        <Route path="category/:id/hard" element={<CategoryPage filter="hard" />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="known" element={<KnownPage />} />
        <Route path="hard" element={<HardPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;