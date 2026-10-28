import type { SiteContent, Treatment } from './types'

const t = (
  slug: string,
  name: string,
  category: string,
  duration: string,
  description: string,
  benefits: string[],
  badge = '',
  featured = false,
): Treatment => ({
  slug,
  name,
  category,
  duration,
  description,
  badge,
  image: `/img/tratamientos/${slug}.jpg`,
  benefits,
  price: 'Valoración previa',
  featured,
})

const TOX = 'Toxina Botulínica'
const VAS = 'Vascular'
const AH = 'Ácido Hialurónico'
const REG = 'Regenerativa y Calidad de Piel'
const CAP = 'Capilar'
const PESO = 'Control de Peso'
const CORP = 'Corporal y Láser'
const PROC = 'Procedimientos Médicos'
const VAL = 'Valoración'

export const defaultContent: SiteContent = {
  brand: {
    name: 'Dra. Nallely',
    nameAccent: 'Mellado',
    tagline: 'Medicina Estética y Longevidad',
    logoImage: '',
    logoHeight: 44,
    favicon: '',
    seoTitle: 'Dra. Nallely Mellado | Medicina Estética y Longevidad en Saltillo',
    seoDescription:
      'Medicina estética y longevidad en San Isidro, Saltillo. Tratamientos faciales y corporales mínimamente invasivos con rigor médico y trato humano.',
  },
  theme: {
    background: '#FAF8F5',
    foreground: '#141416',
    card: '#FFFFFF',
    accent: '#8A6D45',
    accentLight: '#C2A77F',
    muted: '#F2EDE6',
    border: '#E8E1D6',
    dark: '#141416',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    radius: 1.5,
  },
  contact: {
    phone: '+528120799186',
    phoneDisplay: '+52 81 2079 9186',
    whatsapp: '528120799186',
    whatsappMessage: 'Hola Dra. Nallely Mellado, quisiera información sobre sus tratamientos',
    email: '',
    address: 'Blvrd. Rufino Tamayo 120-3, San Isidro, C.P. 25254',
    city: 'Saltillo, Coahuila',
    mapQuery: 'Blvrd Rufino Tamayo 120-3 San Isidro Saltillo Coahuila',
    mapEmbedUrl: '',
    hoursShort: 'Lun–Vie 10:00–19:00 · Sáb 10:00–15:00',
    hoursLong: 'Lunes a viernes 10:00–19:00 · Sábado 10:00–15:00 · Domingo cerrado',
    catalogUrl: 'https://heyzine.com/flip-book/4396176a23.html',
    instagram: '',
    facebook: '',
  },
  hero: {
    eyebrow: 'Medicina estética de alta precisión · Saltillo, Coahuila',
    titleBefore: 'Tu belleza natural,',
    titleAccent: 'realzada',
    titleAfter: 'con ciencia y arte.',
    description:
      'Soy la **Dra. Nallely Mellado**. Diseño tratamientos faciales y corporales mínimamente invasivos para que te veas descansada, luminosa y siempre como tú.',
    image: '/img/dra-nallely.png',
    imageAlt: 'Dra. Nallely Mellado en su consultorio',
    badge: 'Médico certificado',
    locationEyebrow: 'San Isidro, Saltillo',
    locationTitle: 'Un espacio privado para tu armonía facial',
    primaryCta: 'Agendar mi valoración',
    secondaryCta: 'Ver tratamientos',
    stats: [
      { value: '34+', label: 'Tratamientos' },
      { value: '100%', label: 'Personalizado' },
      { value: '4.9', label: 'Satisfacción' },
    ],
  },
  pillars: {
    eyebrow: 'Filosofía de atención',
    title: 'Pilares de nuestra excelencia médica',
    items: [
      {
        title: 'Atención personalizada',
        text: 'Valoración individual y sin prisas. Cada rostro y cada objetivo recibe un plan diseñado a la medida.',
      },
      {
        title: 'Seguridad médica',
        text: 'Criterio médico ético, protocolos rigurosos e insumos certificados con trazabilidad.',
      },
      {
        title: 'Vanguardia',
        text: 'Bioestimuladores, exosomas, PDRN y tecnología láser para resultados naturales y duraderos.',
      },
      {
        title: 'Seguimiento continuo',
        text: 'Te acompañamos antes, durante y después de cada sesión para cuidar tu evolución.',
      },
    ],
  },
  treatmentsSection: {
    eyebrow: 'Catálogo médico',
    title: 'Tratamientos diseñados a tu medida',
    ctaLabel: 'Ver los 34 tratamientos',
    description:
      'Tratamientos mínimamente invasivos para realzar tu belleza, restaurar la armonía y cuidar la salud de tu piel. Todos requieren valoración previa.',
  },
  categories: [TOX, VAS, AH, REG, CAP, PESO, CORP, PROC, VAL],
  treatments: [
    t('baby-botox', 'Baby Botox', TOX, '30 min', 'Microdosis de toxina botulínica para prevenir arrugas con un resultado fresco y natural.', ['Ayuda a prevenir arrugas y líneas de expresión', 'Mejora la apariencia de la piel', 'Aporta mayor firmeza y textura', 'Resultado natural, sin rigidez'], 'Más solicitado', true),
    t('botox-full-face', 'Botox Full Face', TOX, '45 min', 'Rejuvenecimiento integral del rostro que reduce arrugas y combate la flacidez sin cirugía.', ['Suaviza frente, entrecejo y patas de gallo', 'Efecto lifting sutil', 'Mirada descansada', 'Sin tiempo de recuperación'], '', true),
    t('hiperhidrosis', 'Hiperhidrosis', TOX, '40 min', 'Control de la sudoración excesiva en axilas, manos o pies con toxina botulínica.', ['Reduce la sudoración hasta por meses', 'Procedimiento rápido', 'Mejora tu confianza diaria']),
    t('migrana-con-botox', 'Migraña con Botox', TOX, '40 min', 'Protocolo médico con toxina botulínica para disminuir la frecuencia e intensidad de la migraña crónica.', ['Menos episodios de dolor', 'Protocolo médico avalado', 'Mejora tu calidad de vida']),
    t('correccion-paralisis-facial', 'Corrección de Parálisis Facial', TOX, '45 min', 'Aplicación médica para mejorar la simetría del rostro en secuelas de parálisis facial.', ['Mejora la simetría facial', 'Plan médico individual', 'Resultados progresivos']),
    t('escleroterapia', 'Escleroterapia', VAS, '45 min', 'Eliminación de várices y arañitas vasculares aplicando medicamento directamente en las venas a tratar.', ['Elimina arañitas vasculares', 'Alivia pesadez y cansancio', 'Mínimamente invasivo', 'Retomas tus actividades el mismo día'], 'Eliminación de várices', true),
    t('rinomodelacion', 'Rinomodelación', AH, '45 min', 'Perfilado de nariz sin cirugía con ácido hialurónico: corto, indoloro y reversible.', ['Perfil armónico sin cirugía', 'Resultados inmediatos', 'Procedimiento reversible'], 'Resultados inmediatos', true),
    t('aumento-de-labios', 'Aumento de Labios', AH, '45 min', 'Volumen, definición e hidratación de labios con ácido hialurónico.', ['Volumen natural', 'Contorno definido', 'Hidratación profunda'], '', true),
    t('aumento-de-pomulo', 'Aumento de Pómulo', AH, '45 min', 'Define y eleva los pómulos para rejuvenecer y armonizar el tercio medio del rostro.', ['Efecto lifting', 'Rostro más definido', 'Resultado inmediato']),
    t('aumento-de-menton', 'Aumento de Mentón', AH, '45 min', 'Proyección del mentón para equilibrar las proporciones del rostro.', ['Mejora el perfil', 'Equilibra proporciones', 'Sin cirugía']),
    t('perfilamiento-facial', 'Perfilamiento Facial', AH, '60 min', 'Define contornos faciales como pómulos, mandíbula o labios mientras hidrata y fortalece la piel.', ['Contornos definidos', 'Hidratación', 'Resultado armónico']),
    t('armonizacion-facial', 'Armonización Facial', AH, '75 min', 'Plan integral para restaurar volumen y equilibrio en pómulos, labios, sienes y mentón.', ['Plan integral a tu medida', 'Restaura volumen perdido', 'Equilibrio y proporción', 'Resultados naturales'], 'Tratamiento insignia', true),
    t('correccion-arrugas-escote', 'Corrección de Arrugas en Escote e Imperfecciones', AH, '45 min', 'El ácido hialurónico rellena líneas finas del escote y estimula colágeno para una piel más firme.', ['Piel más firme', 'Atenúa líneas finas', 'Estimula colágeno']),
    t('aumento-de-gluteos', 'Aumento de Glúteos', AH, '90 min', 'Volumen y firmeza en glúteos sin cirugía, con tratamiento personalizado.', ['Volumen y firmeza', 'Sin cirugía', 'Plan personalizado']),
    t('rejuvenecimiento-de-manos', 'Rejuvenecimiento de Manos', AH, '45 min', 'Restaura volumen y vitalidad en el dorso de las manos.', ['Manos con aspecto joven', 'Disimula venas y tendones', 'Hidratación']),
    t('skinfill-bacio', 'SkinFill Bacio', AH, '40 min', 'Hidratación y definición de labios con fórmula enriquecida con vitamina B12.', ['Labios hidratados', 'Definición sutil', 'Fórmula con vitamina B12']),
    t('exosomas-factores-de-crecimiento', 'Exosomas y Factores de Crecimiento', REG, '60 min', 'Terapia regenerativa que calma, repara y renueva la piel desde el nivel celular.', ['Regeneración celular', 'Piel más luminosa', 'Mejora textura y tono'], 'Regenerativo'),
    t('melasma-acne-post-acne', 'Tratamiento para Melasma, Acné y Post-acné', REG, '60 min', 'Protocolos médicos para manchas, acné activo y marcas residuales.', ['Unifica el tono', 'Controla el acné', 'Atenúa marcas']),
    t('peelings-faciales', 'Peelings Faciales', REG, '45 min', 'Exfoliación médica que unifica el tono y mejora la textura de la piel.', ['Tono uniforme', 'Textura suave', 'Renovación celular']),
    t('hollywood-peel', 'Hollywood Peel', REG, '40 min', 'Láser de carbón para una piel luminosa, tersa y con poros refinados al instante.', ['Luminosidad inmediata', 'Poros refinados', 'Sin tiempo de recuperación']),
    t('bioestimuladores', 'Bioestimuladores Facial y Corporal', REG, '60 min', 'Estimulan tu propio colágeno para un efecto lifting sin agregar volumen.', ['Estimula colágeno propio', 'Efecto lifting progresivo', 'Resultados duraderos']),
    t('pdrn-esperma-de-salmon', 'Esperma de Salmón (PDRN)', REG, '45 min', 'Polinucleótidos que reparan tejidos, hidratan y unifican el tono de la piel.', ['Repara tejidos', 'Hidratación profunda', 'Unifica el tono']),
    t('skin-care', 'Skin Care', REG, '60 min', 'Limpieza e hidratación profunda para una piel sana, elástica y luminosa.', ['Limpieza profunda', 'Hidratación', 'Piel luminosa']),
    t('estimulacion-capilar', 'Estimulación Capilar', CAP, '45 min', 'Bioestimulación del folículo para frenar la caída y fortalecer el cabello.', ['Frena la caída', 'Fortalece el cabello', 'Estimula el folículo']),
    t('tirzepatida', 'Pérdida de Peso con Tirzepatida', PESO, '30 min', 'Programa médico de control de peso con inyección de tirzepatida.', ['Supervisión médica', 'Control del apetito', 'Resultados sostenibles'], 'Supervisión médica'),
    t('retatrutide', 'Retatrutide', PESO, '30 min', 'Protocolo médico para reducción significativa de peso corporal.', ['Protocolo médico', 'Reducción de peso significativa', 'Seguimiento continuo']),
    t('lipoenzimas', 'Lipoenzimas Faciales y Corporales', CORP, '45 min', 'Enzimas que disuelven grasa localizada en abdomen, brazos, papada y muslos.', ['Reduce grasa localizada', 'Define el contorno', 'Sin cirugía']),
    t('radiofrecuencia-cavitacion', 'Radiofrecuencia, Cavitación y Ultrasonido', CORP, '60 min', 'Tecnología no invasiva para eliminar grasa localizada y celulitis.', ['Reduce celulitis', 'Reafirma la piel', 'No invasivo']),
    t('laser-blanqueamiento-corporal', 'Láser Blanqueamiento Corporal', CORP, '45 min', 'Despigmentación de áreas íntimas y zonas oscuras sin dolor.', ['Unifica el tono', 'Sin dolor', 'Resultados progresivos']),
    t('retiro-de-tatuajes', 'Retiro de Tatuajes', CORP, '45 min', 'Láser que descompone el pigmento para que tu cuerpo lo elimine de forma natural.', ['Elimina pigmento', 'Tecnología láser', 'Sesiones personalizadas']),
    t('depilacion-laser', 'Depilación Láser', CORP, '45 min', 'Eliminación definitiva del vello al actuar sobre el folículo piloso.', ['Resultados duraderos', 'Piel suave', 'Adiós a irritaciones']),
    t('retiro-de-lesiones', 'Retiro de Lesiones (Lunares, Verrugas, Mezquinos)', PROC, '40 min', 'Eliminación de imperfecciones en rostro, cuello, manos y cuerpo.', ['Procedimiento rápido', 'Mínima marca', 'Criterio médico']),
    t('inyeccion-intraarticular', 'Inyección Intraarticular', PROC, '30 min', 'Tratamiento para artrosis que reduce el dolor y mejora la movilidad.', ['Reduce el dolor', 'Mejora la movilidad', 'Procedimiento ambulatorio']),
    t('valoracion-medica', 'Consulta de Valoración', VAL, '30 min', 'Evaluación médica personalizada para diseñar tu plan de tratamiento ideal.', ['Evaluación completa', 'Plan personalizado', 'Presupuesto a tu medida'], 'Primer paso'),
  ],
  results: {
    eyebrow: 'Resultados reales',
    title: 'Antes y después',
    description:
      'Cambios sutiles y armónicos que respetan tu identidad. Pacientes reales de la Dra. Nallely Mellado.',
    disclaimer: 'Imágenes publicadas con autorización. Los resultados pueden variar en cada paciente.',
    items: [
      { title: 'Rejuvenecimiento facial', text: 'Bioestimulación y toxina botulínica para una mirada descansada y una piel más firme.', image: '/img/antes-despues-1.jpg' },
      { title: 'Rejuvenecimiento masculino', text: 'Atenuación de líneas de expresión respetando los rasgos naturales.', image: '/img/antes-despues-2.jpg' },
      { title: 'Armonización facial', text: 'Restauración de volumen y contorno con ácido hialurónico.', image: '/img/antes-despues-3.jpg' },
      { title: 'Rinomodelación', text: 'Perfil nasal definido sin cirugía, con resultados inmediatos.', image: '/img/rinomodelacion.jpg' },
    ],
  },
  vascular: {
    enabled: true,
    eyebrow: 'Escleroterapia',
    titleBefore: 'Piernas ligeras,',
    titleAccent: 'sin várices',
    description:
      'Tratamiento mínimamente invasivo que elimina várices y arañitas vasculares. Mejora el aspecto de tus piernas y alivia pesadez, dolor, ardor y cansancio.',
    video: '/video/varices.mp4',
    image: '/img/tratamientos/escleroterapia.jpg',
    ctaLabel: 'Agendar escleroterapia',
    treatmentSlug: 'escleroterapia',
  },
  steps: {
    eyebrow: 'Tu bienestar paso a paso',
    title: 'Tu experiencia en 4 pasos',
    ctaLabel: 'Comenzar ahora',
    items: [
      { title: 'Conoce', text: 'Explora los tratamientos o escríbenos por WhatsApp para resolver tus dudas.' },
      { title: 'Agenda', text: 'Elige tratamiento, fecha y horario en línea. Recibes tu folio al instante.' },
      { title: 'Valoración y tratamiento', text: 'La Dra. Nallely evalúa tu caso y realiza el procedimiento con precisión.' },
      { title: 'Seguimiento', text: 'Revisión de resultados y cuidados posteriores para mantener tu mejor versión.' },
    ],
  },
  about: {
    eyebrow: 'Sobre la doctora',
    title: 'Dedicación médica, enfoque natural y pasión por la armonía',
    quote: 'Donde hay amor por la medicina, hay amor por la humanidad y la belleza.',
    text: 'La Dra. Nallely Mellado es médico cirujano dedicada a la medicina estética y la longevidad. Su misión es ayudarte a encontrar el equilibrio entre lo estético y lo funcional, priorizando siempre tu salud.',
    image: '/img/dra-nallely.png',
    credentials: [
      'Médico cirujano certificado',
      'Medicina estética y longevidad',
      'Protocolos de toxina y rellenos',
      'Medicina regenerativa y láser',
    ],
  },
  testimonials: {
    eyebrow: 'Testimonios',
    title: 'La voz de quienes confiaron en nosotros',
    items: [
      { quote: 'Resultados súper naturales. La doctora te explica todo con paciencia y te sientes en confianza desde el primer momento.', name: 'Mariana G.', treatment: 'Armonización facial', rating: 5 },
      { quote: 'Me veo descansado, no diferente. Excelente trato, puntualidad y un consultorio impecable.', name: 'Carlos R.', treatment: 'Botox full face', rating: 5 },
      { quote: 'Tenía miedo y fue rapidísimo. El cambio en mi perfil es increíble y sin cirugía. ¡La recomiendo muchísimo!', name: 'Sofía M.', treatment: 'Rinomodelación', rating: 5 },
    ],
  },
  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Resolvemos tus dudas',
    description: '¿No encuentras tu respuesta? Escríbenos y te atendemos personalmente.',
    items: [
      { q: '¿Qué incluye la consulta de valoración?', a: 'Una evaluación médica completa de tu rostro o zona a tratar, historial clínico, resolución de dudas y un plan de tratamiento con presupuesto personalizado. Todos los tratamientos requieren valoración previa.' },
      { q: '¿Los tratamientos duelen?', a: 'La mayoría son mínimamente invasivos. Utilizamos anestesia tópica y técnicas de alta precisión para que tu experiencia sea cómoda.' },
      { q: '¿Cuánto tiempo de recuperación necesito?', a: 'En la mayoría de los procedimientos puedes retomar tus actividades el mismo día. Durante la valoración te explicamos los cuidados específicos de tu tratamiento.' },
      { q: '¿Los productos están certificados?', a: 'Sí. Trabajamos con insumos de grado médico con registro sanitario vigente, trazabilidad y almacenamiento adecuado.' },
      { q: '¿Cómo agendo, cambio o cancelo mi cita?', a: 'Agenda en línea en 4 pasos y recibirás un folio. Con tu folio y teléfono puedes consultar o cancelar tu cita en la sección «Mi cita», o escribirnos por WhatsApp para reprogramar.' },
      { q: '¿Qué formas de pago aceptan?', a: 'Efectivo, transferencia y tarjetas de débito y crédito. Pregunta por facilidades de pago en tu valoración.' },
    ],
  },
  location: { eyebrow: 'Ubicación', title: 'Visítanos en San Isidro, Saltillo' },
  cta: {
    eyebrow: 'Inicia tu transformación',
    title: 'Da el siguiente paso hacia tu mejor versión',
    description: 'Agenda tu consulta de valoración y diseñemos juntas un plan a la altura de tus expectativas.',
  },
  footer: {
    description:
      'Medicina estética y longevidad en San Isidro, Saltillo. Tratamientos faciales y corporales mínimamente invasivos con rigor médico y trato humano.',
    legalNote: 'Práctica médica regulada conforme a la legislación de salud de Coahuila, México.',
  },
  booking: {
    eyebrow: 'Reserva en línea',
    title: 'Agenda tu cita en 4 pasos',
    formTitle: 'Tus datos de contacto',
    formSubtitle: 'Solo lo necesario para confirmar tu cita. Tu historial médico lo revisamos en consulta, en persona.',
    privacyText: 'Acepto el aviso de privacidad y el uso de mis datos para gestionar mi cita.',
    pendingNote: 'Tu cita queda pendiente de confirmación. Te contactaremos por WhatsApp para confirmarla.',
    successTitle: '¡Listo! Recibimos tu solicitud',
    successText: 'Guarda tu folio. Te contactaremos por WhatsApp para confirmar tu cita.',
    slotMinutes: 30,
    maxDaysAhead: 60,
    schedule: [
      { open: false, start: '10:00', end: '15:00' },
      { open: true, start: '10:00', end: '19:00' },
      { open: true, start: '10:00', end: '19:00' },
      { open: true, start: '10:00', end: '19:00' },
      { open: true, start: '10:00', end: '19:00' },
      { open: true, start: '10:00', end: '19:00' },
      { open: true, start: '10:00', end: '15:00' },
    ],
    fields: [
      { id: 'name', label: 'Nombre completo', type: 'text', required: true, placeholder: '', help: '', options: [] },
      { id: 'phone', label: 'WhatsApp / Teléfono', type: 'tel', required: true, placeholder: '844 123 4567', help: '', options: [] },
      { id: 'email', label: 'Correo electrónico', type: 'email', required: false, placeholder: '', help: '', options: [] },
      { id: 'firstVisit', label: '¿Es tu primera visita?', type: 'choice', required: false, placeholder: '', help: '', options: ['Sí', 'No, ya soy paciente'] },
      { id: 'goal', label: '¿Qué te gustaría mejorar? (opcional)', type: 'textarea', required: false, placeholder: 'Por ejemplo: líneas de expresión en la frente', help: 'No es necesario incluir información médica; la revisamos en tu valoración.', options: [] },
    ],
  },
  legal: [
    {
      slug: 'aviso-de-privacidad',
      title: 'Aviso de privacidad',
      intro:
        'Dra. Nallely Mellado, con domicilio en Blvrd. Rufino Tamayo 120-3, San Isidro, C.P. 25254 · Saltillo, Coahuila, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
      body: `## Datos que recabamos
- Al agendar en línea: nombre, teléfono, correo electrónico (opcional) y el motivo de tu consulta. No solicitamos datos de salud en línea.
- En consulta presencial, para integrar tu expediente clínico: fecha de nacimiento y datos sensibles de salud (alergias, medicamentos, antecedentes y fotografías clínicas), que se recaban con tu consentimiento expreso y por escrito.

## Finalidades
- Agendar, confirmar y dar seguimiento a tus citas.
- Integrar tu expediente clínico y brindarte atención médica.
- Enviarte recordatorios e indicaciones pre y post tratamiento.

## Derechos ARCO
Puedes solicitar el acceso, rectificación, cancelación u oposición al uso de tus datos escribiendo al WhatsApp +52 81 2079 9186. Responderemos en un plazo máximo de 20 días hábiles.

## Transferencias
Tus datos no se comparten con terceros, salvo obligación legal o autoridades sanitarias competentes.`,
      updated: 'septiembre 2026',
    },
    {
      slug: 'terminos',
      title: 'Términos y condiciones',
      intro: 'Al agendar una cita aceptas las siguientes condiciones de servicio.',
      body: `## Citas
Las citas agendadas en línea quedan pendientes hasta ser confirmadas por nuestro equipo. Te pedimos llegar 10 minutos antes.

## Cancelaciones
Puedes cancelar desde «Mi cita» o por WhatsApp con al menos 24 horas de anticipación. Las inasistencias sin aviso podrán requerir anticipo para futuras citas.

## Precios
Los tratamientos requieren valoración previa; el costo final depende del plan personalizado, zona y cantidad de producto.

## Resultados
Los resultados varían en cada paciente. Las imágenes de antes y después son ilustrativas y se publican con autorización.`,
      updated: 'septiembre 2026',
    },
    {
      slug: 'consentimiento',
      title: 'Consentimiento informado',
      intro:
        'Antes de cualquier procedimiento, la Dra. Nallely Mellado te explicará en consulta el tratamiento, beneficios, alternativas, riesgos y cuidados posteriores, y firmarás un consentimiento informado específico.',
      body: `## Posibles efectos transitorios
- Enrojecimiento, inflamación leve o hematomas en la zona tratada.
- Sensibilidad o molestia temporal.
- Asimetrías transitorias durante el periodo de integración del producto.

## Compromisos del paciente
- Informar con veracidad antecedentes médicos, alergias y medicamentos.
- Seguir las indicaciones pre y post tratamiento.
- Acudir a las revisiones de seguimiento indicadas.`,
      updated: 'septiembre 2026',
    },
  ],
}
