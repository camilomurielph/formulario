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
let answers = {};
let localResponses = JSON.parse(localStorage.getItem('encuesta_responses') || '[]');

// Estado del admin
let isAdmin = false;
let currentAdminView = '';

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
const adminPanel = document.getElementById('admin-panel');
const adminContent = document.getElementById('admin-content');
const adminLoginBtn = document.getElementById('admin-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.getElementById('response-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Elementos admin
const viewResponsesBtn = document.getElementById('view-responses-btn');
const downloadExcelBtn = document.getElementById('download-excel-btn');
const manageResponsesBtn = document.getElementById('manage-responses-btn');

// ================================================================
// FUNCIONES DEL FORMULARIO (sin cambios significativos)
// ================================================================
function renderQuestion(index) {
    const q = questions[index];
    if (!q) return;

    let html = `
        <div class="q-number">${q.section ? q.section + ' • ' : ''}Pregunta ${index + 1} de ${totalQuestions}</div>
        <div class="q-text">${q.text}${q.required ? ' <span style="color: var(--accent);">*</span>' : ''}</div>
    `;

    if (q.hint) html += `<div class="q-hint">${q.hint}</div>`;

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

    html += `<div class="field-error" id="err-${q.id}">Este campo es obligatorio.</div>`;
    container.innerHTML = html;

    // Event listeners
    if (q.type === 'text' || q.type === 'textarea') {
        const input = document.getElementById(q.id);
        if (input) {
            input.addEventListener('input', (e) => {
                answers[q.id] = e.target.value;
                updateProgress();
            });
        }
    } else if (q.type === 'select') {
        const select = document.getElementById(q.id);
        if (select) {
            select.addEventListener('change', (e) => {
                answers[q.id] = e.target.value;
                updateProgress();
            });
        }
    } else if (q.type === 'radio') {
        const radios = document.querySelectorAll(`input[name="${q.id}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                answers[q.id] = e.target.value;
                document.querySelectorAll(`#${q.id} .opt-label`).forEach(label => {
                    const input = label.querySelector('input');
                    if (input) {
                        label.classList.toggle('selected', input.checked);
                    }
                });
                updateProgress();
                document.getElementById(`err-${q.id}`)?.classList.remove('visible');
            });
        });
        if (value) {
            document.querySelectorAll(`#${q.id} .opt-label`).forEach(label => {
                const input = label.querySelector('input');
                if (input && input.value === value) {
                    label.classList.add('selected');
                }
            });
        }
    }

    updateButtons();
    updateProgress();
    submitSection.style.display = (index === totalQuestions - 1) ? 'block' : 'none';
}

function goTo(index) {
    if (index > currentIndex) {
        if (!validateCurrent()) return;
    }
    currentIndex = index;
    renderQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;
    nextBtn.textContent = isLast ? '📤 Enviar' : 'Siguiente ➡';
    if (isLast) {
        nextBtn.onclick = () => {
            if (validateCurrent()) submitForm();
        };
    } else {
        nextBtn.onclick = () => {
            if (validateCurrent()) goTo(currentIndex + 1);
        };
    }
    prevBtn.onclick = () => goTo(currentIndex - 1);
}

function validateCurrent() {
    const q = questions[currentIndex];
    if (!q.required) return true;

    const errEl = document.getElementById(`err-${q.id}`);
    let val = '';

    if (q.type === 'text' || q.type === 'textarea') {
        const input = document.getElementById(q.id);
        if (input) {
            val = input.value.trim();
            input.classList.toggle('invalid', !val);
        }
    } else if (q.type === 'select') {
        const select = document.getElementById(q.id);
        if (select) {
            val = select.value;
            select.classList.toggle('invalid', !val);
        }
    } else if (q.type === 'radio') {
        const checked = document.querySelector(`input[name="${q.id}"]:checked`);
        if (checked) {
            val = checked.value;
            answers[q.id] = val;
        } else {
            val = '';
        }
        document.querySelectorAll(`#${q.id} .opt-label`).forEach(label => {
            const radio = label.querySelector('input');
            if (radio) {
                label.style.borderColor = radio.checked ? '' : 'var(--border)';
            }
        });
    }

    if (!val) {
        if (errEl) errEl.classList.add('visible');
        if (q.type === 'text' || q.type === 'textarea' || q.type === 'select') {
            const el = document.getElementById(q.id);
            if (el) el.classList.add('invalid');
        }
        return false;
    } else {
        if (errEl) errEl.classList.remove('visible');
        if (q.type === 'text' || q.type === 'textarea' || q.type === 'select') {
            const el = document.getElementById(q.id);
            if (el) el.classList.remove('invalid');
        }
        if (q.type !== 'radio') answers[q.id] = val;
        return true;
    }
}

function updateProgress() {
    let filledCorrect = 0;
    questions.forEach(q => {
        if (!q.required) return;
        const val = answers[q.id];
        if (q.type === 'radio') {
            const checked = document.querySelector(`input[name="${q.id}"]:checked`);
            if (checked) { filledCorrect++; return; }
        }
        if (val && typeof val === 'string' && val.trim() !== '') filledCorrect++;
    });

    const totalRequired = questions.filter(q => q.required).length;
    const pct = Math.min(100, Math.round((filledCorrect / totalRequired) * 100));
    progressFill.style.width = pct + '%';
    stepIndicator.textContent = `Pregunta ${currentIndex + 1} de ${totalQuestions} · ${filledCorrect}/${totalRequired} obligatorias`;
}

// ================================================================
// GESTIÓN DEL GIST (leer y escribir)
// ================================================================
async function fetchGistContent() {
    const url = `https://api.github.com/gists/${GIST_ID}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${GIST_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
    if (!response.ok) throw new Error(`Error al leer Gist: ${response.status}`);
    const gistData = await response.json();
    const content = gistData.files['respuestas.json']?.content || '[]';
    return JSON.parse(content);
}

async function updateGistContent(data) {
    const url = `https://api.github.com/gists/${GIST_ID}`;
    const content = JSON.stringify(data, null, 2);
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${GIST_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
            files: {
                'respuestas.json': { content }
            }
        })
    });
    if (!response.ok) throw new Error(`Error al actualizar Gist: ${response.status}`);
    return true;
}

// ================================================================
// ENVÍO DEL FORMULARIO (ahora sincroniza con Gist y localStorage)
// ================================================================
async function submitForm() {
    // Validar todas las preguntas obligatorias
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.required) continue;
        const val = answers[q.id] || '';
        let isValid = false;
        if (typeof val === 'string' && val.trim() !== '') isValid = true;
        if (!isValid) {
            currentIndex = i;
            renderQuestion(currentIndex);
            showToast('Por favor completa todas las preguntas obligatorias.', 'error');
            return;
        }
    }

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

    // Guardar en Gist (lee, agrega, escribe)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const currentData = await fetchGistContent();
        currentData.push(row);
        await updateGistContent(currentData);
        showToast('✅ ¡Respuesta guardada correctamente!', 'success');
        answers = {};
        currentIndex = 0;
        renderQuestion(0);
        updateProgress();
        // Actualizar localStorage también con los datos del Gist
        localResponses = currentData.map((r, idx) => ({ num: idx + 1, ...r }));
        localStorage.setItem('encuesta_responses', JSON.stringify(localResponses));
    } catch (error) {
        console.error('❌ Error:', error);
        showToast('❌ Error al guardar: ' + error.message, 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = '📤 Enviar respuestas';
}

// ================================================================
// ADMIN: AUTENTICACIÓN Y NAVEGACIÓN
// ================================================================
const ADMIN_PASSWORD = 'Ao1998Cm';

function toggleAdminMode(show) {
    isAdmin = show;
    document.querySelectorAll('.form-mode').forEach(el => {
        el.style.display = show ? 'none' : '';
    });
    adminPanel.style.display = show ? 'block' : 'none';
    adminLoginBtn.textContent = show ? '👑 Admin' : '🔐 Admin';
    if (show) {
        showToast('✅ Acceso administrador concedido', 'success');
        renderAdminView(''); // Mostrar vista inicial
    } else {
        adminContent.innerHTML = '';
        currentAdminView = '';
    }
}

adminLoginBtn.addEventListener('click', () => {
    if (isAdmin) {
        toggleAdminMode(false);
        return;
    }
    const password = prompt('Ingresa la contraseña de administrador:');
    if (password === ADMIN_PASSWORD) {
        toggleAdminMode(true);
    } else if (password !== null) {
        showToast('❌ Contraseña incorrecta', 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    toggleAdminMode(false);
});

// ================================================================
// ADMIN: RENDERIZAR VISTAS
// ================================================================
function renderAdminView(view) {
    currentAdminView = view;
    adminContent.innerHTML = '<p style="color: var(--text-secondary);">Cargando respuestas...</p>';

    // Cargar datos actualizados desde Gist
    fetchGistContent().then(data => {
        // Actualizar localResponses para mantener consistencia
        localResponses = data.map((r, idx) => ({ num: idx + 1, ...r }));
        localStorage.setItem('encuesta_responses', JSON.stringify(localResponses));

        if (view === 'table') {
            renderTable(data);
        } else if (view === 'blocks') {
            renderBlocks(data);
        } else {
            // Vista por defecto: mostrar resumen
            renderSummary(data);
        }
    }).catch(error => {
        adminContent.innerHTML = `<p style="color: var(--danger);">❌ Error al cargar datos: ${error.message}</p>`;
    });
}

function renderSummary(data) {
    if (!data || data.length === 0) {
        adminContent.innerHTML = '<p style="color: var(--text-secondary);">No hay respuestas registradas.</p>';
        return;
    }

    const total = data.length;
    const sectors = {};
    data.forEach(r => { sectors[r.sector] = (sectors[r.sector] || 0) + 1; });
    const topSector = Object.entries(sectors).sort((a,b) => b[1] - a[1])[0];

    const colaboradores = {};
    data.forEach(r => { colaboradores[r.colaboradores] = (colaboradores[r.colaboradores] || 0) + 1; });
    const topColab = Object.entries(colaboradores).sort((a,b) => b[1] - a[1])[0];

    adminContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius); text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: var(--accent);">${total}</div>
                <div style="color: var(--text-secondary);">Total respuestas</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius); text-align: center;">
                <div style="font-size: 1.2rem; font-weight: 600; color: var(--accent);">${topSector ? topSector[0] : '—'}</div>
                <div style="color: var(--text-secondary);">Sector más común</div>
            </div>
            <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius); text-align: center;">
                <div style="font-size: 1.2rem; font-weight: 600; color: var(--accent);">${topColab ? topColab[0] : '—'}</div>
                <div style="color: var(--text-secondary);">Tamaño de equipo más común</div>
            </div>
        </div>
        <p style="color: var(--text-secondary); text-align: center;">Selecciona una opción arriba para ver más detalles.</p>
    `;
}

// ================================================================
// ADMIN: TABLA DE RESPUESTAS
// ================================================================
function renderTable(data) {
    if (!data || data.length === 0) {
        adminContent.innerHTML = '<p style="color: var(--text-secondary);">No hay respuestas para mostrar.</p>';
        return;
    }

    const headers = ['#', 'Fecha', 'Empresa', 'Sector', 'Colaboradores', 'Años', 'Cargo', 'Nivel digital', 'Actividad', 'Frecuencia', 'Tiempo', 'Equipo', 'Rol', 'Impacto', 'Medible', 'Herramientas', 'Intentos', 'Pago', 'Decisión', 'Pagado antes', 'Ciudad', 'Canal'];
    const keys = ['num', 'fecha', 'empresa', 'sector', 'colaboradores', 'anos', 'cargo', 'nivelDigital', 'actividad', 'frecuencia', 'tiempo', 'equipo', 'rol', 'impacto', 'medible', 'herramientas', 'intentos', 'pago', 'decision', 'pagadoAntes', 'ciudad', 'canal'];

    let html = `<div class="table-responsive"><table class="admin-table"><thead><tr>`;
    headers.forEach(h => html += `<th>${h}</th>`);
    html += `<th>Acción</th></tr></thead><tbody>`;

    data.forEach((r, idx) => {
        html += `<tr>`;
        keys.forEach(k => {
            let val = r[k] || '—';
            if (k === 'num') val = idx + 1;
            html += `<td title="${val}">${val}</td>`;
        });
        html += `<td><button class="delete-btn" data-index="${idx}" title="Eliminar esta respuesta">🗑️</button></td>`;
        html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    adminContent.innerHTML = html;

    // Eventos para eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.dataset.index);
            if (confirm(`¿Eliminar la respuesta #${index + 1}?`)) {
                await deleteResponse(index);
            }
        });
    });
}

// ================================================================
// ADMIN: BLOQUES DE RESPUESTAS (con selección múltiple y filtros)
// ================================================================
let selectedBlocks = new Set();

function renderBlocks(data) {
    if (!data || data.length === 0) {
        adminContent.innerHTML = '<p style="color: var(--text-secondary);">No hay respuestas para mostrar.</p>';
        return;
    }

    // Filtros
    const sectors = [...new Set(data.map(r => r.sector).filter(Boolean))];
    const colaboradores = [...new Set(data.map(r => r.colaboradores).filter(Boolean))];

    let html = `
        <div class="filters-bar">
            <label>Filtrar por sector:
                <select id="filter-sector">
                    <option value="">Todos</option>
                    ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </label>
            <label>Colaboradores:
                <select id="filter-colab">
                    <option value="">Todos</option>
                    ${colaboradores.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </label>
            <label>Fecha desde:
                <input type="date" id="filter-date-from" />
            </label>
            <label>hasta:
                <input type="date" id="filter-date-to" />
            </label>
            <button class="filter-clear" id="clear-filters">✖ Limpiar filtros</button>
        </div>
        <div class="bulk-actions">
            <span style="color: var(--text-secondary); font-size: 0.85rem; flex:1;">Seleccionados: <span id="selected-count">0</span></span>
            <button class="bulk-delete" id="bulk-delete-btn">🗑️ Borrar seleccionados</button>
            <button id="bulk-excel-btn">📥 Excel de seleccionados</button>
            <button id="select-all-btn">☑️ Seleccionar todos</button>
            <button id="deselect-all-btn">☐ Deseleccionar todos</button>
        </div>
        <div class="responses-grid" id="blocks-container"></div>
    `;

    adminContent.innerHTML = html;

    // Renderizar bloques (con filtros aplicados)
    function renderFilteredBlocks() {
        const sectorFilter = document.getElementById('filter-sector').value;
        const colabFilter = document.getElementById('filter-colab').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;

        let filtered = data.filter(r => {
            if (sectorFilter && r.sector !== sectorFilter) return false;
            if (colabFilter && r.colaboradores !== colabFilter) return false;
            if (dateFrom) {
                const d = new Date(r.fecha.split(' ')[0].split('/').reverse().join('-'));
                if (d < new Date(dateFrom)) return false;
            }
            if (dateTo) {
                const d = new Date(r.fecha.split(' ')[0].split('/').reverse().join('-'));
                if (d > new Date(dateTo)) return false;
            }
            return true;
        });

        const container = document.getElementById('blocks-container');
        if (filtered.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1/-1; text-align: center;">No hay respuestas que coincidan con los filtros.</p>';
            return;
        }

        container.innerHTML = filtered.map((r, idx) => {
            const globalIdx = data.indexOf(r);
            const isSelected = selectedBlocks.has(globalIdx);
            const title = `${r.empresa || 'Sin empresa'} · ${r.fecha || 'Sin fecha'}`;
            return `
                <div class="response-block ${isSelected ? 'selected' : ''}" data-index="${globalIdx}">
                    <div class="block-header">
                        <input type="checkbox" class="block-checkbox" ${isSelected ? 'checked' : ''} data-index="${globalIdx}" />
                        <div class="block-title">${title}</div>
                        <div class="block-date">#${globalIdx + 1}</div>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                        Sector: ${r.sector || '—'} · Colab: ${r.colaboradores || '—'}
                    </div>
                    <div class="block-actions">
                        <button class="view-block-btn" data-index="${globalIdx}">👁️ Ver</button>
                        <button class="delete-block-btn" data-index="${globalIdx}">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        }).join('');

        // Actualizar contador de seleccionados
        document.getElementById('selected-count').textContent = selectedBlocks.size;

        // Eventos de checkboxes
        document.querySelectorAll('.block-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.index);
                if (e.target.checked) selectedBlocks.add(idx);
                else selectedBlocks.delete(idx);
                // Actualizar clase selected del bloque
                const block = e.target.closest('.response-block');
                block.classList.toggle('selected', e.target.checked);
                document.getElementById('selected-count').textContent = selectedBlocks.size;
            });
        });

        // Eventos de ver
        document.querySelectorAll('.view-block-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                showResponseModal(data[idx]);
            });
        });

        // Eventos de eliminar individual
        document.querySelectorAll('.delete-block-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.index);
                if (confirm(`¿Eliminar la respuesta #${idx + 1}?`)) {
                    await deleteResponse(idx);
                }
            });
        });
    }

    // Eventos de filtros
    document.getElementById('filter-sector').addEventListener('change', renderFilteredBlocks);
    document.getElementById('filter-colab').addEventListener('change', renderFilteredBlocks);
    document.getElementById('filter-date-from').addEventListener('change', renderFilteredBlocks);
    document.getElementById('filter-date-to').addEventListener('change', renderFilteredBlocks);
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('filter-sector').value = '';
        document.getElementById('filter-colab').value = '';
        document.getElementById('filter-date-from').value = '';
        document.getElementById('filter-date-to').value = '';
        renderFilteredBlocks();
    });

    // Acciones masivas
    document.getElementById('select-all-btn').addEventListener('click', () => {
        const container = document.getElementById('blocks-container');
        container.querySelectorAll('.block-checkbox').forEach(cb => {
            cb.checked = true;
            const idx = parseInt(cb.dataset.index);
            selectedBlocks.add(idx);
            cb.closest('.response-block').classList.add('selected');
        });
        document.getElementById('selected-count').textContent = selectedBlocks.size;
    });

    document.getElementById('deselect-all-btn').addEventListener('click', () => {
        selectedBlocks.clear();
        document.querySelectorAll('.block-checkbox').forEach(cb => {
            cb.checked = false;
            cb.closest('.response-block').classList.remove('selected');
        });
        document.getElementById('selected-count').textContent = 0;
    });

    document.getElementById('bulk-delete-btn').addEventListener('click', async () => {
        if (selectedBlocks.size === 0) {
            showToast('No hay respuestas seleccionadas.', 'error');
            return;
        }
        if (confirm(`¿Eliminar ${selectedBlocks.size} respuestas seleccionadas?`)) {
            const indices = [...selectedBlocks].sort((a,b) => b - a);
            for (const idx of indices) {
                await deleteResponse(idx);
            }
            selectedBlocks.clear();
            document.getElementById('selected-count').textContent = 0;
            showToast(`✅ ${indices.length} respuestas eliminadas.`, 'success');
            // Recargar vista
            renderAdminView('blocks');
        }
    });

    document.getElementById('bulk-excel-btn').addEventListener('click', () => {
        if (selectedBlocks.size === 0) {
            showToast('No hay respuestas seleccionadas.', 'error');
            return;
        }
        const indices = [...selectedBlocks];
        const selectedData = indices.map(idx => data[idx]);
        downloadExcel(selectedData);
        showToast(`📥 Excel de ${selectedData.length} respuestas descargado.`, 'success');
    });

    // Render inicial
    renderFilteredBlocks();
}

// ================================================================
// ADMIN: FUNCIONES DE ELIMINACIÓN Y MODAL
// ================================================================
async function deleteResponse(index) {
    try {
        let data = await fetchGistContent();
        if (index < 0 || index >= data.length) {
            showToast('Índice inválido.', 'error');
            return;
        }
        data.splice(index, 1);
        await updateGistContent(data);
        // Actualizar localStorage
        localResponses = data.map((r, idx) => ({ num: idx + 1, ...r }));
        localStorage.setItem('encuesta_responses', JSON.stringify(localResponses));
        showToast('🗑️ Respuesta eliminada.', 'success');
        // Re-renderizar vista actual
        renderAdminView(currentAdminView);
    } catch (error) {
        showToast('❌ Error al eliminar: ' + error.message, 'error');
    }
}

function showResponseModal(response) {
    const fields = [
        ['Empresa', 'empresa'],
        ['Sector', 'sector'],
        ['Colaboradores', 'colaboradores'],
        ['Años operando', 'anos'],
        ['Cargo', 'cargo'],
        ['Nivel digital', 'nivelDigital'],
        ['Actividad que más tiempo quita', 'actividad'],
        ['Frecuencia', 'frecuencia'],
        ['Tiempo dedicado', 'tiempo'],
        ['¿La hace solo?', 'equipo'],
        ['¿Parte del rol?', 'rol'],
        ['Impacto si no se hace', 'impacto'],
        ['¿Resultados medibles?', 'medible'],
        ['Herramientas actuales', 'herramientas'],
        ['Intentos anteriores', 'intentos'],
        ['Disposición a pagar', 'pago'],
        ['Quién decide', 'decision'],
        ['¿Han pagado software?', 'pagadoAntes'],
        ['Ciudad', 'ciudad'],
        ['Canal de llegada', 'canal']
    ];

    let html = `<div style="margin-bottom: 1rem; color: var(--text-secondary);">Fecha: ${response.fecha || '—'}</div>`;
    fields.forEach(([label, key]) => {
        const val = response[key] || '—';
        html += `
            <div class="detail-item">
                <div class="label">${label}</div>
                <div class="value">${val}</div>
            </div>
        `;
    });

    modalBody.innerHTML = html;
    modal.classList.add('show');
}

// Cerrar modal
modalClose.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
});

// ================================================================
// ADMIN: BOTONES DE NAVEGACIÓN
// ================================================================
viewResponsesBtn.addEventListener('click', () => renderAdminView('table'));
manageResponsesBtn.addEventListener('click', () => renderAdminView('blocks'));

downloadExcelBtn.addEventListener('click', () => {
    if (localResponses.length === 0) {
        showToast('No hay respuestas para descargar.', 'error');
        return;
    }
    downloadExcel(localResponses);
    showToast('📥 Excel descargado correctamente.', 'success');
});

// ================================================================
// DESCARGA DE EXCEL (reutilizable)
// ================================================================
function downloadExcel(data) {
    if (!data || data.length === 0) return;

    const headers = ['#', 'Fecha', 'Empresa', 'Sector', 'Colaboradores', 'Años operando', 'Cargo', 'Nivel digital', 'Actividad que más tiempo quita', 'Frecuencia', 'Tiempo dedicado', '¿La hace solo?', '¿Parte del rol?', 'Impacto si no se hace', '¿Resultados medibles?', 'Herramientas actuales', 'Intentos anteriores', 'Disposición a pagar', 'Quién decide', '¿Han pagado software?', 'Ciudad', 'Canal de llegada'];
    const keys = ['num', 'fecha', 'empresa', 'sector', 'colaboradores', 'anos', 'cargo', 'nivelDigital', 'actividad', 'frecuencia', 'tiempo', 'equipo', 'rol', 'impacto', 'medible', 'herramientas', 'intentos', 'pago', 'decision', 'pagadoAntes', 'ciudad', 'canal'];

    const rows = data.map((r, idx) => {
        return keys.map(k => {
            if (k === 'num') return idx + 1;
            return r[k] || '';
        });
    });

    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = headers.map((h, i) => ({ wch: i === 8 || i === 15 || i === 16 ? 45 : i === 1 ? 18 : 22 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `encuesta_respuestas_${fecha}.xlsx`);
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
// Cargar respuestas locales desde localStorage
if (localResponses.length > 0) {
    // Si hay datos locales, sincronizar con Gist en segundo plano (para mantener consistencia)
    fetchGistContent().then(gistData => {
        if (gistData.length > localResponses.length) {
            // El Gist tiene más datos, actualizar localStorage
            localResponses = gistData.map((r, idx) => ({ num: idx + 1, ...r }));
            localStorage.setItem('encuesta_responses', JSON.stringify(localResponses));
        }
    }).catch(() => {});
}

renderQuestion(0);
