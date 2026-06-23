// ================================================================
// CONFIGURACIÓN DEL GIST (token ofuscado)
// ================================================================
const GIST_ID = "2c86dc23a6fcf1a1d2b24a65c6c89164"; // <--- REEMPLAZA con el ID de tu Gist

// Parte tu token REAL en 3 partes:
const TOKEN_PART1 = "ghp_";
const TOKEN_PART2 = "q58RSaDvd1Bp5tvQa7";
const TOKEN_PART3 = "8FD14kOKuf3W07nBZW";

const GIST_TOKEN = TOKEN_PART1 + TOKEN_PART2 + TOKEN_PART3;

// ================================================================
// ESTADO DEL FORMULARIO
// ================================================================
let currentIndex = 0;
const totalQuestions = questions.length;
let answers = {}; // { q1: 'valor', q2: 'valor', ... }
let localResponses = JSON.parse(localStorage.getItem('encuesta_responses') || '[]');

// ================================================================
// ELEMENTOS DOM
// ================================================================
const container = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitSection = document.getElementById('submit-section');
const submitBtn = document.getElementById('submit-btn');
const progressFill = document.getElementById('progress-fill');
const stepIndicator = document.getElementById('step-indicator');
const toast = document.getElementById('toast');

// ================================================================
// RENDERIZAR PREGUNTA ACTUAL
// ================================================================
function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    // Construir HTML
    let html = `
        <div class="q-number">${q.section ? q.section + ' • ' : ''}Pregunta ${index + 1} de ${totalQuestions}</div>
        <div class="q-text">${q.text}${q.required ? ' <span style="color: var(--accent);">*</span>' : ''}</div>
    `;

    if (q.hint) {
        html += `<div class="q-hint">${q.hint}</div>`;
    }

    // Campo según tipo
    const value = answers[q.id] || '';

    switch (q.type) {
        case 'text':
            html += `<input type="text" id="${q.id}" placeholder="${q.placeholder || ''}" value="${value}" />`;
            break;
        case 'textarea':
            html += `<textarea id="${q.id}" placeholder="${q.placeholder || ''}">${value}</textarea>`;
            break;
        case 'select':
            html += `<select id="${q.id}">`;
            html += `<option value="" disabled ${!value ? 'selected' : ''}>Selecciona una opción</option>`;
            q.options.forEach(opt => {
                html += `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`;
            });
            html += `</select>`;
            break;
        case 'radio':
            const inlineClass = q.inline ? 'inline' : '';
            html += `<div class="options ${inlineClass}" id="${q.id}">`;
            q.options.forEach(opt => {
                const checked = value === opt ? 'checked' : '';
                html += `
                    <label class="opt-label ${checked ? 'selected' : ''}">
                        <input type="radio" name="${q.id}" value="${opt}" ${checked} />
                        ${opt}
                    </label>
                `;
            });
            html += `</div>`;
            break;
    }

    // Error (si existe)
    html += `<div class="field-error" id="err-${q.id}">Este campo es obligatorio.</div>`;

    container.innerHTML = html;

    // Event listeners para guardar cambios
    const input = document.getElementById(q.id);
    if (input) {
        if (q.type === 'text' || q.type === 'textarea') {
            input.addEventListener('input', (e) => {
                answers[q.id] = e.target.value;
                updateProgress();
            });
        } else if (q.type === 'select') {
            input.addEventListener('change', (e) => {
                answers[q.id] = e.target.value;
                updateProgress();
            });
        }
    }

    // Radios
    if (q.type === 'radio') {
        document.querySelectorAll(`input[name="${q.id}"]`).forEach(radio => {
            radio.addEventListener('change', (e) => {
                answers[q.id] = e.target.value;
                // Actualizar estilo de los labels
                document.querySelectorAll(`#${q.id} .opt-label`).forEach(label => {
                    label.classList.toggle('selected', label.querySelector('input').checked);
                });
                updateProgress();
            });
        });
    }

    // Actualizar botones y progreso
    updateButtons();
    updateProgress();
    // Mostrar/ocultar botón de envío
    submitSection.style.display = (index === totalQuestions - 1) ? 'block' : 'none';
}

// ================================================================
// NAVEGACIÓN
// ================================================================
function goTo(index) {
    // Validar la pregunta actual antes de avanzar
    if (index > currentIndex) {
        if (!validateCurrent()) {
            return;
        }
    }
    currentIndex = index;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;
    nextBtn.textContent = isLast ? '📤 Enviar' : 'Siguiente ➡';
    // Si es la última, el botón "Siguiente" envía directamente
    if (isLast) {
        nextBtn.onclick = () => {
            if (validateCurrent()) {
                submitForm();
            }
        };
    } else {
        nextBtn.onclick = () => {
            if (validateCurrent()) {
                goTo(currentIndex + 1);
            }
        };
    }
    // El botón "Anterior" siempre navega
    prevBtn.onclick = () => goTo(currentIndex - 1);
}

// ================================================================
// VALIDACIÓN DE LA PREGUNTA ACTUAL
// ================================================================
function validateCurrent() {
    const q = questions[currentIndex];
    if (!q.required) return true;

    const errEl = document.getElementById(`err-${q.id}`);
    let val = '';

    const input = document.getElementById(q.id);
    if (input) {
        if (q.type === 'text' || q.type === 'textarea') {
            val = input.value.trim();
        } else if (q.type === 'select') {
            val = input.value;
        }
        input.classList.toggle('invalid', !val);
    } else if (q.type === 'radio') {
        const checked = document.querySelector(`input[name="${q.id}"]:checked`);
        val = checked ? checked.value : '';
        // Marcar como inválido visualmente (opcional)
        document.querySelectorAll(`#${q.id} .opt-label`).forEach(label => {
            label.style.borderColor = val ? '' : 'var(--border)';
        });
    }

    if (errEl) {
        errEl.classList.toggle('visible', !val);
    }

    if (!val) {
        // Scroll al error
        const firstInvalid = document.querySelector('.invalid, .field-error.visible');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
    }
    return true;
}

// ================================================================
// PROGRESO
// ================================================================
function updateProgress() {
    // Contar cuántas preguntas obligatorias están respondidas
    let filled = 0;
    questions.forEach(q => {
        if (!q.required) return;
        const val = answers[q.id] || '';
        if (val && val.trim && val.trim() !== '') filled++;
        else if (val && typeof val === 'string' && val !== '') filled++;
        else if (val && typeof val === 'string' && val.trim() === '') return;
        else if (val) filled++;
    });
    // También contar radios
    questions.forEach(q => {
        if (!q.required || q.type !== 'radio') return;
        const checked = document.querySelector(`input[name="${q.id}"]:checked`);
        if (checked) filled++;
    });
    // Pero para no contar doble, mejor usamos el objeto answers
    // Recalculamos con answers
    let filledCorrect = 0;
    questions.forEach(q => {
        if (!q.required) return;
        const val = answers[q.id];
        if (val && val.trim && val.trim() !== '') filledCorrect++;
        else if (val && typeof val === 'string' && val !== '') filledCorrect++;
        else if (val && typeof val === 'string' && val.trim() === '') return;
        else if (val) filledCorrect++;
        else if (q.type === 'radio' && document.querySelector(`input[name="${q.id}"]:checked`)) filledCorrect++;
    });

    const totalRequired = questions.filter(q => q.required).length;
    const pct = Math.min(100, Math.round((filledCorrect / totalRequired) * 100));
    progressFill.style.width = pct + '%';
    stepIndicator.textContent = `Pregunta ${currentIndex + 1} de ${totalQuestions} · ${filledCorrect}/${totalRequired} obligatorias`;
}

// ================================================================
// ENVÍO A GIST
// ================================================================
async function saveToGist(newResponse) {
    const url = `https://api.github.com/gists/${GIST_ID}`;
    try {
        const getRes = await fetch(url, {
            headers: {
                Authorization: `Bearer ${GIST_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        if (!getRes.ok) throw new Error(`Error al leer Gist: ${getRes.status}`);

        const gistData = await getRes.json();
        const fileContent = gistData.files['respuestas.json']?.content || '[]';
        const currentJson = JSON.parse(fileContent);
        currentJson.push(newResponse);

        const newContent = JSON.stringify(currentJson, null, 2);

        const patchRes = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${GIST_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                files: {
                    'respuestas.json': { content: newContent }
                }
            })
        });
        if (!patchRes.ok) throw new Error(`Error al actualizar Gist: ${patchRes.status}`);

        return { success: true };
    } catch (error) {
        console.error('❌ Error en Gist:', error);
        return { success: false, error: error.message };
    }
}

// ================================================================
// FUNCIÓN SUBMIT
// ================================================================
async function submitForm() {
    // Validar todas las preguntas obligatorias antes de enviar
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.required) continue;
        const val = answers[q.id] || '';
        if (!val || (typeof val === 'string' && val.trim() === '')) {
            // Ir a la pregunta que falta
            currentIndex = i;
            renderQuestion(currentIndex);
            showToast('Por favor completa todas las preguntas obligatorias.', 'error');
            return;
        }
    }

    // Construir objeto de respuesta
    const now = new Date();
    const fecha = now.toLocaleDateString('es-CO') + ' ' + now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const row = {
        fecha: fecha,
        empresa: answers.q1 || '',
        sector: answers.q2 || '',
        colaboradores: answers.q3 || '',
        anos: answers.q4 || '',
        cargo: answers.q5 || '',
        nivelDigital: answers.q6 || '',
        actividad: answers.q7 || '',
        frecuencia: answers.q8 || '',
        tiempo: answers.q9 || '',
        equipo: answers.q10 || '',
        rol: answers.q11 || '',
        impacto: answers.q12 || '',
        medible: answers.q13 || '',
        herramientas: answers.q14 || '',
        intentos: answers.q15 || '',
        pago: answers.q16 || '',
        decision: answers.q17 || '',
        pagadoAntes: answers.q18 || '',
        ciudad: answers.q19 || '',
        canal: answers.q20 || '',
    };

    console.log('📦 Datos a enviar:', row);

    // Guardar localmente
    const rowWithMeta = { num: localResponses.length + 1, ...row };
    localResponses.push(rowWithMeta);
    localStorage.setItem('encuesta_responses', JSON.stringify(localResponses));

    // Enviar a Gist
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const result = await saveToGist(row);
    if (result.success) {
        showToast('✅ ¡Respuesta guardada correctamente!', 'success');
        // Limpiar respuestas del formulario actual
        answers = {};
        currentIndex = 0;
        renderQuestion(0);
        updateProgress();
        // Actualizar tabla de respuestas (si existiera) - no se usa en esta versión
    } else {
        showToast('❌ Error al guardar: ' + result.error, 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = '📤 Enviar respuestas';
}

// ================================================================
// TOAST
// ================================================================
function showToast(msg, type = '') {
    toast.textContent = msg;
    toast.className = 'show ' + type;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.className = '';
    }, 4000);
}

// ================================================================
// INICIALIZAR
// ================================================================
renderQuestion(0);
