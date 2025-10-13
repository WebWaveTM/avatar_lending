'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import './ContactForm.css';
import { useForm } from 'react-hook-form';
import z from 'zod';
import toast from 'react-hot-toast';
import { createInquiry } from '@/lib/actions';

const formData = z.object({
  name: z.string({error: 'ФИО обязательно для заполнения'}).nonempty({error: 'ФИО обязательно для заполнения'}),
  email: z.email({error: 'Некорректный email'}),
  institution: z.string({error: 'Образовательное учреждение обязательно для заполнения'}).nonempty({error: 'Образовательное учреждение обязательно для заполнения'}),
  question: z.string({error: 'Ваш вопрос обязателен для заполнения'}).nonempty({error: 'Ваш вопрос обязателен для заполнения'}),
});

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors, isValid,  isSubmitting, isSubmitted }, } = useForm({
    resolver: zodResolver(formData),
    mode: 'onChange'
  });

  

  const onSubmit = handleSubmit(async data => {
    await createInquiry(data);
    toast.success('Ваше обращение успешно отправлено');
  }, () => {
    toast.error('Произошла ошибка при отправке. Попробуйте еще раз.');
  });

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-inner">
      <h1 className="contact-title">Остались вопросы?<br />Свяжитесь с нами!</h1>
      
      <label className="contact-label">ФИО</label>
      <div className="field-group">
        <input 
          className={`contact-input${errors.name ? ' has-error' : ''}`} 
          aria-invalid={!!errors.name}
          aria-describedby="error-name"
          placeholder="Введите ваше ФИО" 
          {...register('name')}
        />
        <p id="error-name" className={`error-message ${errors.name ? '' : 'hidden'}`}>{errors.name?.message || ''}</p>
      </div>
      
      <label className="contact-label">Email</label>
      <div className="field-group">
        <input 
          className={`contact-input${errors.email ? ' has-error' : ''}`} 
          aria-invalid={!!errors.email}
          aria-describedby="error-email"
          placeholder="Укажите адрес электронной почты" 
          {...register('email')}
        />
        <p id="error-email" className={`error-message ${errors.email ? '' : 'hidden'}`}>{errors.email?.message || ''}</p>
      </div>
      
      <label className="contact-label">Образовательное учреждение</label>
      <div className="field-group">
        <input 
          className={`contact-input${errors.institution ? ' has-error' : ''}`} 
          aria-invalid={!!errors.institution}
          aria-describedby="error-institution"
          placeholder="Введите наименование образовательного учреждения" 
          {...register('institution')}
        />
        <p id="error-institution" className={`error-message ${errors.institution ? '' : 'hidden'}`}>{errors.institution?.message || ''}</p>
      </div>
      
      <label className="contact-label">Ваш вопрос</label>
      <div className="field-group">
        <textarea 
          className={`contact-textarea${errors.question ? ' has-error' : ''}`} 
          rows={6}
          aria-invalid={!!errors.question}
          aria-describedby="error-question"
          {...register('question')}
          placeholder="Подробно опишите ваш вопрос"
        ></textarea>
        <p id="error-question" className={`error-message ${errors.question ? '' : 'hidden'}`}>{errors.question?.message || ''}</p>
      </div>
      {isSubmitted && (
        <div className="submit-status success">
          Спасибо! Откроется ваш почтовый клиент для отправки письма на riana3@mail.ru
        </div>
      )}
      
      {isSubmitted && !isValid && (
        <div className="submit-status error">
          Произошла ошибка при отправке. Попробуйте еще раз.
        </div>
      )}
      
      <button 
        className="ruby-button contact-submit" 
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
      </div>
    </form>
  );
} 