const API = 'http://192.168.1.28:3000';

let usuarioActual = null;
let proyectoActual = null;
let cambiosSinGuardar = false;

const opcionesEditor = {
  theme: "ace/theme/monokai",
  fontSize: "14px",
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
};

let editorHTML, editorCSS, editorJS, editorSnippet;

async function hacerPeticion(url, opciones = {}) {
    try {
        const respuesta = await fetch(`${API}${url}`, {
          headers: {
            'Content-Type': 'application/json',
            ...opciones.headers
          },
          ...opciones
        });
        
        const data = await respuesta.json();
        return { success: respuesta.ok, data, status: respuesta.status };
    } catch (error) {
        console.error('Error en petición:', error);
        return { success: false, error: error.message };
    }
}

// Cargar usuario y proyecto
document.addEventListener('DOMContentLoaded', async function() {
  const usuarioGuardado = localStorage.getItem('usuarioClouder');
  if (!usuarioGuardado) {
    alert('❌ Debes iniciar sesión primero');
    window.location.href = 'Login.html';
    return;
  }
  
  const datosUsuario = JSON.parse(usuarioGuardado);
  usuarioActual = datosUsuario.usuario || datosUsuario;

  const params = new URLSearchParams(window.location.search);
  const proyectoId = params.get('id');
  
  if (proyectoId) {
    await cargarProyecto(proyectoId);
  } else {
    establecerContenidoPorDefecto();
  }

  configurarEventosEditores();
  actualizarVistaPrevia();

  // Configurar event listeners para botones
  configurarBotones();
});

function configurarBotones() {
  const btnGuardar = document.getElementById("btn-guardar");
  if (btnGuardar) {
    btnGuardar.addEventListener('click', guardarProyecto);
  }
  
  const btnCambiarVista = document.getElementById("btn-cambiar-vista");
  if (btnCambiarVista) {
    btnCambiarVista.addEventListener('click', cambiarVista);
  }

  // Botón de regresar a gestión de archivos
  const btnRegresar = document.querySelector('button[onclick*="GestionArchivos"]');
  if (btnRegresar) {
    btnRegresar.addEventListener('click', () => {
      if (cambiosSinGuardar) {
        if (confirm('Tienes cambios sin guardar. ¿Deseas salir sin guardar?')) {
          window.location.href = '/frontend/html/GestionArchivos.html';
        }
      } else {
        window.location.href = '/frontend/html/GestionArchivos.html';
      }
    });
  }
}

// Cargar proyecto desde el backend
async function cargarProyecto(id) {
  try {
    const resultado = await hacerPeticion(`/archivos/${id}`);
    
    if (resultado.success) {
      proyectoActual = resultado.data;
      
      // Verificar permisos del usuario
      if (proyectoActual.propietario !== usuarioActual.numeroUsuario) {
        // Verificar si tiene permisos compartidos
        const tienePermiso = proyectoActual.compartido?.some(
          comp => comp.usuario === usuarioActual.numeroUsuario
        );
        
        if (!tienePermiso) {
          alert('❌ No tienes permisos para acceder a este archivo');
          window.location.href = 'GestionArchivos.html';
          return;
        }
      }
      
      // Configurar la interfaz según el tipo
      if (proyectoActual.tipo === 'proyecto') {
        configurarVistaProyecto();
        editorHTML.setValue(proyectoActual.codigoHTML || '', -1);
        editorCSS.setValue(proyectoActual.codigoCSS || '', -1);
        editorJS.setValue(proyectoActual.codigoJS || '', -1);
      } else if (proyectoActual.tipo === 'snippet') {
        configurarVistaSnippet();
        editorSnippet.setValue(proyectoActual.codigo || '', -1);
      }
      
      // Actualizar el título de la página
      document.title = `Cloudler Editor - ${proyectoActual.nombre}`;
      
      cambiosSinGuardar = false;
      actualizarBotonGuardar();
      actualizarVistaPrevia();
      
      console.log('Archivo cargado:', proyectoActual.nombre);
    } else {
      console.error('Error al cargar archivo:', resultado.data?.mensaje);
      alert('❌ Error al cargar el archivo: ' + (resultado.data?.mensaje || 'Error desconocido'));
      establecerContenidoPorDefecto();
    }
  } catch (error) {
    console.error('Error al cargar archivo:', error);
    establecerContenidoPorDefecto();
  }
}

function configurarVistaProyecto() {
  // Mostrar todos los editores para proyectos
  document.getElementById('contenedor-principal').innerHTML = `
    <section id="panel-vista-previa" class="panel-vista">
      <iframe id="iframe-previo" title="Vista previa"></iframe>
    </section>

    <section id="panel-editores" class="panel-codigo">
      <div class="editor-caja">
        <div class="encabezado-editor html">
          <i class="fa-brands fa-html5"></i> HTML
        </div>
        <div id="editor-html" class="area-editor"></div>
      </div>

      <div class="editor-caja">
        <div class="encabezado-editor css">
          <i class="fa-brands fa-css3-alt"></i> CSS
        </div>
        <div id="editor-css" class="area-editor"></div>
      </div>

      <div class="editor-caja">
        <div class="encabezado-editor js">
          <i class="fa-brands fa-js"></i> JS
        </div>
        <div id="editor-js" class="area-editor"></div>
      </div>
    </section>
  `;

  // Inicializar editores
  editorHTML = ace.edit("editor-html", { mode: "ace/mode/html", ...opcionesEditor });
  editorCSS = ace.edit("editor-css", { mode: "ace/mode/css", ...opcionesEditor });
  editorJS = ace.edit("editor-js", { mode: "ace/mode/javascript", ...opcionesEditor });
}

function configurarVistaSnippet() {
  // Mostrar solo un editor para snippets
  const modoEditor = obtenerModoEditor(proyectoActual.lenguaje);
  const iconoLenguaje = obtenerIconoLenguaje(proyectoActual.lenguaje);
  
  document.getElementById('contenedor-principal').innerHTML = `
    <section id="panel-snippet" class="panel-snippet" style="width: 100%; display: flex; flex-direction: column;">
      <div class="snippet-info" style="background: #2d3748; color: white; padding: 10px; display: flex; align-items: center; gap: 10px;">
        <span>${iconoLenguaje}</span>
        <h3>Snippet: ${proyectoActual.nombre} (${proyectoActual.lenguaje.toUpperCase()})</h3>
      </div>
      <div class="editor-caja" style="flex: 1;">
        <div id="editor-snippet" class="area-editor" style="height: 100%;"></div>
      </div>
    </section>
  `;

  // Inicializar editor de snippet
  editorSnippet = ace.edit("editor-snippet", { mode: modoEditor, ...opcionesEditor });
  
  // Ocultar vista previa para snippets
  const btnCambiarVista = document.getElementById("btn-cambiar-vista");
  if (btnCambiarVista) {
    btnCambiarVista.style.display = 'none';
  }
}

function obtenerModoEditor(lenguaje) {
  const modos = {
    html: "ace/mode/html",
    css: "ace/mode/css",
    javascript: "ace/mode/javascript",
    typescript: "ace/mode/typescript",
    python: "ace/mode/python",
    java: "ace/mode/java",
    php: "ace/mode/php",
    sql: "ace/mode/sql",
    otros: "ace/mode/text"
  };
  return modos[lenguaje] || "ace/mode/text";
}

function obtenerIconoLenguaje(lenguaje) {
  const iconos = {
    html: '<i class="fa-brands fa-html5" style="color: #e34c26;"></i>',
    css: '<i class="fa-brands fa-css3-alt" style="color: #1572b6;"></i>',
    javascript: '<i class="fa-brands fa-js-square" style="color: #f7df1e;"></i>',
    typescript: '<i class="fa-brands fa-js-square" style="color: #3178c6;"></i>',
    python: '<i class="fa-brands fa-python" style="color: #3776ab;"></i>',
    java: '<i class="fa-brands fa-java" style="color: #ed8b00;"></i>',
    php: '<i class="fa-brands fa-php" style="color: #777bb4;"></i>',
    sql: '<i class="fa-solid fa-database" style="color: #336791;"></i>',
    otros: '<i class="fa-solid fa-code" style="color: #6c757d;"></i>'
  };
  return iconos[lenguaje] || iconos.otros;
}

// Establecer contenido por defecto en los editores
function establecerContenidoPorDefecto() {
  configurarVistaProyecto();
  
  const htmlDefault = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
</head>
<body>
    <h1>¡Hola Mundo!</h1>
    <p>Este es mi proyecto web.</p>
    <button id="miBoton">Hacer clic</button>
</body>
</html>`;

  const cssDefault = `body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

h1 {
    color: #fff;
    text-align: center;
    font-size: 3rem;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

p {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 30px;
    opacity: 0.9;
}

#miBoton {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

#miBoton:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}`;

  const jsDefault = `console.log('¡Proyecto cargado correctamente!');

document.addEventListener('DOMContentLoaded', function() {
    const boton = document.getElementById('miBoton');
    
    boton.addEventListener('click', function() {
        alert('¡Botón clickeado! 🎉');
        console.log('Usuario hizo clic en el botón');
        
        // Cambiar el texto del botón
        if (this.textContent === 'Hacer clic') {
            this.textContent = '¡Clickeado!';
            this.style.background = '#4ecdc4';
        } else {
            this.textContent = 'Hacer clic';
            this.style.background = '#ff6b6b';
        }
    });
    
    // Mensaje de bienvenida
    setTimeout(() => {
        console.log('Bienvenido a tu editor de código en línea');
    }, 1000);
});`;

  editorHTML.setValue(htmlDefault, -1);
  editorCSS.setValue(cssDefault, -1);
  editorJS.setValue(jsDefault, -1);
}

function configurarEventosEditores() {
  // Detectar cambios en cualquier editor
  if (editorHTML) {
    editorHTML.session.on('change', () => {
      cambiosSinGuardar = true;
      actualizarVistaPrevia();
      actualizarBotonGuardar();
    });
  }

  if (editorCSS) {
    editorCSS.session.on('change', () => {
      cambiosSinGuardar = true;
      actualizarVistaPrevia();
      actualizarBotonGuardar();
    });
  }

  if (editorJS) {
    editorJS.session.on('change', () => {
      cambiosSinGuardar = true;
      actualizarVistaPrevia();
      actualizarBotonGuardar();
    });
  }

  if (editorSnippet) {
    editorSnippet.session.on('change', () => {
      cambiosSinGuardar = true;
      actualizarBotonGuardar();
    });
  }
}

function actualizarVistaPrevia() {
  // Solo actualizar vista previa para proyectos
  if (!editorHTML || !editorCSS || !editorJS) return;
  
  const iframe = document.getElementById("iframe-previo");
  if (!iframe) return;
  
  const html = editorHTML.getValue();
  const css = `<style>${editorCSS.getValue()}</style>`;
  const js = `<script>${editorJS.getValue()}<\/script>`;

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  
  doc.open();
  doc.write(html + css + js);
  doc.close();
}

function actualizarBotonGuardar() {
  const btnGuardar = document.getElementById("btn-guardar");
  if (!btnGuardar) return;
  
  if (cambiosSinGuardar) {
    btnGuardar.style.background = "#ff6b6b";
    btnGuardar.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Guardar *';
  } else {
    btnGuardar.style.background = "#4ecdc4";
    btnGuardar.innerHTML = '<i class="fa-solid fa-check"></i> Guardado';
  }
}

async function guardarProyecto() {
  if (!cambiosSinGuardar) {
    mostrarNotificacion('ℹ️ No hay cambios para guardar', 'info');
    return;
  }

  const btnGuardar = document.getElementById("btn-guardar");
  const textoOriginal = btnGuardar.innerHTML;
  
  btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  btnGuardar.disabled = true;

  try {
    let datosGuardar = {};
    
    if (proyectoActual && proyectoActual.tipo === 'proyecto') {
      datosGuardar = {
        codigoHTML: editorHTML.getValue(),
        codigoCSS: editorCSS.getValue(),
        codigoJS: editorJS.getValue()
      };
    } else if (proyectoActual && proyectoActual.tipo === 'snippet') {
      datosGuardar = {
        codigo: editorSnippet.getValue()
      };
    }

    let resultado;
    
    if (proyectoActual && proyectoActual._id) {
      // Actualizar archivo existente
      resultado = await hacerPeticion(`/archivos/actualizar/${proyectoActual._id}`, {
        method: 'PUT',
        body: JSON.stringify(datosGuardar)
      });
    } else {
      const nombreProyecto = prompt('Nombre del archivo:', 'Mi Nuevo Proyecto');
      if (!nombreProyecto) {
        btnGuardar.innerHTML = textoOriginal;
        btnGuardar.disabled = false;
        return;
      }

      resultado = await hacerPeticion('/archivos/crear', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombreProyecto,
          propietario: usuarioActual.numeroUsuario,
          carpetaPadre: null,
          tipo: 'proyecto',
          ...datosGuardar
        })
      });

      if (resultado.success) {
        proyectoActual = resultado.data;
        window.history.replaceState({}, '', `cajas.html?id=${proyectoActual._id}`);
      }
    }

    if (resultado.success) {
      cambiosSinGuardar = false;
      actualizarBotonGuardar();
      mostrarNotificacion('✅ Archivo guardado correctamente', 'success');
    } else {
      mostrarNotificacion('❌ Error al guardar: ' + (resultado.data?.mensaje || 'Error desconocido'), 'error');
    }
  } catch (error) {
    console.error('Error al guardar:', error);
    mostrarNotificacion('❌ Error de conexión al guardar', 'error');
  }

  btnGuardar.innerHTML = textoOriginal;
  btnGuardar.disabled = false;
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion ${tipo}`;
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  switch (tipo) {
    case 'success':
      notificacion.style.background = '#10B981';
      break;
    case 'error':
      notificacion.style.background = '#EF4444';
      break;
    default:
      notificacion.style.background = '#6B7280';
  }
  
  document.body.appendChild(notificacion);
  setTimeout(() => {
    notificacion.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    notificacion.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Función para cambiar vista (horizontal/vertical)
function cambiarVista() {
  const contenedor = document.getElementById('contenedor-principal');
  if (!contenedor) return;
  
  if (contenedor.classList.contains('vista-horizontal')) {
    contenedor.classList.remove('vista-horizontal');
    contenedor.classList.add('vista-vertical');
  } else {
    contenedor.classList.remove('vista-vertical');
    contenedor.classList.add('vista-horizontal');
  }
}