import React from 'react';
import './ContactForm.css';

export default function ContactForm() {
  return (
    <form className="contact-form">
      <h1 className="contact-title">Остались вопросы?<br />Свяжитесь с нами!</h1>
      <label className="contact-label">ФИО</label>
      <input className="contact-input" type="text" placeholder="Введите ваше ФИО" />
      <label className="contact-label">Email</label>
      <input className="contact-input" type="email" placeholder="Укажите адрес электронной почты" />
      <label className="contact-label">Образовательное учреждение</label>
      <input className="contact-input" type="text" placeholder="Введите наименование образовательного учреждения" />
      <label className="contact-label">Ваш вопрос</label>
      <textarea className="contact-textarea" rows="6" placeholder="Подробно опишите ваш вопрос"></textarea>
      <button className="ruby-button contact-submit" type="submit">Отправить</button>
    </form>
  );
} 