import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <p>riana3@mail.ru</p>
          </div>
          <div className="footer-section">
            <p>+79612259545</p>
          </div>
          <div className="footer-section">
            <p className="underline">Политика конфиденциальности</p>
          </div>
          <div className="footer-section">
            <p>Наши соцсети</p>
          </div>
          <div className="footer-section">
            <div className="social-icons">
              <a 
                href="https://t.me/avatarsintheschool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <img 
                  src="/Property 1=white (1).png" 
                  alt="Telegram" 
                  className="social-icon"
                />
              </a>
              <a 
                href="https://vk.com/school148nsk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <img 
                  src="/Property 1=white.png" 
                  alt="ВКонтакте" 
                  className="social-icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-credits">
        <p>Разработано командой СОЮЗ.РФ | WEBWAVE</p>
      </div>
    </footer>
  );
}

export default Footer; 