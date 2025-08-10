import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';

interface LayoutProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, header }) => {
  return (
    <div className={styles.layout}>
      {header && (
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {header}
          </div>
        </header>
      )}
      {sidebar && (
        <aside className={`${styles.sidebar} ${!header ? styles.noHeader : ''}`}>
          {sidebar}
        </aside>
      )}
      <main className={`${styles.main} ${!sidebar ? styles.noSidebar : ''} ${!header ? styles.noHeader : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;