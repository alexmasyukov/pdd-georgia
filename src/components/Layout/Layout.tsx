import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.scss';

interface LayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, header }) => {
  return (
    <div className="layout">
      {header && (
        <header className="layout__header">
          {header}
        </header>
      )}
      <div className="layout__container">
        {sidebar && (
          <aside className="layout__sidebar">
            {sidebar}
          </aside>
        )}
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;