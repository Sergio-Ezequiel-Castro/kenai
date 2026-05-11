/* ══════════════════════════════════════════════════════════
   KENAI GARAGE — script.js
   Vanilla JavaScript | Sin frameworks | localStorage
   Autor: Sergio Castro | Prácticas Profesionales II
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. CLAVES localStorage
   ────────────────────────────────────────────────────────── */
const LS = {
  VEHICLE: 'kg_vehicle',   // datos del vehículo
  MAINTS:  'kg_maints',    // mantenimientos
  JOBS:    'kg_jobs',      // trabajos / herramientas
};

/* ──────────────────────────────────────────────────────────
   2. DATOS POR DEFECTO — Trabajos Hilux 1KD-FTV
   Se cargan la primera vez que se abre la app.
   ────────────────────────────────────────────────────────── */
const DEFAULT_JOBS = [
  {
    id: 'dj1',
    name: 'Distribución Hilux 1KD',
    desc: 'Reemplazo del kit de cadena de distribución. Incluye cadena, tensores y guías. Recomendado cada 200.000 km o ante ruidos metálicos al arranque. Trabajo de alta complejidad.',
    diff: 'dificil',
    tools: [
      'Llave combinada 10 mm',
      'Llave combinada 12 mm',
      'Llave combinada 14 mm',
      'Llave combinada 17 mm',
      'Llave de cubo 22 mm (polea cigüeñal)',
      'Torquímetro 0–100 Nm',
      'Extractor de poleas',
      'Cric hidráulico + caballetes',
      'Destornilladores plano y Phillips',
      'Pinza de presión (Grips)',
      'Juego de galgas',
    ],
  },
  {
    id: 'dj2',
    name: 'Cambio de aceite y filtro',
    desc: 'Cambio de aceite de motor + filtro. Usar 5W-30 sintético (6.5 L). Recomendado cada 5.000 km con mineral o 10.000 km con sintético.',
    diff: 'facil',
    tools: [
      'Llave 14 mm (tapón de cárter)',
      'Llave de filtro de aceite',
      'Recipiente recolector 8 L',
      'Bandeja de drenaje',
      'Guantes de nitrilo',
      'Trapo o papel absorbente',
    ],
  },
  {
    id: 'dj3',
    name: 'Frenos delanteros',
    desc: 'Cambio de pastillas y discos de freno delanteros. Verificar nivel de líquido de frenos. Imprescindible verificar estado de pinzas y mangueras.',
    diff: 'medio',
    tools: [
      'Llave 12 mm (pernos de pinza)',
      'Llave 17 mm (pernos de rueda)',
      'Torquímetro 80–120 Nm',
      'Cric hidráulico + caballetes',
      'Retractor de pistón de pinza',
      'Grasa de cobre anti-chirrido',
      'Pistola neumática o llave de ruedas',
    ],
  },
  {
    id: 'dj4',
    name: 'Cambio de filtros (aire / combustible / habitáculo)',
    desc: 'Reemplazo de los tres filtros. Mejora el rendimiento del motor y la calidad del aire interior. Trabajo sencillo, ideal para hacer junto al cambio de aceite.',
    diff: 'facil',
    tools: [
      'Destornillador plano',
      'Destornillador Phillips',
      'Llave 8 mm',
      'Trapo limpio',
    ],
  },
  {
    id: 'dj5',
    name: 'Suspensión delantera',
    desc: 'Revisión y reemplazo de amortiguadores, bujes y rótulas. Requiere alineación y balanceo posterior al trabajo.',
    diff: 'dificil',
    tools: [
      'Llave 17 mm / 19 mm',
      'Llave 21 mm / 22 mm',
      'Torquímetro 80–200 Nm',
      'Compresor de resortes',
      'Extractor de rótulas',
      'Cric hidráulico + caballetes',
      'Martillo de goma',
      'Pistola de impacto',
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   3. ESTADO GLOBAL
   ────────────────────────────────────────────────────────── */
const state = {
  vehicle:     {},       // Objeto con datos del vehículo
  maints:      [],       // Array de mantenimientos
  jobs:        [],       // Array de trabajos
  filter:      'all',   // Filtro activo en sección servicios
  editMaintId: null,    // ID del mantenimiento en edición
  editJobId:   null,    // ID del trabajo en edición
  detailId:    null,    // ID del detalle abierto
};

/* ──────────────────────────────────────────────────────────
   4. HELPERS LOCALSTORAGE
   ────────────────────────────────────────────────────────── */

/**
 * Guarda datos en localStorage como JSON.
 * @param {string} key  - Clave del almacenamiento
 * @param {*}      data - Datos a guardar
 */
function lsSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('[KG] Error guardando en localStorage:', e);
  }
}

/**
 * Carga y parsea datos de localStorage.
 * @param {string} key      - Clave del almacenamiento
 * @param {*}      fallback - Valor por defecto si no existe
 * @returns {*} Los datos parseados o el fallback
 */
function lsLoad(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('[KG] Error leyendo localStorage:', e);
    return fallback;
  }
}

/**
 * Genera un ID único usando timestamp + string aleatorio.
 * @returns {string} ID único
 */
function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* ──────────────────────────────────────────────────────────
   5. INICIALIZACIÓN DE LA APP
   ────────────────────────────────────────────────────────── */

/**
 * Carga todos los datos guardados e inicializa la interfaz.
 * Se llama al terminar el splash screen.
 */
function init() {
  // Cargar datos
  state.vehicle = lsLoad(LS.VEHICLE, {});
  state.maints  = lsLoad(LS.MAINTS,  []);

  // Si no hay trabajos guardados → usar los predefinidos
  const savedJobs = lsLoad(LS.JOBS, null);
  state.jobs = savedJobs !== null ? savedJobs : [...DEFAULT_JOBS];

  // Renderizar todas las vistas
  renderVehicleHero();
  renderVehicleForm();
  renderTechCard();
  renderDashboard();
  renderMaints();
  renderJobs();

  // Fecha de hoy como default en el modal de mantenimiento
  document.getElementById('m-date').value = todayISO();
}

/* ──────────────────────────────────────────────────────────
   6. RENDERIZADO — VEHÍCULO
   ────────────────────────────────────────────────────────── */

/** Actualiza la tarjeta hero del dashboard */
function renderVehicleHero() {
  const v = state.vehicle;

  el('vh-name').textContent    = v.model
    ? `${v.model}${v.year ? ' ' + v.year : ''}`
    : '— Sin configurar —';

  el('vh-engine').textContent  = v.engine || 'Configurá tu vehículo en "Mi Auto"';
  el('vh-km').textContent      = v.km ? fmtKm(v.km) : '—';
  el('vh-oil').textContent     = v.oil || '—';
  el('vh-torque').textContent  = v.torque || '—';

  // Subtítulo del header
  el('header-sub').textContent = v.model
    ? v.model
    : 'Mantenimiento automotriz';
}

/** Rellena el formulario de info del vehículo */
function renderVehicleForm() {
  const v = state.vehicle;
  const map = {
    'vf-model':  v.model,
    'vf-year':   v.year,
    'vf-engine': v.engine,
    'vf-km':     v.km,
    'vf-oil':    v.oil,
    'vf-oilcap': v.oilCap,
    'vf-torque': v.torque,
    'vf-notes':  v.notes,
  };
  Object.entries(map).forEach(([id, val]) => {
    el(id).value = val || '';
  });
}

/** Muestra/oculta la ficha técnica guardada */
function renderTechCard() {
  const v = state.vehicle;
  const card = el('tech-card');
  if (!v.model) { card.hidden = true; return; }

  const rows = [
    ['Modelo',         v.model],
    ['Año',            v.year],
    ['Motor',          v.engine],
    ['Kilometraje',    v.km ? fmtKm(v.km) + ' km' : null],
    ['Tipo de aceite', v.oil],
    ['Cap. aceite',    v.oilCap],
    ['Torque ruedas',  v.torque],
    ['Observaciones',  v.notes],
  ].filter(([, val]) => val);

  el('tech-body').innerHTML = rows
    .map(([k, val]) => `
      <div class="tech-row">
        <span class="tech-key">${k}</span>
        <span class="tech-val">${esc(val)}</span>
      </div>`)
    .join('');

  card.hidden = false;
}

/* ──────────────────────────────────────────────────────────
   7. RENDERIZADO — DASHBOARD
   ────────────────────────────────────────────────────────── */

/** Renderiza stats + upcoming + último registro */
function renderDashboard() {
  renderStats();
  renderUpcoming();
  renderLast();
}

/** Actualiza los contadores de resumen */
function renderStats() {
  const total  = state.maints.length;
  const done   = state.maints.filter(m => m.status === 'completado').length;
  const pend   = state.maints.filter(m => m.status === 'pendiente').length;
  const jobs   = state.jobs.length;

  el('st-total').textContent = total;
  el('st-done').textContent  = done;
  el('st-pend').textContent  = pend;
  el('st-jobs').textContent  = jobs;
}

/** Genera las alertas de próximos servicios */
function renderUpcoming() {
  const wrap   = el('upcoming-wrap');
  const badge  = el('upcoming-count');
  const curKm  = Number(state.vehicle.km) || 0;

  // Filtrar mantenimientos con "próximo km" definido
  const items = state.maints
    .filter(m => m.nextKm && Number(m.nextKm) > 0)
    .map(m => ({ ...m, diff: Number(m.nextKm) - curKm }))
    .filter(m => m.diff > -8000)   // incluir hasta 8000 km pasados
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);

  // Notif dot en header
  const urgent = items.filter(m => m.diff <= 1500).length;
  el('notif-dot').hidden = urgent === 0;

  badge.textContent = items.length;
  badge.style.display = items.length ? '' : 'none';

  if (!items.length) {
    wrap.innerHTML = `
      <div class="empty sm">
        <i class="fa-regular fa-calendar-check"></i>
        <p>Sin próximos servicios configurados.<br>Agregá un km objetivo en tus mantenimientos.</p>
      </div>`;
    return;
  }

  wrap.innerHTML = items.map(m => {
    const isUrgent = m.diff <= 1500;
    const diffTxt  = m.diff <= 0
      ? `¡Vencido hace ${fmtKm(Math.abs(m.diff))} km!`
      : `Faltan ${fmtKm(m.diff)} km`;

    return `
      <div class="upcoming-card${isUrgent ? ' urgent' : ''}">
        <div class="up-icon">
          <i class="fa-solid ${isUrgent ? 'fa-triangle-exclamation' : 'fa-clock'}"></i>
        </div>
        <div class="up-info">
          <div class="up-title">${esc(m.title)}</div>
          <div class="up-km">Próximo: ${fmtKm(m.nextKm)} km</div>
        </div>
        <div class="up-diff">${diffTxt}</div>
      </div>`;
  }).join('');
}

/** Muestra el último mantenimiento registrado */
function renderLast() {
  const wrap = el('last-wrap');
  if (!state.maints.length) {
    wrap.innerHTML = `
      <div class="empty sm">
        <i class="fa-regular fa-file-lines"></i>
        <p>Sin registros aún. Agregá tu primer mantenimiento.</p>
      </div>`;
    return;
  }

  const last = [...state.maints]
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  wrap.innerHTML = `
    <div class="last-maint-card" id="last-card" data-id="${last.id}">
      <div class="mc-row1">
        <div class="mc-title">${esc(last.title)}</div>
        <span class="status-pill ${last.status}">${statusTxt(last.status)}</span>
      </div>
      <div class="mc-meta">
        <span class="mc-meta-i"><i class="fa-regular fa-calendar"></i>${fmtDate(last.date)}</span>
        ${last.km ? `<span class="mc-meta-i"><i class="fa-solid fa-gauge-high"></i>${fmtKm(last.km)} km</span>` : ''}
      </div>
    </div>`;

  el('last-card').addEventListener('click', () => openDetail(last.id));
}

/* ──────────────────────────────────────────────────────────
   8. RENDERIZADO — MANTENIMIENTOS
   ────────────────────────────────────────────────────────── */

function renderMaints() {
  const wrap = el('maint-list');

  // Aplicar filtro de estado
  let list = state.filter === 'all'
    ? state.maints
    : state.maints.filter(m => m.status === state.filter);

  // Ordenar por fecha descendente (más reciente primero)
  list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!list.length) {
    const msg = state.filter === 'all'
      ? 'No hay mantenimientos registrados todavía.'
      : 'No hay registros con ese estado.';
    wrap.innerHTML = `
      <div class="empty">
        <i class="fa-solid fa-screwdriver-wrench"></i>
        <p>${msg}</p>
        ${state.filter === 'all'
          ? '<button class="btn-add" id="btn-first-maint"><i class="fa-solid fa-plus"></i> Agregar el primero</button>'
          : ''}
      </div>`;

    el('btn-first-maint')?.addEventListener('click', openNewMaint);
    return;
  }

  wrap.innerHTML = list.map(m => `
    <div class="maint-card ${m.status}" data-id="${m.id}">
      <div class="mc-row1">
        <div class="mc-title">${esc(m.title)}</div>
        <span class="status-pill ${m.status}">${statusTxt(m.status)}</span>
      </div>
      <div class="mc-meta">
        <span class="mc-meta-i">
          <i class="fa-regular fa-calendar"></i>${fmtDate(m.date)}
        </span>
        ${m.km   ? `<span class="mc-meta-i"><i class="fa-solid fa-gauge-high"></i>${fmtKm(m.km)} km</span>` : ''}
        ${m.cost ? `<span class="mc-meta-i"><i class="fa-solid fa-dollar-sign"></i>${fmtNum(m.cost)}</span>` : ''}
      </div>
    </div>`).join('');

  // Click en cada tarjeta → detalle
  wrap.querySelectorAll('.maint-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

/* ──────────────────────────────────────────────────────────
   9. RENDERIZADO — TRABAJOS / HERRAMIENTAS
   ────────────────────────────────────────────────────────── */

function renderJobs() {
  const wrap = el('jobs-list');

  if (!state.jobs.length) {
    wrap.innerHTML = `
      <div class="empty">
        <i class="fa-solid fa-toolbox"></i>
        <p>No hay trabajos configurados. Agregá uno con el botón "Trabajo".</p>
      </div>`;
    return;
  }

  const diffLabel = { facil: '🟢 Fácil', medio: '🟡 Medio', dificil: '🔴 Difícil' };

  wrap.innerHTML = state.jobs.map(job => {
    const toolRows = job.tools.map(t =>
      `<div class="tool-row"><i class="fa-solid fa-circle-dot"></i>${esc(t)}</div>`
    ).join('');

    return `
      <div class="job-card" data-jid="${job.id}">
        <div class="job-header">
          <div class="job-icon"><i class="fa-solid fa-toolbox"></i></div>
          <div class="job-info">
            <div class="job-name">${esc(job.name)}</div>
            <span class="diff-pill ${job.diff}">${diffLabel[job.diff] || job.diff}</span>
          </div>
          <i class="fa-solid fa-chevron-down job-toggle"></i>
        </div>
        <div class="job-body">
          ${job.desc ? `<p class="job-desc">${esc(job.desc)}</p>` : ''}
          <p class="tools-heading"><i class="fa-solid fa-wrench"></i> Herramientas (${job.tools.length})</p>
          <div class="tools-ul">${toolRows}</div>
          <div class="job-actions">
            <button class="btn-ghost btn-sm" data-action="edit-job" data-jid="${job.id}">
              <i class="fa-solid fa-pen"></i> Editar
            </button>
            <button class="btn-danger btn-sm" data-action="del-job" data-jid="${job.id}">
              <i class="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>`;
  }).join('');

  // Acordeón
  wrap.querySelectorAll('.job-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const card    = hdr.closest('.job-card');
      const wasOpen = card.classList.contains('open');
      wrap.querySelectorAll('.job-card').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });

  // Botones editar / eliminar
  wrap.querySelectorAll('[data-action="edit-job"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openEditJob(btn.dataset.jid);
    });
  });
  wrap.querySelectorAll('[data-action="del-job"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteJob(btn.dataset.jid);
    });
  });
}

/* ──────────────────────────────────────────────────────────
   10. MODALES
   ────────────────────────────────────────────────────────── */

/** Abre un modal. Bloquea el scroll del body. */
function openModal(id) {
  el(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Cierra un modal. Restaura scroll. */
function closeModal(id) {
  el(id).classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Modal: NUEVO Mantenimiento ── */
function openNewMaint() {
  state.editMaintId = null;
  el('modal-maint-title').textContent = 'Nuevo Mantenimiento';
  el('m-edit-id').value = '';
  // Limpiar campos
  ['m-title','m-desc','m-km','m-next-km','m-tools','m-cost'].forEach(id => el(id).value = '');
  el('m-date').value   = todayISO();
  el('m-status').value = 'completado';
  openModal('modal-maint');
}

/* ── Modal: EDITAR Mantenimiento ── */
function openEditMaint(id) {
  const m = state.maints.find(x => x.id === id);
  if (!m) return;

  state.editMaintId = id;
  el('modal-maint-title').textContent = 'Editar Mantenimiento';
  el('m-edit-id').value   = id;
  el('m-title').value     = m.title   || '';
  el('m-desc').value      = m.desc    || '';
  el('m-date').value      = m.date    || '';
  el('m-km').value        = m.km      || '';
  el('m-next-km').value   = m.nextKm  || '';
  el('m-status').value    = m.status  || 'completado';
  el('m-tools').value     = (m.tools || []).join(', ');
  el('m-cost').value      = m.cost    || '';

  closeModal('modal-detail');
  openModal('modal-maint');
}

/* ── Modal: DETALLE Mantenimiento ── */
function openDetail(id) {
  const m = state.maints.find(x => x.id === id);
  if (!m) return;
  state.detailId = id;
  el('modal-detail-title').textContent = m.title;

  const toolsHtml = m.tools?.length
    ? `<div class="tags-wrap">${m.tools.map(t =>
        `<span class="tag"><i class="fa-solid fa-screwdriver"></i>${esc(t)}</span>`
      ).join('')}</div>`
    : '<span style="color:var(--txt-muted);font-size:.8rem">Sin herramientas registradas</span>';

  el('detail-body').innerHTML = `
    <div class="detail-block">
      <div class="detail-lbl">Estado</div>
      <div class="detail-val">
        <span class="status-pill ${m.status}" style="display:inline-flex">${statusTxt(m.status)}</span>
      </div>
    </div>
    ${m.desc ? `
    <div class="detail-block">
      <div class="detail-lbl">Descripción</div>
      <div class="detail-val">${esc(m.desc)}</div>
    </div>` : ''}
    <div class="detail-block">
      <div class="detail-lbl">Fecha</div>
      <div class="detail-val">${fmtDate(m.date)}</div>
    </div>
    ${m.km ? `
    <div class="detail-block">
      <div class="detail-lbl">Kilometraje</div>
      <div class="detail-val">${fmtKm(m.km)} km</div>
    </div>` : ''}
    ${m.nextKm ? `
    <div class="detail-block">
      <div class="detail-lbl">Próximo servicio</div>
      <div class="detail-val">${fmtKm(m.nextKm)} km</div>
    </div>` : ''}
    ${m.cost ? `
    <div class="detail-block">
      <div class="detail-lbl">Costo</div>
      <div class="detail-val">$${fmtNum(m.cost)}</div>
    </div>` : ''}
    <div class="detail-block">
      <div class="detail-lbl">Herramientas</div>
      ${toolsHtml}
    </div>`;

  openModal('modal-detail');
}

/* ── Modal: NUEVO Trabajo ── */
function openNewJob() {
  state.editJobId = null;
  el('modal-job-title').textContent = 'Nuevo Trabajo';
  el('j-edit-id').value = '';
  ['j-name','j-desc','j-tools'].forEach(id => el(id).value = '');
  el('j-diff').value = 'medio';
  openModal('modal-job');
}

/* ── Modal: EDITAR Trabajo ── */
function openEditJob(id) {
  const job = state.jobs.find(j => j.id === id);
  if (!job) return;
  state.editJobId = id;
  el('modal-job-title').textContent = 'Editar Trabajo';
  el('j-edit-id').value = id;
  el('j-name').value    = job.name  || '';
  el('j-desc').value    = job.desc  || '';
  el('j-diff').value    = job.diff  || 'medio';
  el('j-tools').value   = (job.tools || []).join('\n');
  openModal('modal-job');
}

/* ──────────────────────────────────────────────────────────
   11. GUARDAR DATOS
   ────────────────────────────────────────────────────────── */

/** Guarda un mantenimiento (nuevo o edición) */
function saveMaint() {
  const title = el('m-title').value.trim();
  if (!title) { toast('El título es obligatorio', 'error'); return; }

  const date = el('m-date').value;
  if (!date)  { toast('La fecha es obligatoria', 'error'); return; }

  // Herramientas: separadas por coma
  const tools = el('m-tools').value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  const maint = {
    id:        state.editMaintId || uid(),
    title,
    desc:      el('m-desc').value.trim(),
    date,
    km:        el('m-km').value      || '',
    nextKm:    el('m-next-km').value || '',
    status:    el('m-status').value,
    tools,
    cost:      el('m-cost').value    || '',
    updatedAt: new Date().toISOString(),
  };

  if (state.editMaintId) {
    // Editar existente
    const idx = state.maints.findIndex(m => m.id === state.editMaintId);
    if (idx !== -1) state.maints[idx] = { ...state.maints[idx], ...maint };
    toast('Mantenimiento actualizado', 'success');
  } else {
    // Nuevo
    maint.createdAt = new Date().toISOString();
    state.maints.unshift(maint);
    toast('Mantenimiento guardado', 'success');
  }

  lsSave(LS.MAINTS, state.maints);
  closeModal('modal-maint');
  renderMaints();
  renderDashboard();
}

/** Guarda un trabajo mecánico (nuevo o edición) */
function saveJob() {
  const name = el('j-name').value.trim();
  if (!name) { toast('El nombre del trabajo es obligatorio', 'error'); return; }

  const toolsRaw = el('j-tools').value.trim();
  if (!toolsRaw) { toast('Agregá al menos una herramienta', 'error'); return; }

  const tools = toolsRaw.split('\n').map(t => t.trim()).filter(Boolean);

  const job = {
    id:   state.editJobId || uid(),
    name,
    desc: el('j-desc').value.trim(),
    diff: el('j-diff').value,
    tools,
  };

  if (state.editJobId) {
    const idx = state.jobs.findIndex(j => j.id === state.editJobId);
    if (idx !== -1) state.jobs[idx] = job;
    toast('Trabajo actualizado', 'success');
  } else {
    state.jobs.push(job);
    toast('Trabajo guardado', 'success');
  }

  lsSave(LS.JOBS, state.jobs);
  closeModal('modal-job');
  renderJobs();
  renderStats();
}

/** Guarda los datos del vehículo */
function saveVehicle() {
  state.vehicle = {
    model:  el('vf-model').value.trim(),
    year:   el('vf-year').value,
    engine: el('vf-engine').value.trim(),
    km:     el('vf-km').value,
    oil:    el('vf-oil').value.trim(),
    oilCap: el('vf-oilcap').value.trim(),
    torque: el('vf-torque').value.trim(),
    notes:  el('vf-notes').value.trim(),
  };
  lsSave(LS.VEHICLE, state.vehicle);
  renderVehicleHero();
  renderTechCard();
  renderDashboard();
  toast('Vehículo guardado correctamente ✓', 'success');
}

/* ──────────────────────────────────────────────────────────
   12. ELIMINAR DATOS
   ────────────────────────────────────────────────────────── */

function deleteMaint(id) {
  if (!confirm('¿Eliminás este mantenimiento? No se puede deshacer.')) return;
  state.maints = state.maints.filter(m => m.id !== id);
  lsSave(LS.MAINTS, state.maints);
  closeModal('modal-detail');
  renderMaints();
  renderDashboard();
  toast('Mantenimiento eliminado', 'info');
}

function deleteJob(id) {
  if (!confirm('¿Eliminás este trabajo? No se puede deshacer.')) return;
  state.jobs = state.jobs.filter(j => j.id !== id);
  lsSave(LS.JOBS, state.jobs);
  renderJobs();
  renderStats();
  toast('Trabajo eliminado', 'info');
}

/* ──────────────────────────────────────────────────────────
   13. NAVEGACIÓN
   ────────────────────────────────────────────────────────── */

/**
 * Navega a una sección de la app.
 * @param {string} name - Nombre de la sección (home | maint | tools | info)
 */
function goTo(name) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  el(`sec-${name}`)?.classList.add('active');
  document.querySelector(`.nav-btn[data-sec="${name}"]`)?.classList.add('active');

  el('app-main').scrollTop = 0;
}

/* ──────────────────────────────────────────────────────────
   14. FILTROS DE MANTENIMIENTOS
   ────────────────────────────────────────────────────────── */

function setFilter(f) {
  state.filter = f;
  document.querySelectorAll('.fpill').forEach(p => {
    p.classList.toggle('active', p.dataset.f === f);
  });
  renderMaints();
}

/* ──────────────────────────────────────────────────────────
   15. TOAST NOTIFICATIONS
   ────────────────────────────────────────────────────────── */

const TOAST_ICONS = {
  success: 'fa-circle-check',
  error:   'fa-circle-xmark',
  info:    'fa-circle-info',
  warn:    'fa-triangle-exclamation',
};

/**
 * Muestra una notificación temporal.
 * @param {string} msg  - Mensaje a mostrar
 * @param {'success'|'error'|'info'|'warn'} type - Tipo de toast
 * @param {number} ms   - Duración en milisegundos
 */
function toast(msg, type = 'info', ms = 3000) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid ${TOAST_ICONS[type] || TOAST_ICONS.info}"></i><span>${msg}</span>`;
  el('toasts').appendChild(t);

  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

/* ──────────────────────────────────────────────────────────
   16. UTILIDADES
   ────────────────────────────────────────────────────────── */

/** Acceso rápido a un elemento por ID. */
const el = id => document.getElementById(id);

/**
 * Escapa caracteres HTML para prevenir XSS.
 * Siempre usá esto antes de insertar texto del usuario en el DOM.
 */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a texto legible en español argentino.
 * @param {string} dateStr - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
}

/**
 * Formatea un número de kilómetros con separador de miles.
 * @param {number|string} km
 * @returns {string}
 */
function fmtKm(km) {
  return Number(km).toLocaleString('es-AR');
}

/**
 * Formatea un número con separador de miles.
 * @param {number|string} n
 * @returns {string}
 */
function fmtNum(n) {
  return Number(n).toLocaleString('es-AR');
}

/**
 * Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD).
 * @returns {string}
 */
function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Devuelve el texto descriptivo de un estado de mantenimiento.
 * @param {string} status
 * @returns {string}
 */
function statusTxt(status) {
  return { completado: '✅ Completado', pendiente: '⏳ Pendiente', 'en-proceso': '🔧 En proceso' }[status] || status;
}

/* ──────────────────────────────────────────────────────────
   17. EVENT LISTENERS — Toda la interactividad de la UI
   ────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* Navegación inferior */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.sec));
  });

  /* Botones de agregar */
  el('btn-new-maint')?.addEventListener('click', openNewMaint);
  el('btn-new-job')?.addEventListener('click', openNewJob);

  /* Cerrar modales — botones con data-close */
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  /* Cerrar modal al tocar el overlay (fuera del sheet) */
  document.querySelectorAll('.modal-wrap').forEach(wrap => {
    wrap.addEventListener('click', e => {
      if (e.target === wrap) closeModal(wrap.id);
    });
  });

  /* Guardar mantenimiento */
  el('btn-save-maint')?.addEventListener('click', saveMaint);

  /* Guardar trabajo */
  el('btn-save-job')?.addEventListener('click', saveJob);

  /* Guardar vehículo */
  el('btn-save-veh')?.addEventListener('click', saveVehicle);

  /* Detalle: editar */
  el('btn-detail-edit')?.addEventListener('click', () => {
    if (state.detailId) openEditMaint(state.detailId);
  });

  /* Detalle: eliminar */
  el('btn-detail-del')?.addEventListener('click', () => {
    if (state.detailId) deleteMaint(state.detailId);
  });

  /* Filtros de mantenimientos */
  document.querySelectorAll('.fpill').forEach(pill => {
    pill.addEventListener('click', () => setFilter(pill.dataset.f));
  });

  /* Hero del vehículo → ir a Mi Auto */
  el('vehicle-hero')?.addEventListener('click', () => goTo('info'));
  el('vehicle-hero')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo('info'); }
  });

  /* Campana de notificaciones → ir a inicio */
  el('btn-notif')?.addEventListener('click', () => {
    goTo('home');
    toast('Revisá los próximos servicios', 'warn');
  });

  /* Enter en campo título del modal → guardar directamente */
  el('m-title')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveMaint();
  });

  /* ── SPLASH SCREEN ──────────────────────── */
  setTimeout(() => {
    const splash = el('splash');
    const app    = el('app');

    // Inicializar antes de mostrar la app
    init();

    // Animación de salida del splash
    splash.classList.add('out');

    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display    = 'flex';

      // Fade in de la app
      app.style.opacity   = '0';
      requestAnimationFrame(() => {
        app.style.transition = 'opacity 0.4s ease';
        app.style.opacity    = '1';
      });
    }, 500);

  }, 1600); // Duración del splash: 1.6 segundos

}); // DOMContentLoaded

/* ──────────────────────────────────────────────────────────
   18. DETECCIÓN DE CONECTIVIDAD
   (útil para futura versión con sincronización en la nube)
   ────────────────────────────────────────────────────────── */
window.addEventListener('online',  () => toast('Conexión restaurada', 'success'));
window.addEventListener('offline', () => toast('Sin conexión — la app sigue funcionando', 'warn'));
