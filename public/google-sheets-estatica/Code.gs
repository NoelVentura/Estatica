/**
 * =============================================================================
 * APPS SCRIPT - INSCRIPCIÓN ESTÁTICA PARA INGENIEROS
 * =============================================================================
 *
 * Hoja de cálculo destino:
 * https://docs.google.com/spreadsheets/d/1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4/edit?gid=0#gid=0
 *
 * Formulario que envía los datos:
 * public/Inscribir curso.html (envía por POST a la URL /exec de este script)
 *
 * PASOS PARA USAR:
 * 1. Crear proyecto en Google Apps Script: script.google.com > Nuevo proyecto
 * 2. Pegar este código completo en Code.gs > Guardar
 * 3. Implementar > Nueva implementación > Tipo: Aplicación web
 * 4. Descripción: "Inscripción Estática" (o la que quieras)
 * 5. Ejecutar como: Yo | Quién tiene acceso: Cualquier persona > Implementar
 * 6. Copiar la URL del script (termina en /exec) y ponerla en el atributo
 *    action del <form> en Inscribir curso.html
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// CONFIGURACIÓN
// -----------------------------------------------------------------------------
const ID_HOJA_ESTATICA = '1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4';
const NOMBRE_HOJA = 'Inscripciones';  // Si no existe, se usa la primera hoja
const ZONA_HORARIA = 'America/Mexico_City';
// URL de la página de inicio. Tras "Registro Exitoso" se redirige aquí a los 2 segundos.
// - Con Astro en local: 'http://localhost:4321/' (ejecuta npm run dev y abre el formulario desde esa URL).
// - Con sitio en internet: 'https://tudominio.com/'
// Nota: desde script.google.com los enlaces a file:// suelen estar bloqueados; usa un servidor (npm run dev) o tu URL publicada.
const URL_PAGINA_INICIO = 'http://localhost:4321/';

// Estructura de columnas (fila 1 = encabezados, fila 2+ = datos):
// A = Apellido Paterno | B = Apellido Materno | C = Nombre
// D = Número de Control | E = Correo Electrónico | F = Fecha de envío

const ENCABEZADOS = [
  'Apellido Paterno',
  'Apellido Materno',
  'Nombre',
  'Número de Control',
  'Correo Electrónico',
  'Fecha'
];

// -----------------------------------------------------------------------------
// doGet: al abrir la URL en el navegador (GET)
// -----------------------------------------------------------------------------
function doGet(e) {
  return respuestaJson({
    exito: true,
    mensaje: 'Script de inscripción Estática activo. Envía el formulario por POST.',
    hoja: 'https://docs.google.com/spreadsheets/d/' + ID_HOJA_ESTATICA + '/edit',
  });
}

// -----------------------------------------------------------------------------
// doPost: recibe el envío del formulario (POST desde HTML o JSON)
// -----------------------------------------------------------------------------
function doPost(e) {
  try {
    var data = {};
    var devolverHtml = false;

    if (e.parameter) {
      // Formulario HTML (method POST, action = URL del script)
      data = {
        apellidoPaterno: (e.parameter.apellidoPaterno || '').toString().trim(),
        apellidoMaterno: (e.parameter.apellidoMaterno || '').toString().trim(),
        nombre: (e.parameter.nombre || '').toString().trim(),
        numeroControl: (e.parameter.numeroControl || '').toString().trim(),
        correo: (e.parameter.correo || '').toString().trim(),
        fecha: (e.parameter.fecha || formatoFecha(new Date())).toString().trim(),
      };
      devolverHtml = true;
    } else if (e.postData && e.postData.contents) {
      // Envío en JSON (fetch / XMLHttpRequest)
      data = JSON.parse(e.postData.contents);
      data.apellidoPaterno = (data.apellidoPaterno || '').toString().trim();
      data.apellidoMaterno = (data.apellidoMaterno || '').toString().trim();
      data.nombre = (data.nombre || '').toString().trim();
      data.numeroControl = (data.numeroControl || '').toString().trim();
      data.correo = (data.correo || '').toString().trim();
      data.fecha = (data.fecha || formatoFecha(new Date())).toString().trim();
    } else {
      return respuestaJson({ exito: false, error: 'No se recibieron datos' });
    }

    var ss = SpreadsheetApp.openById(ID_HOJA_ESTATICA);
    var sheet = ss.getSheetByName(NOMBRE_HOJA);
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    // Si la hoja está vacía, escribir encabezados en la fila 1
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(ENCABEZADOS);
    }

    var fila = [
      data.apellidoPaterno,
      data.apellidoMaterno,
      data.nombre,
      data.numeroControl,
      data.correo,
      data.fecha,
    ];
    sheet.appendRow(fila);

    if (devolverHtml) {
      return ContentService.createTextOutput(htmlExito()).setMimeType(ContentService.MimeType.HTML);
    }
    return respuestaJson({ exito: true, mensaje: 'Inscripción registrada.' });
  } catch (err) {
    return respuestaJson({ exito: false, error: 'Error al procesar la inscripción.' });
  }
}

// -----------------------------------------------------------------------------
// Página HTML de éxito (se muestra tras enviar el formulario)
// -----------------------------------------------------------------------------
function htmlExito() {
  var urlInicio = (URL_PAGINA_INICIO && URL_PAGINA_INICIO.trim()) ? URL_PAGINA_INICIO.trim() : '';
  var redirigir = urlInicio.length > 0;
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Registro Exitoso</title>';
  if (redirigir) {
    html += '<meta http-equiv="refresh" content="2;url=' + urlInicio + '">';
  }
  html += '<style>body{font-family:system-ui,sans-serif;max-width:480px;margin:3rem auto;padding:2rem;text-align:center;}h1{color:#047857;font-size:1.75rem;}p{color:#666;font-size:0.9rem;}a{display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;}</style></head><body><h1>Registro Exitoso</h1>';
  if (redirigir) {
    html += '<p>Redirigiendo a la página principal...</p><p><a href="' + urlInicio + '">Ir ahora</a></p>';
  } else {
    html += '<p><a href="javascript:history.back()">Volver</a></p>';
  }
  html += '</body></html>';
  return html;
}

// -----------------------------------------------------------------------------
// Utilidades
// -----------------------------------------------------------------------------
function formatoFecha(fecha) {
  return Utilities.formatDate(fecha, ZONA_HORARIA, 'dd/MM/yyyy HH:mm');
}

function respuestaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------------
// Opcional: escribir solo los encabezados en la hoja (ejecutar una vez desde el editor)
// -----------------------------------------------------------------------------
function escribirEncabezados() {
  var ss = SpreadsheetApp.openById(ID_HOJA_ESTATICA);
  var sheet = ss.getSheetByName(NOMBRE_HOJA) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ENCABEZADOS);
    Logger.log('Encabezados escritos en la primera fila.');
  } else {
    Logger.log('La hoja ya tiene datos. No se sobrescriben encabezados.');
  }
}

/**
 * Prueba desde el editor: selecciona "probarInscripcion" y ejecuta (▶).
 * Debe aparecer una fila de prueba en la hoja.
 */
function probarInscripcion() {
  var e = {
    postData: {
      contents: JSON.stringify({
        apellidoPaterno: 'Prueba',
        apellidoMaterno: 'Script',
        nombre: 'Prueba',
        numeroControl: '12345',
        correo: 'prueba@estatica.com',
        fecha: formatoFecha(new Date()),
      }),
    },
  };
  var result = doPost(e);
  Logger.log(result.getContent());
}
