import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <p>example@mail.ru</p>
          </div>
          <div className="footer-section">
            <p>+ 7(999) 999-99-99</p>
          </div>
          <div className="footer-section">
            <p className="underline">Политика конфиденциальности</p>
          </div>
          <div className="footer-section">
            <p>Наши соцсети</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 