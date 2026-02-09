================================================================================
ENVÍO DE DATOS: Inscribir curso.html → Google Sheet
================================================================================

HOJA DE CÁLCULO DESTINO:
https://docs.google.com/spreadsheets/d/1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4/edit?gid=0#gid=0

FORMULARIO:
public/Inscribir curso.html (envía por POST a la URL del Apps Script)

--------------------------------------------------------------------------------
CÓDIGO COMPLETO PARA PEGAR EN APPS SCRIPT
--------------------------------------------------------------------------------
Copia desde la línea siguiente (/**) hasta el final del bloque (última llave })
y pégalo en script.google.com reemplazando el código por defecto.

--------------------------------------------------------------------------------

/**
 * APPS SCRIPT - INSCRIPCIÓN ESTÁTICA PARA INGENIEROS
 * Hoja: https://docs.google.com/spreadsheets/d/1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4/edit
 */

const ID_HOJA_ESTATICA = '1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4';
const NOMBRE_HOJA = 'Inscripciones';
const ZONA_HORARIA = 'America/Mexico_City';
const URL_PAGINA_INICIO = 'http://localhost:4321/';

const ENCABEZADOS = [
  'Apellido Paterno',
  'Apellido Materno',
  'Nombre',
  'Número de Control',
  'Correo Electrónico',
  'Fecha'
];

function doGet(e) {
  return respuestaJson({
    exito: true,
    mensaje: 'Script de inscripción Estática activo. Envía el formulario por POST.',
    hoja: 'https://docs.google.com/spreadsheets/d/' + ID_HOJA_ESTATICA + '/edit',
  });
}

function doPost(e) {
  try {
    var data = {};
    var devolverHtml = false;

    if (e.parameter) {
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

function formatoFecha(fecha) {
  return Utilities.formatDate(fecha, ZONA_HORARIA, 'dd/MM/yyyy HH:mm');
}

function respuestaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

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

--------------------------------------------------------------------------------
FIN DEL CÓDIGO — Copia todo el bloque de arriba (desde /** hasta }) y pégalo en Apps Script
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
PASOS PARA CONFIGURAR
--------------------------------------------------------------------------------

1. CREAR EL PROYECTO APPS SCRIPT
   - Ve a https://script.google.com
   - Clic en "Nuevo proyecto"
   - Borra el código por defecto (function myFunction...)
   - Copia el código de ESTE README (la sección "CÓDIGO COMPLETO" de arriba)
   - Pégalo en el editor de Apps Script
   - Guarda (Ctrl+S). Nombre del proyecto, por ejemplo: "Inscripción Estática"

2. PUBLICAR COMO APLICACIÓN WEB
   - Menú "Implementar" > "Nueva implementación"
   - En "Seleccionar tipo" elige "Aplicación web"
   - Descripción: "Inscripción Estática" (o la que quieras)
   - Ejecutar como: Yo (tu cuenta de Google)
   - Quién tiene acceso: Cualquier persona
   - Clic en "Implementar"
   - La primera vez te pedirá autorizar el acceso (Aceptar)
   - Copia la URL que aparece (termina en /exec)

3. PEGAR LA URL EN EL FORMULARIO HTML
   - En tu proyecto, abre: public/Inscribir curso.html
   - Busca la etiqueta <form ... action="...">
   - Sustituye el valor de action="..." por la URL que copiaste (la que termina en /exec)
   - Guarda el archivo

4. ESTRUCTURA DE LA HOJA
   - El script escribe en la hoja con ID: 1OmAylV7BLC7JZJdRVxPF_7BxhG-hAGvnpmnoR7vd0j4
   - Si creas una pestaña llamada "Inscripciones", se usará esa; si no, se usa la primera
   - La primera fila se rellena automáticamente con encabezados si la hoja está vacía:
     A: Apellido Paterno | B: Apellido Materno | C: Nombre
     D: Número de Control | E: Correo Electrónico | F: Fecha

5. PROBAR DESDE APPS SCRIPT (OPCIONAL)
   - En el editor de Apps Script, en el desplegable de funciones elige "probarInscripcion"
   - Clic en Ejecutar (▶)
   - Revisa la hoja de Google: debe aparecer una fila de prueba

--------------------------------------------------------------------------------
NOTA SOBRE file://
--------------------------------------------------------------------------------
El formulario Inscribir curso.html puede abrirse desde:
- file:///C:/.../Inscribir%20curso.html (archivo local), o
- Un servidor (por ejemplo http://localhost:4321/Inscribir%20curso.html con Astro)

En ambos casos, al enviar el formulario (POST) el navegador redirige a la URL del
script de Google; el script recibe los datos y los escribe en la hoja, y muestra
la página "Registro Exitoso".

================================================================================
