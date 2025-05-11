import React from 'react';
import "../styles/About.css";

const About = () => {
    return (
        <div className='about-container'>
            <div className="about">
                <h1>ACERCA DE EVENT PLANNER</h1>
                <p>EventPlanner+ es una aplicación diseñada para ayudarte a planificar y gestionar eventos de manera eficiente. Nuestro objetivo es facilitar el proceso de creación de eventos, gestión de presupuestos, y coordinación de suministros y tareas de manera centralizada. Con EventPlanner+, tendrás todo lo que necesitas al alcance de tu mano para organizar eventos memorables.</p>

                <h2>MISIÓN</h2>
                <p>Proporcionar una plataforma completa y fácil de usar para la planificación de eventos, ayudando a los usuarios a organizar y coordinar cada aspecto de su evento de manera eficiente.</p>

                <h2>VISIÓN</h2>
                <p>Ser la herramienta líder en planificación de eventos, reconocida por su facilidad de uso, integraciones útiles y capacidades personalizables para adaptarse a cualquier tipo de evento.</p>

                <p>Esta página web fue desarrollada por Brenda Paola Navarro Alatorre, estudiante de ingeniería en Desarrollo de Software</p>
                <div className="school-data">
                    <h2>DATOS ESCOLARES:</h2>
                    <ul className="school-data__list">
                        <li><strong>REGISTRO:</strong> 21310446</li>
                        <li><strong>UNIVERSIDAD:</strong> Centro de Enseñanza Técnica Industrial plantel Colomos</li>
                        <li><strong>SEMESTRE:</strong> 5to Semestre</li>
                        <li><strong>PROFESOR:</strong> FERNANDEZ RIVERON CLARA MARGARITA</li>
                        <li><strong>MATERIA:</strong> Desarrollo Web II</li>
                        <li><strong>CARRERA:</strong> ingeniería en Desarrollo de Software</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;
