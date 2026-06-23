const questions = [
    // ===== SECCIÓN 1 =====
    {
        id: 'q1',
        section: 'Sobre tu empresa',
        text: '¿Cuál es el nombre de tu empresa o emprendimiento?',
        type: 'text',
        required: true,
        placeholder: 'Ej. Estudio Creativo Nombre'
    },
    {
        id: 'q2',
        section: 'Sobre tu empresa',
        text: '¿En qué sector opera tu empresa?',
        type: 'select',
        required: true,
        options: [
            'Tecnología / Software',
            'Diseño / Creatividad',
            'Comercio / Retail',
            'Salud y bienestar',
            'Educación',
            'Alimentos y bebidas',
            'Servicios profesionales',
            'Manufactura / Producción',
            'Construcción / Inmobiliario',
            'Otro'
        ]
    },
    {
        id: 'q3',
        section: 'Sobre tu empresa',
        text: '¿Cuántos colaboradores tiene?',
        type: 'radio',
        required: true,
        options: ['Solo yo', '2 – 5', '6 – 15', 'Más de 15']
    },
    {
        id: 'q4',
        section: 'Sobre tu empresa',
        text: '¿Cuántos años lleva operando?',
        type: 'radio',
        required: true,
        options: ['Menos de 1 año', '1 – 3 años', '3 – 7 años', 'Más de 7 años']
    },
    {
        id: 'q5',
        section: 'Sobre tu empresa',
        text: '¿Cuál es tu cargo o rol dentro de la empresa?',
        type: 'text',
        required: true,
        placeholder: 'Ej. Fundador, Gerente, Director comercial...'
    },
    {
        id: 'q6',
        section: 'Sobre tu empresa',
        text: '¿Qué tan cómodo/a te sientes usando herramientas digitales?',
        type: 'radio',
        required: true,
        options: ['Poco cómodo', 'Moderadamente', 'Muy cómodo'],
        inline: true
    },

    // ===== SECCIÓN 2 =====
    {
        id: 'q7',
        section: 'La actividad que más tiempo te quita',
        text: '¿Cuál es la actividad que más tiempo te quita en tu semana laboral?',
        type: 'textarea',
        required: true,
        placeholder: 'Ej. Responder correos de clientes, hacer seguimiento de pagos...',
        hint: 'Descríbela con tus propias palabras, sin limitarte a opciones predefinidas.'
    },
    {
        id: 'q8',
        section: 'La actividad que más tiempo te quita',
        text: '¿Con qué frecuencia realizas esa actividad?',
        type: 'radio',
        required: true,
        options: ['Varias veces al día', 'Una vez al día', 'Varias veces a la semana', 'Semanal o mensual']
    },
    {
        id: 'q9',
        section: 'La actividad que más tiempo te quita',
        text: '¿Cuánto tiempo dedicas a esa actividad?',
        type: 'radio',
        required: true,
        options: ['Menos de 1 hora/semana', '1 – 3 horas/semana', '4 – 8 horas/semana', 'Más de 8 horas/semana']
    },
    {
        id: 'q10',
        section: 'La actividad que más tiempo te quita',
        text: '¿La haces solo/a o involucra a otras personas del equipo?',
        type: 'radio',
        required: true,
        options: ['La hago solo/a', 'Involucra a 1-2 personas', 'Involucra a todo el equipo'],
        inline: true
    },
    {
        id: 'q11',
        section: 'La actividad que más tiempo te quita',
        text: '¿Esa actividad hace parte de tu rol principal o te "roba" tiempo?',
        type: 'radio',
        required: true,
        options: ['Es parte de mi rol principal', 'Me quita tiempo de lo importante', 'Es necesaria pero no estratégica']
    },
    {
        id: 'q12',
        section: 'La actividad que más tiempo te quita',
        text: '¿Qué pasa si esa tarea no se hace o se hace mal?',
        type: 'radio',
        required: true,
        options: ['Pérdida de clientes o ventas', 'Problemas operativos o de calidad', 'Estrés, sin consecuencias graves', 'Poco impacto real']
    },
    {
        id: 'q13',
        section: 'La actividad que más tiempo te quita',
        text: '¿Los resultados de esa actividad son fáciles de medir?',
        type: 'radio',
        required: true,
        options: ['Sí, claramente', 'A veces', 'No, es difícil de medir'],
        inline: true
    },

    // ===== SECCIÓN 3 =====
    {
        id: 'q14',
        section: 'Herramientas actuales y mejoras',
        text: '¿Qué herramientas o métodos usas actualmente para hacer esa tarea?',
        type: 'textarea',
        required: true,
        placeholder: 'Ej. WhatsApp + hoja de cálculo + recordatorios en el celular...',
        hint: 'Papel, Excel, WhatsApp, software específico, etc.'
    },
    {
        id: 'q15',
        section: 'Herramientas actuales y mejoras',
        text: '¿Ya intentaste alguna vez optimizarla o delegarla? ¿Qué pasó?',
        type: 'textarea',
        required: false,
        placeholder: 'Ej. Intenté contratar alguien pero salía muy costoso...'
    },
    {
        id: 'q16',
        section: 'Herramientas actuales y mejoras',
        text: '¿Cuánto estarías dispuesto/a a pagar mensualmente por una herramienta que mejore esa tarea?',
        type: 'radio',
        required: true,
        options: [
            'No pagaría — solo si es gratuita',
            'Hasta $30.000 COP / mes',
            '$30.000 – $100.000 COP / mes',
            'Más de $100.000 COP / mes',
            'Depende del valor que genere'
        ]
    },

    // ===== SECCIÓN 4 =====
    {
        id: 'q17',
        section: 'Decisión de compra',
        text: '¿Quién toma la decisión de adoptar una nueva herramienta en tu empresa?',
        type: 'radio',
        required: true,
        options: ['Yo mismo/a', 'En equipo', 'Otra persona'],
        inline: true
    },
    {
        id: 'q18',
        section: 'Decisión de compra',
        text: '¿Han pagado antes por algún software o herramienta de gestión?',
        type: 'radio',
        required: true,
        options: ['Sí, actualmente pagamos', 'Lo hemos hecho antes, ya no', 'No, solo herramientas gratuitas']
    },

    // ===== SECCIÓN 5 =====
    {
        id: 'q19',
        section: 'Cierre',
        text: 'Ciudad / región',
        type: 'text',
        required: false,
        placeholder: 'Ej. Cali, Bogotá, Medellín...'
    },
    {
        id: 'q20',
        section: 'Cierre',
        text: '¿Cómo llegaste a esta encuesta?',
        type: 'select',
        required: false,
        options: ['Instagram / redes sociales', 'Recomendación de alguien', 'WhatsApp', 'Evento / comunidad', 'Otro']
    }
];
