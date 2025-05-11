import React, { useState } from 'react';
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('¡Mensaje enviado!');
  };

  return (
    <div className="contact-container">
      <div className="contact">
        <h1>¡CONTÁCTANOS!</h1>
        <p>Si tienes alguna pregunta o sugerencia... ¡No dudes en enviarnos un mensaje! Estaremos encantados de ayudarte.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="contact__form-group">
            <label htmlFor="name">NOMBRE</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="contact__form-group">
            <label htmlFor="email">CORREO ELECTRÓNICO</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="contact__form-group">
            <label htmlFor="message">MENSAJE</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
            ></textarea>
          </div>
          
          <button type="submit" className="contact__submit-button">ENVIAR</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
