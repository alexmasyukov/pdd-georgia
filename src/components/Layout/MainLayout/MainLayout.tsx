import React from 'react';
import { Outlet } from 'react-router-dom';
import CategoryList from '@components/Categories/CategoryList/CategoryList';
import Header from '@components/Layout/Header/Header';
import Footer from '@components/Layout/Footer/Footer';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout__body">
        <aside className="main-layout__sidebar">
          <CategoryList />
        </aside>
        <main className="main-layout__content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;