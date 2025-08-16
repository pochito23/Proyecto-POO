const API_BASE = 'http://localhost:3000';

// Variables globales
let usuarioActual = null;
let proyectoActual = null;
let cambiosSinGuardar = false;

// Configuración de los editores
const opcionesEditor = {
  theme: "ace/theme/monokai",
  fontSize: "14px",
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
};

const editorHTML = ace.edit("editor-html", { mode: "ace/mode/html", ...opcionesEditor });
const editorCSS = ace.edit("editor-css", { mode: "ace/mode/css", ...opcionesEditor });
const editorJS = ace.edit("editor-js", { mode: "ace/mode/javascript", ...opcionesEditor });

// Función para hacer peticiones a la API
async function hacerPeticion(url, opciones = {}) {
    const respuesta = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers
      },
      ...opciones
    });
    
    const data = await respuesta.json();
    return { success: respuesta.ok, data, status: respuesta.status };

}

// Cargar usuario y proyecto
document.addEventListener('DOMContentLoaded', async function() {
  // Verificar usuario logueado
  const usuarioGuardado = localStorage.getItem('usuarioCloudler');
  if (!usuarioGuardado) {
    alert('❌ Debes iniciar sesión primero');
    window.location.href = 'Login.html';
    return;
  }
  usuarioActual = JSON.parse(usuarioGuardado);

  // Obtener ID del proyecto desde URL
  const params = new URLSearchParams(window.location.search);
  const proyectoId = params.get('id');
  
  if (proyectoId) {
    await cargarProyecto(proyectoId);
  } else {
    establecerContenidoPorDefecto();
  }

  // Configurar eventos de los editores
  configurarEventosEditores();
  
  // Actualizar vista previa inicial
  actualizarVistaPrevia();
});

// Cargar proyecto desde el backend
async function cargarProyecto(id) {
  // En este caso, necesitarías un endpoint específico para obtener un archivo por ID
  // Como no está en tu backend actual, simularemos con los datos que ya tienes
  
  // Por ahora, establecer contenido por defecto
  // TODO: Implementar endpoint GET /archivos/:id
  establecerContenidoPorDefecto();
  proyectoActual = { _id: id };
  
  console.log('Cargando proyecto:', id);
}

// Establecer contenido por defecto en los editores
function establecerContenidoPorDefecto() {
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
  editorHTML.session.on('change', () => {
    cambiosSinGuardar = true;
    actualizarVistaPrevia();
    actualizarBotonGuardar();
  });

  editorCSS.session.on('change', () => {
    cambiosSinGuardar = true;
    actualizarVistaPrevia();
    actualizarBotonGuardar();
  });

  editorJS.session.on('change', () => {
    cambiosSinGuardar = true;
    actualizarVistaPrevia();
    actualizarBotonGuardar();
  });
}

function actualizarVistaPrevia() {
  const html = editorHTML.getValue();
  const css = `<style>${editorCSS.getValue()}</style>`;
  const js = `<script>${editorJS.getValue()}<\/script>`;

  const iframe = document.getElementById("iframe-previo");
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  
  doc.open();
  doc.write(html + css + js);
  doc.close();
}

function actualizarBotonGuardar() {
  const btnGuardar = document.getElementById("btn-guardar");
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
    alert('ℹ️ No hay cambios para guardar');
    return;
  }

  const btnGuardar = document.getElementById("btn-guardar");
  const textoOriginal = btnGuardar.innerHTML;
  
  btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  btnGuardar.disabled = true;

    const datosGuardar = {
      codigoHTML: editorHTML.getValue(),
      codigoCSS: editorCSS.getValue(),
      codigoJS: editorJS.getValue()
    };

    let resultado;
    
    if (proyectoActual && proyectoActual._id) {
      // Actualizar proyecto existente
      resultado = await hacerPeticion(`/archivos/actualizar/${proyectoActual._id}`, {
        method: 'PUT',
        body: JSON.stringify(datosGuardar)
      });
    } else {
      const nombreProyecto = prompt('Nombre del proyecto:', 'Mi Nuevo Proyecto');
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
      
      mostrarNotificacion('✅ Proyecto guardado correctamente', 'success');
    } else {
      mostrarNotificacion('❌ Error al guardar: ' + (resultado.data?.mensaje || 'Error desconocido'), 'error');
    }
  }
