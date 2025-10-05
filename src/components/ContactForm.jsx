import React, { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    question: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Создаем содержимое письма
    const subject = encodeURIComponent('Новый вопрос с сайта аватаров');
    const body = encodeURIComponent(`
ФИО: ${formData.name}
Email: ${formData.email}
Образовательное учреждение: ${formData.institution}

Вопрос:
${formData.question}
    `).trim();
    
    // Создаем mailto ссылку
    const mailtoLink = `mailto:riana3@mail.ru?subject=${subject}&body=${body}`;
    
    // Открываем почтовый клиент
    window.location.href = mailtoLink;
    
    // Показываем сообщение об успехе
    setSubmitStatus('success');
    setFormData({ name: '', email: '', institution: '', question: '' });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h1 className="contact-title">Остались вопросы?<br />Свяжитесь с нами!</h1>
      
      <label className="contact-label">ФИО</label>
      <input 
        className="contact-input" 
        type="text" 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Введите ваше ФИО" 
        required
      />
      
      <label className="contact-label">Email</label>
      <input 
        className="contact-input" 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Укажите адрес электронной почты" 
        required
      />
      
      <label className="contact-label">Образовательное учреждение</label>
      <input 
        className="contact-input" 
        type="text" 
        name="institution"
        value={formData.institution}
        onChange={handleChange}
        placeholder="Введите наименование образовательного учреждения" 
        required
      />
      
      <label className="contact-label">Ваш вопрос</label>
      <textarea 
        className="contact-textarea" 
        rows="6" 
        name="question"
        value={formData.question}
        onChange={handleChange}
        placeholder="Подробно опишите ваш вопрос"
        required
      ></textarea>
      
      {submitStatus === 'success' && (
        <div className="submit-status success">
          Спасибо! Откроется ваш почтовый клиент для отправки письма на riana3@mail.ru
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="submit-status error">
          Произошла ошибка при отправке. Попробуйте еще раз.
        </div>
      )}
      
      <button 
        className="ruby-button contact-submit" 
        type="submit"
      >
        Отправить
      </button>
    </form>
  );
} 