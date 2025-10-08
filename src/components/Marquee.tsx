import styles from './Marquee.module.css';
import { Star } from './Star';

export function Marquee() {
  return (
    <div className={styles.marquee + ' ' + styles.fadeoutHorizontal}>
      <div className={styles.marqueeContent}>
        <span className={styles.marqueeItem}>Анимация движения головы и мимики лица</span>
        <Star/>
        <span className={styles.marqueeItem}>Выбор внешности аватара по предпочтениям</span>
        <Star/>
        <span className={styles.marqueeItem}>Простая интеграция с Zoom</span>
        <Star/>
        <span className={styles.marqueeItem}>Анимация движения головы и мимики лица</span>
        <Star/>
        <span className={styles.marqueeItem}>Выбор внешности аватара по предпочтениям</span>
        <Star/>
        <span className={styles.marqueeItem}>Простая интеграция с Zoom</span>
      </div>
    </div>
  );
}