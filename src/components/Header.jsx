import React from 'react';
import './Header.css';

function Header() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          <ul className="nav-list">
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>О технологии</a></li>
            <li><a href="#how-it-works" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>Как это работает</a></li>
            <li><a href="#advantages" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('advantages'); }}>Преимущества для детей с ОВЗ</a></li>
            <li><a href="#faq" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>Вопросы и ответы</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 