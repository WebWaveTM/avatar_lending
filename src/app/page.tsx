
export const dynamic = 'force-dynamic'

import ContactPopup from '@/components/ContactPopup';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Marquee } from '../components/Marquee';
import ContactPopupBtn from '@/components/ContactPopupBtn';
import Link from 'next/link';
import Image from 'next/image';
import { getLandingSettings } from '@/lib/actions';
import DemoModal from '@/components/DemoModal';


export default async function HomePage() {
    const settings = await getLandingSettings();

    const headerTitle = settings?.header?.title?.trim() || 'Цифровые аватары для образования';
    const headerSubtitle = settings?.header?.subtitle?.trim() || 'Простая технология, которая делает онлайн-уроки персонализированными и комфортными для детей с ОВЗ';

    const featureFallback = [
        'Точь-в-точь повторяет движения ваших глаз, рта и головы в целом',
        'Работает в реальном времени во время онлайн-уроков',
        'Не требует сложного оборудования - только веб-камера',
        'Помогает детям лучше воспринимать информацию за счёт игровой формы',
    ];
    const featureItems = [0,1,2,3].map((i) => {
        const v = (settings?.features?.items && settings.features.items[i]) ? String(settings.features.items[i]).trim() : ''
        return v || featureFallback[i]
    })

    const hiwDefault = [
        { title: 'Подключение', subtitle: '' },
        { title: 'Настройка', subtitle: 'Выберете аватара' },
        { title: 'Использование', subtitle: 'Аватар автоматически оживёт и будет повторять вашу мимику' },
    ];
    const hiwItems = [0,1,2].map((i) => {
        const src = (Array.isArray(settings?.howItWorks) && settings!.howItWorks![i]) ? settings!.howItWorks![i] : { title: '', subtitle: '' }
        const title = (src.title || '').trim() || hiwDefault[i].title
        const subtitle = (src.subtitle || '').trim() || hiwDefault[i].subtitle
        return { title, subtitle }
    })

    const whyDefault = [
        { title: 'Для детей с РАС', subtitle: 'предсказуемый визуальный образ снижает тревожность' },
        { title: 'Для детей с ДЦП', subtitle: 'упрощённая визуализация речи' },
        { title: 'Для всех', subtitle: 'делает онлайн-обучение более увлекательным' },
    ];
    const whyItems = [0,1,2].map((i) => {
        const src = (Array.isArray(settings?.whyUseful) && settings!.whyUseful![i]) ? settings!.whyUseful![i] : { title: '', subtitle: '' }
        const title = (src.title || '').trim() || whyDefault[i].title
        const subtitle = (src.subtitle || '').trim() || whyDefault[i].subtitle
        return { title, subtitle }
    })

    const tg = settings?.socials?.telegram?.trim() || 'https://t.me/avatarsintheschool';
    const vk = settings?.socials?.vk?.trim() || 'https://vk.com/school148nsk';

    const faqDefault = [
        {
            question: 'Как именно работает аватар',
            answer: 'Аватар - это интеллектуальная маска, которая в реальном времени повторяет вашу мимику. Система анализирует движения глаз и губ через веб-камеру и синхронизирует их с анимированным персонажем.',
        },
        {
            question: 'Какое оборудование нужно для работы?',
            answer: 'Достаточно обычного компьютера или ноутбука с веб-камерой и микрофоном. Специальные устройства не требуются.',
        },
        {
            question: 'Можно ли настроить внешность аватара?',
            answer: 'Нет, но есть выбор персонажа',
        },
        {
            question: 'С какими платформами работает?',
            answer: 'Система совместима с Zoom',
        },
    ];
    const faqFromSettings = Array.isArray(settings?.faq?.items) ? settings!.faq!.items : []
    const faqSanitized = faqFromSettings
        .map((it) => ({
            question: (it?.question || '').trim(),
            answer: (it?.answer || '').trim(),
        }))
        .filter((it) => it.question || it.answer)
    const faqItems = faqSanitized.length > 0 ? faqSanitized : faqDefault
    return (
        <>
            <Header />
            <div className="app has-hero">
                <section className="hero">
                    <div className="hero-section">
                        <h1>{headerTitle}</h1>
                        <p>{headerSubtitle}</p>
                        <Link className="ruby-button" href="#how-it-works">
                            Как это работает?
                        </Link>
                    </div>
                </section>
                <main className="main-content">

                    <div className="avatar-text">
                        <h2 className="avatar-title">
                            Цифровой аватар -<br />
                            это Умная 3D маска для видеочатов
                        </h2>
                        <p className="avatar-description">
                            Создаём анимированного персонажа, который:
                        </p>
                        <ul className="avatar-features">
                            {featureItems.map((text, idx) => (
                                <li key={idx}>{text}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="full-bleed">
                        <Marquee />
                    </div>
                    <section id="demo" className="section">
                        <DemoModal videoUrl={settings?.video?.file ?? null} />
                    </section>
                    <section id="how-it-works" className="section">
                        <h2 className="section-title-black">Как это работает</h2>
                        <p className="section-subtitle">3 простых шага к персонализированному обучению</p>
                        <div className="how-it-works-flex">
                            <div className="steps-container">
                                {hiwItems.map((s, i) => (
                                    <div className="step" key={i}>
                                        <h3>{s.title}</h3>
                                        {s.subtitle ? <p>{s.subtitle}</p> : null}
                                    </div>
                                ))}
                            </div>
                            <div className="how-it-works-image-wrapper">
                                <Image
                                    src="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png"
                                    alt="Как это работает"
                                    width={600}
                                    height={800}
                                    className="how-it-works-image responsive-img"
                                />
                            </div>
                        </div>
                    </section>

                    <section id="advantages" className="section">
                        <h2>Преимущества для детей с ОВЗ</h2>
                        <div className="advantages-circles">
                            <div className="circle circle-ras">
                                <h3>{whyItems[0].title}</h3>
                                <p>{whyItems[0].subtitle}</p>
                                <Image
                                    src="/165ac1b28d268b622310720a8db346497dd4fce2.png"
                                    alt="avatar"
                                    width={300}
                                    height={300}
                                    className="circle-ras-img responsive-img"
                                />
                            </div>
                            <div className="circle circle-cerebral">
                                <h3>{whyItems[1].title}</h3>
                                <p>{whyItems[1].subtitle}</p>
                                <Image
                                    src="/fc738c77b83caf8ad59db7d2ed3b31dc2bda8b5f.png"
                                    alt="avatar"
                                    width={300}
                                    height={300}
                                    className="circle-cerebral-img responsive-img"
                                />
                            </div>
                            <div className="circle circle-all">
                                <h3>{whyItems[2].title}</h3>
                                <p>{whyItems[2].subtitle}</p>
                                <Image
                                    src="/0cfba77f13102428d4a2b2b4b36a369a1b6ee40c.png"
                                    alt="avatar"
                                    width={300}
                                    height={300}
                                    className="circle-all-img responsive-img"
                                />
                            </div>
                        </div>
                    </section>

                    <section id="social-networks" className="section">
                        <h2 className="section-title-black">Наши соцсети</h2>
                        <div className="how-it-works-flex">
                            <div className="how-it-works-image-wrapper">
                                <Image
                                    src="/e4d435a6e5e35782fb9a86e609c04fe610e9d431.png"
                                    alt="Наши соцсети"
                                    width={600}
                                    height={800}
                                    className="how-it-works-image responsive-img"
                                />
                            </div>
                            <div className="steps-container">
                                <a
                                    href={tg}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    <div className="step">
                                        <h3>Telegram</h3>
                                        <svg className='social-icon-high-quality' width="148" height="148" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_417_226)">
                                                <g filter="url(#filter0_i_417_226)">
                                                    <path d="M74 0C114.87 0 148 33.1298 148 74C148 114.87 114.87 148 74 148C33.1298 148 0 114.87 0 74C0 33.1298 33.1298 0 74 0ZM106.871 44.4C104.051 44.4518 99.7224 45.9318 78.9062 54.4788C64.2948 60.5786 49.7238 66.775 35.1944 73.0676C31.6424 74.4637 29.785 75.8278 29.6222 77.1598C29.2966 79.7202 33.0262 80.512 37.7178 82.0216C41.5436 83.25 46.694 84.6856 49.3728 84.7448C51.8 84.7941 54.5084 83.8075 57.498 81.7848C77.9171 68.1688 88.4571 61.2893 89.1182 61.1462C89.5844 61.0426 90.2282 60.9094 90.6722 61.2942C91.1088 61.679 91.0644 62.4042 91.0126 62.604C90.6426 64.1654 71.4692 81.3852 70.3666 82.5174L69.8338 83.0502C65.7638 87.0684 61.6568 89.6954 68.746 94.3056C75.1544 98.4718 78.884 101.128 85.47 105.406C89.688 108.129 92.9958 111.363 97.347 110.97C99.3524 110.785 101.417 108.928 102.475 103.378C104.954 90.28 109.838 61.8788 110.963 50.172C111.034 49.201 110.992 48.2251 110.837 47.2638C110.746 46.4875 110.365 45.7741 109.772 45.2658C108.876 44.5406 107.485 44.3926 106.871 44.4Z" fill="#BF2A52" />
                                                </g>
                                            </g>
                                            <defs>
                                                <filter id="filter0_i_417_226" x="0" y="0" width="156" height="156" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dx="8" dy="8" />
                                                    <feGaussianBlur stdDeviation="8" />
                                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_417_226" />
                                                </filter>
                                                <clipPath id="clip0_417_226">
                                                    <rect width="148" height="148" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                </a>
                                <a
                                    href={vk}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                >
                                    <div className="step">
                                        <h3>ВКонтакте</h3>
                                        <svg className='social-icon-high-quality' width="148" height="148" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_417_230)">
                                                <g filter="url(#filter0_i_417_230)">
                                                    <path d="M58.5155 0.0248477L63.011 0.00634766H84.989L89.4907 0.0248477L95.127 0.0865143L97.7972 0.129681L100.375 0.197514L102.86 0.283848L105.253 0.382514L107.559 0.512014L109.779 0.666181L111.906 0.851181L113.96 1.05468C124.69 2.26335 132.047 4.85335 137.597 10.4033C143.147 15.9533 145.737 23.304 146.945 34.0402L147.155 36.0937L147.334 38.2273L147.488 40.4473L147.611 42.7475L147.766 46.3735L147.84 48.9018L147.92 52.8732L147.975 58.5157L148 64.559L147.994 84.9892L147.975 89.4908L147.914 95.1272L147.87 97.7973L147.803 100.375L147.716 102.86L147.618 105.253L147.488 107.559L147.334 109.779L147.149 111.907L146.945 113.96C145.737 124.69 143.147 132.047 137.597 137.597C132.047 143.147 124.696 145.737 113.96 146.946L111.906 147.155L109.773 147.334L107.553 147.488L105.253 147.612L101.627 147.766L99.0983 147.84L95.127 147.92L89.4845 147.976L83.4412 148L63.011 147.994L58.5093 147.976L52.873 147.914L50.2028 147.871L47.6252 147.803L45.14 147.717L42.7473 147.618L40.441 147.488L38.221 147.334L36.0935 147.149L34.04 146.946C23.31 145.737 15.9532 143.147 10.4032 137.597C4.85317 132.047 2.26317 124.696 1.0545 113.96L0.844833 111.907L0.666 109.773L0.511833 107.553L0.3885 105.253L0.234333 101.627L0.160333 99.0985L0.0801667 95.1272L0.0246667 89.4847L0 83.4413L0.00616667 63.0112L0.0246667 58.5095L0.0863333 52.8732L0.1295 50.203L0.197333 47.6253L0.283667 45.1402L0.382333 42.7475L0.511833 40.4412L0.666 38.2212L0.851 36.0937L1.0545 34.0402C2.26317 23.3102 4.85317 15.9533 10.4032 10.4033C15.9532 4.85335 23.3038 2.26335 34.04 1.05468L36.0935 0.845014L38.2272 0.666181L40.4472 0.512014L42.7473 0.388681L46.3733 0.234514L48.9017 0.160514L52.873 0.0803477L58.5155 0.0248477ZM41.8717 45.0168H24.975C25.7767 83.4968 45.0167 106.622 78.7483 106.622H80.66V84.6068C93.055 85.8402 102.428 94.9052 106.19 106.622H123.703C118.893 89.1085 106.252 79.4268 98.3583 75.7268C106.252 71.1635 117.352 60.0635 120.003 45.0168H104.093C100.64 57.2268 90.4033 68.3268 80.66 69.3752V45.0168H64.75V87.6902C54.8833 85.2235 42.4267 73.2602 41.8717 45.0168Z" fill="#BF2A52" />
                                                </g>
                                            </g>
                                            <defs>
                                                <filter id="filter0_i_417_230" x="0" y="0.00634766" width="156" height="155.994" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dx="8" dy="8" />
                                                    <feGaussianBlur stdDeviation="8" />
                                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                                                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_417_230" />
                                                </filter>
                                                <clipPath id="clip0_417_230">
                                                    <rect width="148" height="148" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                </a>
                            </div>
                        </div>
                    </section>

                    <section id="faq" className="section">
                        <h2 className="section-title-black">Часто задаваемые вопросы</h2>
                        <div className="faq-container">
                            {faqItems.map((f, idx) => (
                                <div className="faq-item" key={idx}>
                                    <h3>{idx + 1}. {f.question}</h3>
                                    <p>{f.answer}</p>
                                </div>
                            ))}
                        </div>
                        <div className="faq-contact">
                            <span className="faq-contact-text">Не нашли ответ?</span>
                            <ContactPopupBtn>Задать свой вопрос</ContactPopupBtn>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
            <ContactPopup />
        </>
    )
}
