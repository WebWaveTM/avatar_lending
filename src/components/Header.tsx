
import './Header.css';
import Link from 'next/link';

function Header() {

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          <ul className="nav-list">
            <li><Link href="#about" className="nav-link">О технологии</Link></li>
            <li><Link href="#how-it-works" className="nav-link">Как это работает</Link></li>
            <li><Link href="#advantages" className="nav-link">Преимущества для детей с ОВЗ</Link></li>
            <li><Link href="#social-networks" className="nav-link">Наши соцсети</Link></li>
            <li><Link href="#faq" className="nav-link">Вопросы и ответы</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 