const questions = [
    // ===== PREGUNTA 1 =====
    {
        id: 'q1',
        section: 'Datos generales',
        text: '¿Qué hace tu empresa?',
        type: 'select',
        required: true,
        options: [
            'Tecnología / Software',
            'Diseño / Creatividad',
            'Comercio / Retail',
            'Salud y Bienestar',
            'Estética y Belleza',
            'Alimentos y Bebidas',
            'Servicios Profesionales',
            'Manufactura / Producción',
            'Construcción / Inmobiliaria',
            'Otro'
        ],
        otherText: true // habilita campo de texto para "Otro"
    },
    // ===== PREGUNTA 2 =====
    {
        id: 'q2',
        section: 'Datos generales',
        text: '¿Cuál es tu cargo o rol dentro de la empresa?',
        type: 'text',
        required: true,
        placeholder: 'Ej. Fundador, Gerente, Director comercial...'
    },
    // ===== PREGUNTA 3 =====
    {
        id: 'q3',
        section: 'Datos generales',
        text: '¿Qué tan cómodo te sientes utilizando herramientas digitales?',
        type: 'radio',
        required: true,
        options: ['Poco cómodo', 'Moderadamente cómodo', 'Muy cómodo'],
        inline: true
    },
    // ===== PREGUNTA 4 =====
    {
        id: 'q4',
        section: 'Actividad que consume tiempo',
        text: '¿Cuál es la actividad que más tiempo te quita en tu semana laboral?',
        type: 'textarea',
        required: true,
        placeholder: 'Ej. Responder correos de clientes, hacer seguimiento de pagos...'
    },
    // ===== PREGUNTA 5 =====
    {
        id: 'q5',
        section: 'Actividad que consume tiempo',
        text: '¿Cuánto tiempo dedicas a esa actividad?',
        type: 'text',
        required: true,
        placeholder: 'Ej. 2 horas al día, 10 horas a la semana...'
    },
    // ===== PREGUNTA 6 =====
    {
        id: 'q6',
        section: 'Actividad que consume tiempo',
        text: '¿Con qué frecuencia realizas esa actividad?',
        type: 'radio',
        required: true,
        options: [
            'Varias veces al día',
            'Una vez al día',
            'Varias veces a la semana',
            'Una vez a la semana',
            'Una vez al mes'
        ]
    },
    // ===== PREGUNTA 7 =====
    {
        id: 'q7',
        section: 'Actividad que consume tiempo',
        text: '¿Esta actividad con quién la realizas?',
        type: 'radio',
        required: true,
        options: ['Solo/a', 'En equipo'],
        inline: true
    },
    // ===== PREGUNTA 8 =====
    {
        id: 'q8',
        section: 'Actividad que consume tiempo',
        text: '¿Qué impacto negativo tiene la no realización de esta actividad?',
        type: 'textarea',
        required: true,
        placeholder: 'Ej. Pérdida de clientes, retrasos en proyectos, estrés...'
    },
    // ===== PREGUNTA 9 =====
    {
        id: 'q9',
        section: 'Herramientas y mejoras',
        text: '¿Qué herramienta o método utilizas para hacer esa actividad?',
        type: 'textarea',
        required: true,
        placeholder: 'Ej. Excel, WhatsApp, papel, software específico...'
    },
    // ===== PREGUNTA 10 =====
    {
        id: 'q10',
        section: 'Herramientas y mejoras',
        text: '¿Has intentado optimizar esta actividad previamente? ¿qué pasó?',
        type: 'textarea',
        required: false,
        placeholder: 'Ej. Contraté a alguien, probé una herramienta, pero no funcionó...'
    }
];
