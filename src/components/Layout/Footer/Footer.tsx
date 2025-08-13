import React from 'react';
import ResetButton from '@components/UI/ResetButton/ResetButton';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__left">
          <ResetButton variant="outlined" size="small" color="gray" />
        </div>
        <div className="footer__center">
          <span className="footer__text">ПДД Грузия © 2025</span>
        </div>
        <div className="footer__right"></div>
      </div>
    </footer>
  );
};

export default Footer;