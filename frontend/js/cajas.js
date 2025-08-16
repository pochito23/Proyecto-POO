const API = 'http://localhost:3000';

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

const editorHTML = ace.edit("editor-html", { mode: "ace/mode/html", ...opcionesEditor });
const editorCSS = ace.edit("editor-css", { mode: "ace/mode/css", ...opcionesEditor });
const editorJS = ace.edit("editor-js", { mode: "ace/mode/javascript", ...opcionesEditor });

async function hacerPeticion(url, opciones = {}) {
    const respuesta = await fetch(`${API}${url}`, {
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
  const usuarioGuardado = localStorage.getItem('usuarioClouder');
  if (!usuarioGuardado) {
    alert('❌ Debes iniciar sesión primero');
    window.location.href = 'Login.html';
    return;
  }
  usuarioActual = JSON.parse(usuarioGuardado);
  usuarioActual = datosUsuario.usuario || datosUsuario

  const params = new URLSearchParams(window.location.search);
  const proyectoId = params.get('id');
  
  if (proyectoId) {
    await cargarProyecto(proyectoId);
  } else {
    establecerContenidoPorDefecto();
  }

  configurarEventosEditores();
    actualizarVistaPrevia();

  const btnGuardar = document.getElementById("btn-guardar");
  if (btnGuardar) {
    btnGuardar.addEventListener('click', guardarProyecto);
  }
  
  const btnCambiarVista = document.getElementById("btn-cambiar-vista");
  if (btnCambiarVista) {
    btnCambiarVista.addEventListener('click', cambiarVista);
  }

});

// Cargar proyecto desde el backend
async function cargarProyecto(id) {
  try {
    // USAR EL NUEVO ENDPOINT
    const resultado = await hacerPeticion(`/archivos/${id}?usuario=${usuarioActual.numeroUsuario}`);
    
    if (resultado.success) {
      proyectoActual = resultado.data;
      
      // Cargar el código en los editores
      if (proyectoActual.tipo === 'proyecto') {
        editorHTML.setValue(proyectoActual.codigoHTML || '', -1);
        editorCSS.setValue(proyectoActual.codigoCSS || '', -1);
        editorJS.setValue(proyectoActual.codigoJS || '', -1);
      } else if (proyectoActual.tipo === 'snippet') {
        // Para snippets, solo mostrar el código en el editor correspondiente
        if (proyectoActual.lenguaje === 'html') {
          editorHTML.setValue(proyectoActual.codigo || '', -1);
        } else if (proyectoActual.lenguaje === 'css') {
          editorCSS.setValue(proyectoActual.codigo || '', -1);
        } else if (proyectoActual.lenguaje === 'javascript') {
          editorJS.setValue(proyectoActual.codigo || '', -1);
        }
      }
      
      cambiosSinGuardar = false;
      actualizarBotonGuardar();
      actualizarVistaPrevia();
      
      console.log('Proyecto cargado:', proyectoActual.nombre);
    } else {
      console.error('Error al cargar proyecto:', resultado.data?.mensaje);
      alert('❌ Error al cargar el proyecto: ' + (resultado.data?.mensaje || 'Error desconocido'));
      establecerContenidoPorDefecto();
    }
  } catch (error) {
    console.error('Error al cargar proyecto:', error);
    establecerContenidoPorDefecto();
  }
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
    mostrarNotificacion('ℹ️ No hay cambios para guardar', 'info');
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
      document.body.removeChild(notificacion);
    }, 300);
  }, 3000);
}

// Función para cambiar vista (horizontal/vertical)
function cambiarVista() {
  const contenedor = document.getElementById('contenedor-principal');
  if (contenedor.classList.contains('vista-horizontal')) {
    contenedor.classList.remove('vista-horizontal');
    contenedor.classList.add('vista-vertical');
  } else {
    contenedor.classList.remove('vista-vertical');
    contenedor.classList.add('vista-horizontal');
  }
}