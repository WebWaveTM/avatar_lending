import { useEffect, useState } from 'react';
import './App.css';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Header from './components/Header';
import { Marquee } from './components/Marquee';

function App() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    const parallax = document.querySelector('.parallax');
    function handleScroll() {
      if (parallax) {
        const scrolled = window.scrollY;
        parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="app">
        <div className="background-image-container">
          <img 
            src="/2f791c580a2b01b5d1b1c02cb62a2e87037b8382.png" 
            srcSet="/2f791c580a2b01b5d1b1c02cb62a2e87037b8382.png 1x, /2f791c580a2b01b5d1b1c02cb62a2e87037b8382.png 2x"
            sizes="(max-width: 600px) 100vw, 1200px"
            alt="Background" 
            className="background-image responsive-img"
          />
        </div>
        <Header />
        <main className="main-content">
          <section className="hero-section">
            <h1>Цифровые аватары для образования</h1>
            <p>
              Простая технология, которая делает онлайн-уроки персонализированными<br />
              и комфортными для детей с ОВЗ
            </p>
            <button className="ruby-button" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
              Как это работает?
            </button>
          </section>
          
          <div className="avatar-text">
            <h2 className="avatar-title">
              Цифровой аватар -<br />
              это Умная 3D маска для видеочатов
            </h2>
            <p className="avatar-description">
              Создаём анимированного персонажа, который:
            </p>
            <ul className="avatar-features">
              <li>Точь-в-точь повторяет движения ваших глаз, рта и головы в целом</li>
              <li>Работает в реальном времени во время онлайн-уроков</li>
              <li>Не требует сложного оборудования - только<br />веб-камера</li>
              <li>Помогает детям лучше воспринимать информацию за счёт игровой формы</li>
            </ul>
          </div>

            <div className="full-bleed">
              <Marquee />
            </div>
          <section id="demo" className="section">
            <button className="ruby-button demo-button" onClick={() => console.log('Демо-ролик')}>
              Посмотреть демо-ролик
            </button>
          </section>
          <section id="how-it-works" className="section">
            <h2 className="section-title-black">Как это работает</h2>
            <p className="section-subtitle">3 простых шага к персонализированному обучению</p>
            <div className="how-it-works-flex">
              <div className="steps-container">
                <div className="step">
                  <h3>Подключение</h3>
                </div>
                <div className="step">
                  <h3>Настройка</h3>
                  <p>Выберете аватара</p>
                </div>
                <div className="step">
                  <h3>Использование</h3>
                  <p>Аватар автоматически оживёт и будет повторять вашу мимику</p>
                </div>
              </div>
              <div className="how-it-works-image-wrapper">
                <img 
                  src="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png" 
                  srcSet="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png 1x, /e4d435a6e5e35782fb9a86e609c04fe610e9d431.png 2x"
                  sizes="(max-width: 600px) 100vw, 600px"
                  alt="Как это работает" 
                  className="how-it-works-image responsive-img"
                />
              </div>
            </div>
          </section>

          <section id="advantages" className="section">
            <h2>Преимущества для детей с ОВЗ</h2>
            <div className="advantages-circles">
              <div className="circle circle-ras">
                <h3>Для детей с РАС</h3>
                <p>предсказуемый визуальный<br />образ снижает тревожность</p>
                <img 
                  src="/165ac1b28d268b622310720a8db346497dd4fce2.png" 
                  alt="avatar" 
                  className="circle-ras-img responsive-img"
                  srcSet="/165ac1b28d268b622310720a8db346497dd4fce2.png 1x, /165ac1b28d268b622310720a8db346497dd4fce2.png 2x"
                  sizes="(max-width: 600px) 100vw, 250px"
                />
              </div>
              <div className="circle circle-cerebral">
                <h3>Для детей с ДЦП</h3>
                <p>упрощённая<br />визуализация речи</p>
                <img 
                  src="/fc738c77b83caf8ad59db7d2ed3b31dc2bda8b5f.png" 
                  alt="avatar" 
                  className="circle-cerebral-img responsive-img"
                  srcSet="/fc738c77b83caf8ad59db7d2ed3b31dc2bda8b5f.png 1x, /fc738c77b83caf8ad59db7d2ed3b31dc2bda8b5f.png 2x"
                  sizes="(max-width: 600px) 100vw, 250px"
                />
              </div>
              <div className="circle circle-all">
                <h3>Для всех</h3>
                <p>делает онлайн-обучение<br />более увлекательным</p>
                <img 
                  src="/0cfba77f13102428d4a2b2b4b36a369a1b6ee40c.png" 
                  alt="avatar" 
                  className="circle-all-img responsive-img"
                  srcSet="/0cfba77f13102428d4a2b2b4b36a369a1b6ee40c.png 1x, /0cfba77f13102428d4a2b2b4b36a369a1b6ee40c.png 2x"
                  sizes="(max-width: 600px) 100vw, 250px"
                />
              </div>
            </div>
          </section>

          <section id="social-networks" className="section">
            <h2 className="section-title-black">Наши соцсети</h2>
            <div className="how-it-works-flex">
              <div className="how-it-works-image-wrapper">
                <img 
                  src="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png" 
                  srcSet="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png 1x, /e4d435a6e5e35782fb9a86e609c04fe610e9d431.png 2x"
                  sizes="(max-width: 600px) 100vw, 600px"
                  alt="Наши соцсети" 
                  className="how-it-works-image responsive-img"
                />
              </div>
              <div className="steps-container">
                <a
                  href="https://t.me/avatarsintheschool"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <div className="step">
                    <h3>Telegram</h3>
                    <img
                      src="/Property 1=pink (1).png"
                      alt="Telegram"
                      className="responsive-img social-icon-high-quality"
                    />
                  </div>
                </a>
                <a
                  href="https://vk.com/school148nsk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <div className="step">
                    <h3>ВКонтакте</h3>
                    <img
                      src="/Property 1=pink.png"
                      alt="ВКонтакте"
                      className="responsive-img social-icon-high-quality"
                    />
                  </div>
                </a>
              </div>
            </div>
          </section>

          <section id="faq" className="section">
            <button className="ruby-button demo-button" onClick={() => console.log('Остались вопросы')}>
              Остались вопросы?
            </button>
            <h2 className="section-title-black">Часто задаваемые вопросы</h2>
            <div className="faq-container">
              <div className="faq-item">
                <h3>1. Как именно работает аватар</h3>
                <p>Аватар - это интеллектуальная маска, которая в реальном времени повторяет вашу мимику. Система анализирует движения глаз и губ через веб-камеру и синхронизирует их с анимированным персонажем.</p>
              </div>
              <div className="faq-item">
                <h3>2. Какое оборудование нужно для работы?</h3>
                <p>Достаточно обычного компьютера или ноутбука с веб-камерой и микрофоном. Специальные устройства не требуются.</p>
              </div>
              <div className="faq-item">
                <h3>3. Можно ли настроить внешность аватара?</h3>
                <p>Нет, но есть выбор персонажа</p>
              </div>
              <div className="faq-item">
                <h3>4. С какими платформами работает?</h3>
                <p>Система совместима с Zoom</p>
              </div>
            </div>
            <div className="faq-contact">
              <span className="faq-contact-text">Не нашли ответ?</span>
              <button className="ruby-button contact-button" onClick={() => setShowContactPopup(true)}>
                Задать свой вопрос
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
      {showContactPopup && (
        <div className="contact-popup-overlay" onClick={() => setShowContactPopup(false)}>
          <div className="contact-popup" onClick={e => e.stopPropagation()}>
            <button className="contact-popup-close" onClick={() => setShowContactPopup(false)}>&times;</button>
            <ContactForm />
          </div>
        </div>
      )}
    </>
  )
}

export default App 