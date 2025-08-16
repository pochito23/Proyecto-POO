// Configuración de la API
const API = 'http://localhost:3000';

// Variable global para el usuario actual
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", function () {
  // Cargar usuario actual
  const usuarioGuardado = localStorage.getItem('usuarioClouder');
  if (!usuarioGuardado) {
    alert('❌ Debes iniciar sesión primero');
    window.location.href = 'Login.html';
    return;
  }
  const datosUsuario = JSON.parse(usuarioGuardado);
  usuarioActual = datosUsuario.usuario || datosUsuario;


  // Elementos del DOM
  const crearBtn = document.getElementById("crearBtn");
  const modal = document.getElementById("modalCrear");
  const archivoTabla = document.getElementById("archivoTabla");
  const breadcrumb = document.getElementById("breadcrumb");
  const ordenarPor = document.getElementById("ordenarPor");
  const searchInput = document.querySelector(".navbar-search");
  const sidebar = document.querySelector(".sidebar");
  const menuLateral = document.querySelector(".menu-lateral");
  const almacenamiento = document.querySelector(".almacenamiento");
  const btnHamburguesa = document.getElementById("btnHamburguesa");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // Variables de estado
  let carpetaActual = null;
  let historialCarpetas = [];
  let archivosActuales = [];
  let filtroBusqueda = "";

  // Función para hacer peticiones a la API
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

  // Cargar archivos de la carpeta actual
  async function cargarArchivos() {
    let url;
    if (carpetaActual) {
      url = `/archivos/usuario/${usuarioActual.numeroUsuario}/carpeta/${carpetaActual}`;
    } else {
      url = `/archivos/usuario/${usuarioActual.numeroUsuario}/raiz`;
    }

    const resultado = await hacerPeticion(url);
    
    if (resultado.success) {
      archivosActuales = resultado.data;
      renderizarArchivos();
    } else {
      console.error('Error al cargar archivos:', resultado.error);
      archivoTabla.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 20px; color: red;">
            Error al cargar archivos
          </td>
        </tr>
      `;
    }
  }
async function buscarArchivos(termino) {
  if (!termino.trim()) {
    cargarArchivos(); 
    return;
  }
  
  const url = `/archivos/usuario/${usuarioActual.numeroUsuario}/buscar?q=${encodeURIComponent(termino)}`;
  const resultado = await hacerPeticion(url);
  
  if (resultado.success) {
    archivosActuales = resultado.data;
    renderizarArchivos();
  } else {
    console.error('Error en búsqueda:', resultado.error);
  }
}
  // Renderizar archivos en la tabla
  function renderizarArchivos() {
    archivoTabla.innerHTML = "";
    
    let archivos = [...archivosActuales];
    
    // Filtrar por búsqueda
    if (filtroBusqueda.trim() !== "") {
      archivos = archivos.filter(archivo => 
        archivo.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
      );
    }
    
    // Ordenar archivos
    archivos = ordenarElementos(archivos);

    if (archivos.length === 0) {
      archivoTabla.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 20px;">
            ${filtroBusqueda ? 'No se encontraron archivos' : 'No hay archivos creados'}
          </td>
        </tr>
      `;
      return;
    }

    archivos.forEach((archivo) => {
      const icono = archivo.tipo === "carpeta" ? "📁" : 
                   archivo.tipo === "proyecto" ? "📄" : "📝";
      
      const fecha = new Date(archivo.fechaModificacion).toLocaleDateString();
      const tamaño = archivo.tipo === "carpeta" ? "—" : 
                    Math.floor(Math.random() * 5 + 1) + " MB";
      
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><input type="checkbox" class="fila-checkbox" data-id="${archivo._id}"/></td>
        <td class="nombre-click" style="cursor:pointer;" data-id="${archivo._id}" data-tipo="${archivo.tipo}">
          <span class="icono">${icono}</span> ${archivo.nombre}
        </td>
        <td>${fecha}</td>
        <td>${tamaño}</td>
        <td style="position: relative;">
          <button class="btn-opciones" type="button" data-id="${archivo._id}">⋮</button>
          <ul class="menu-opciones">
            <li class="abrir-opcion">${archivo.tipo === "carpeta" ? "📂 Abrir" : "🔍 Ver"}</li>
            <li class="renombrar-opcion">✏️ Renombrar</li>
            <li class="eliminar-opcion">🗑️ Eliminar</li>
          </ul>
        </td>
      `;
      
      archivoTabla.appendChild(fila);
    });

    // Agregar event listeners para nombres clickeables
    document.querySelectorAll('.nombre-click').forEach(elemento => {
      elemento.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const tipo = e.currentTarget.getAttribute('data-tipo');
        
        if (tipo === 'carpeta') {
          abrirCarpeta(id);
        } else {
          window.location.href = 'cajas.html?id=' + id;
        }
      });

      elemento.addEventListener('dblclick', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const tipo = e.currentTarget.getAttribute('data-tipo');
        
        if (tipo === 'carpeta') {
          abrirCarpeta(id);
        } else {
          window.location.href = 'cajas.html?id=' + id;
        }
      });
    });
  }

  // Abrir carpeta
  function abrirCarpeta(id) {
    if (carpetaActual) {
      historialCarpetas.push(carpetaActual);
    }
    carpetaActual = id;
    renderizarBreadcrumb();
    cargarArchivos();
  }

  // Renderizar breadcrumb
  function renderizarBreadcrumb() {
    const carpetaNombre = carpetaActual ? 
      archivosActuales.find(a => a._id === carpetaActual)?.nombre || 'Carpeta' : 
      'Menú principal';

    breadcrumb.innerHTML = `
      <button id="btnAtras" class="btn-atras" style="${!carpetaActual ? 'display: none;' : ''}">
        <span class="atras-icono">⬅️</span> <span class="atras-texto">Atrás</span>
      </button>
      <span class="breadcrumb-text">${carpetaActual ? 'Carpeta: ' + carpetaNombre : carpetaNombre}</span>
    `;
    
    const btnAtras = document.getElementById('btnAtras');
    if (btnAtras) {
      btnAtras.addEventListener('click', () => {
        carpetaActual = historialCarpetas.pop() || null;
        renderizarBreadcrumb();
        cargarArchivos();
      });
    }
  }

  // Mostrar modal para crear
  function mostrarModalCrear() {
    modal.innerHTML = `
      <div class="modal-content">
        <h3>¿Qué deseas crear?</h3>
        <button class="modal-btn" id="btnNuevaCarpeta">📁 Nueva Carpeta</button>
        <button class="modal-btn" id="btnNuevoProyecto">📄 Nuevo Proyecto</button>
        <button class="modal-btn" id="btnNuevoSnippet">📝 Nuevo Snippet</button><br>
        <button class="modal-cerrar" id="btnCancelarCrear">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    
    document.getElementById("btnNuevaCarpeta").onclick = () => pedirNombre("carpeta");
    document.getElementById("btnNuevoProyecto").onclick = () => pedirNombre("proyecto");
    document.getElementById("btnNuevoSnippet").onclick = () => pedirNombre("snippet");
    document.getElementById("btnCancelarCrear").onclick = cerrarModal;
  }

  // Pedir nombre para nuevo elemento
  function pedirNombre(tipo) {
    let camposExtra = '';
    
    if (tipo === 'snippet') {
      camposExtra = `
        <select id="selectLenguaje" style="padding:8px;width:80%;margin-bottom:10px;">
          <option value="">Selecciona un lenguaje</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="php">PHP</option>
          <option value="sql">SQL</option>
          <option value="otros">Otros</option>
        </select>
      `;
    }
    
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Nombre del ${tipo}</h3>
        <input type="text" id="inputNombre" placeholder="Escribe el nombre..." style="padding:8px;width:80%;margin-bottom:10px;" maxlength="40"/>
        ${camposExtra}
        <div id="errorNombre" style="color:red;font-size:13px;height:18px;"></div>
        <button class="modal-btn" id="btnCrearAhora">Crear</button>
        <button class="modal-cerrar" id="btnCancelarCrear">Cancelar</button>
      </div>
    `;
    
    modal.style.display = "flex";
    document.getElementById("inputNombre").focus();
    document.getElementById("btnCrearAhora").onclick = () => crearElemento(tipo);
    document.getElementById("btnCancelarCrear").onclick = cerrarModal;
    document.getElementById("inputNombre").onkeydown = e => {
      if (e.key === "Enter") crearElemento(tipo);
    };
  }

  // Crear elemento
  async function crearElemento(tipo) {
    const input = document.getElementById("inputNombre");
    if (!input) return;
    
    const nombre = input.value.trim();
    const errorDiv = document.getElementById("errorNombre");
    
    // Validaciones
    if (!nombre) {
      errorDiv.textContent = "El nombre no puede estar vacío.";
      return;
    }
    if (nombre.length > 40) {
      errorDiv.textContent = "El nombre es demasiado largo.";
      return;
    }
    
    // Verificar si ya existe
    if (archivosActuales.some(a => a.nombre.toLowerCase() === nombre.toLowerCase())) {
      errorDiv.textContent = "Ya existe un elemento con ese nombre.";
      return;
    }

    // Preparar datos según el tipo
    let datosCrear = {
      nombre: nombre,
      propietario: usuarioActual.numeroUsuario,
      carpetaPadre: carpetaActual,
      tipo: tipo
    };

    // Agregar campos específicos según el tipo
    if (tipo === 'proyecto') {
      datosCrear.codigoHTML = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Proyecto</title>\n</head>\n<body>\n  <h1>Nuevo Proyecto</h1>\n</body>\n</html>';
      datosCrear.codigoCSS = 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}';
      datosCrear.codigoJS = 'console.log("Proyecto creado");';
    } else if (tipo === 'snippet') {
      const lenguajeSelect = document.getElementById("selectLenguaje");
      if (!lenguajeSelect || !lenguajeSelect.value) {
        errorDiv.textContent = "Selecciona un lenguaje para el snippet.";
        return;
      }
      datosCrear.lenguaje = lenguajeSelect.value;
      datosCrear.codigo = '// Tu código aquí';
    }

    // Hacer petición al backend
    const resultado = await hacerPeticion('/archivos/crear', {
      method: 'POST',
      body: JSON.stringify(datosCrear)
    });

    if (resultado.success) {
      cerrarModal();
      cargarArchivos(); // Recargar la vista
      alert(`✅ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} creado correctamente`);
    } else {
      errorDiv.textContent = "Error al crear el elemento: " + (resultado.data?.error || 'Error desconocido');
    }
  }

  // Cerrar modal
  function cerrarModal() {
    modal.style.display = "none";
    modal.innerHTML = "";
  }

  // Eliminar elemento
  async function eliminarElemento(id, silencioso = false) {
    const resultado = await hacerPeticion(`/archivos/eliminar/${id}`, {
      method: 'DELETE'
    });

    if (resultado.success) {
      cargarArchivos();
      if (!silencioso) {
        cerrarModal();
        alert("✅ Elemento eliminado correctamente");
      }
    } else {
      alert("❌ Error al eliminar: " + (resultado.data?.mensaje || 'Error desconocido'));
    }
  }

  // Mostrar modal para renombrar
  function mostrarModalRenombrar(id) {
    const archivo = archivosActuales.find(a => a._id === id);
    if (!archivo) return;

    modal.innerHTML = `
      <div class="modal-content">
        <h3>Renombrar</h3>
        <input type="text" id="inputNuevoNombre" value="${archivo.nombre}" style="padding:8px;width:80%;margin-bottom:10px;" maxlength="40"/>
        <div id="errorNombre" style="color:red;font-size:13px;height:18px;"></div>
        <button class="modal-btn" id="btnRenombrarAhora">Renombrar</button>
        <button class="modal-cerrar" id="btnCancelarRenombrar">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("inputNuevoNombre").focus();
    document.getElementById("btnRenombrarAhora").onclick = () => renombrarElemento(id);
    document.getElementById("btnCancelarRenombrar").onclick = cerrarModal;
  }

  // Renombrar elemento
  async function renombrarElemento(id) {
    const input = document.getElementById("inputNuevoNombre");
    const nuevoNombre = input.value.trim();
    const errorDiv = document.getElementById("errorNombre");
    
    if (!nuevoNombre) {
      errorDiv.textContent = "El nombre no puede estar vacío.";
      return;
    }
    
    if (nuevoNombre.length > 40) {
      errorDiv.textContent = "El nombre es demasiado largo.";
      return;
    }

    // Verificar que no exista otro con el mismo nombre
    const archivo = archivosActuales.find(a => a._id === id);
    if (archivosActuales.some(a => a._id !== id && a.nombre.toLowerCase() === nuevoNombre.toLowerCase())) {
      errorDiv.textContent = "Ya existe un elemento con ese nombre.";
      return;
    }

    const resultado = await hacerPeticion(`/archivos/actualizar/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre: nuevoNombre })
    });

    if (resultado.success) {
      cerrarModal();
      cargarArchivos();
      alert("✅ Elemento renombrado correctamente");
    } else {
      errorDiv.textContent = "Error al renombrar: " + (resultado.data?.mensaje || 'Error desconocido');
    }
  }

  // Ordenar elementos
  function ordenarElementos(elementos) {
    const val = ordenarPor.value;
    let arr = [...elementos];
    
    switch (val) {
      case "nombre-asc":
        arr.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
        break;
      case "nombre-desc":
        arr.sort((a, b) => b.nombre.localeCompare(a.nombre, "es", { sensitivity: "base" }));
        break;
      case "fecha-reciente":
        arr.sort((a, b) => new Date(b.fechaModificacion) - new Date(a.fechaModificacion));
        break;
      case "fecha-antigua":
        arr.sort((a, b) => new Date(a.fechaModificacion) - new Date(b.fechaModificacion));
        break;
      case "tamano-mayor":
      case "tamano-menor":
        // Para este proyecto, solo ordenamos carpetas al final
        arr.sort((a, b) => {
          if (a.tipo === 'carpeta' && b.tipo !== 'carpeta') return val === "tamano-mayor" ? 1 : -1;
          if (b.tipo === 'carpeta' && a.tipo !== 'carpeta') return val === "tamano-mayor" ? -1 : 1;
          return 0;
        });
        break;
    }
    return arr;
  }

  // Mostrar modal de información
  function mostrarModalInfo(mensaje) {
    modal.innerHTML = `
      <div class="modal-content">
        <div style="margin-bottom:15px;">${mensaje}</div>
        <button class="modal-btn" id="btnCerrarInfo">OK</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnCerrarInfo").onclick = cerrarModal;
  }

  // Mostrar modal de confirmación de borrado
  function mostrarModalConfirmarBorrar(ids) {
    const nombres = ids.map(id => {
      const archivo = archivosActuales.find(a => a._id === id);
      return archivo ? archivo.nombre : 'Desconocido';
    });

    modal.innerHTML = `
      <div class="modal-content">
        <div style="margin-bottom:15px;">¿Seguro que deseas eliminar los siguientes elementos?<br><b>${nombres.join("<br>")}</b></div>
        <button class="modal-btn" id="btnBorrarAhora">Borrar</button>
        <button class="modal-cerrar" id="btnCancelarBorrar">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnBorrarAhora").onclick = () => {
      ids.forEach(id => eliminarElemento(id, true));
      cerrarModal();
    };
    document.getElementById("btnCancelarBorrar").onclick = cerrarModal;
  }

  // Mostrar modal de cerrar sesión
  function mostrarModalCerrarSesion() {
    modal.innerHTML = `
      <div class="modal-content">
        <div style="margin-bottom:15px;">¿Seguro que deseas cerrar sesión?</div>
        <button class="modal-btn" id="btnCerrarSesionAhora">Cerrar sesión</button>
        <button class="modal-cerrar" id="btnCancelarCerrarSesion">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnCerrarSesionAhora").onclick = () => {
      localStorage.removeItem('usuarioClouder');
      window.location.href = "landing.html";
    };
    document.getElementById("btnCancelarCerrarSesion").onclick = cerrarModal;
  }


async function filtrarPorTipo(tipo) {
  const url = `/archivos/usuario/${usuarioActual.numeroUsuario}/tipo/${tipo}${carpetaActual ? '?carpeta=' + carpetaActual : ''}`;
  const resultado = await hacerPeticion(url);
  
  if (resultado.success) {
    archivosActuales = resultado.data;
    renderizarArchivos();
    
    // Actualizar breadcrumb para mostrar el filtro
    const breadcrumbText = document.querySelector('.breadcrumb-text');
    if (breadcrumbText) {
      breadcrumbText.textContent += ` - Solo ${tipo}s`;
    }
  } else {
    console.error('Error al filtrar por tipo:', resultado.error);
  }
}
  
  crearBtn.addEventListener("click", mostrarModalCrear);

  ordenarPor.addEventListener("change", () => renderizarArchivos());

  searchInput.addEventListener("input", function () {
      const termino = this.value.trim();

if (termino.length === 0) {
    cargarArchivos(); 
  } else if (termino.length >= 2) {
    buscarArchivos(termino);
  }
});

  // Menú lateral
  menuLateral.addEventListener("click", function (e) {
    const opcion = e.target.innerText.trim();
    const seleccionados = Array.from(document.querySelectorAll(".fila-checkbox:checked"))
      .map(cb => cb.getAttribute("data-id"));

    if (opcion.includes("Mis archivos")) {
      carpetaActual = null;
      historialCarpetas = [];
      renderizarBreadcrumb();
      cargarArchivos();
      return;
    }

    if (opcion.includes("Descargar")) {
      if (seleccionados.length === 0) {
        mostrarModalInfo("Selecciona al menos un archivo o carpeta para descargar.");
        return;
      }
      // Simular descarga
      const nombres = seleccionados.map(id => {
        const archivo = archivosActuales.find(a => a._id === id);
        return archivo ? archivo.nombre : 'Desconocido';
      });
      mostrarModalInfo("Descargando: <br>" + nombres.join("<br>"));
      return;
    }

    if (opcion.includes("Editar")) {
      if (seleccionados.length !== 1) {
        mostrarModalInfo("Selecciona solo un archivo o carpeta para editar.");
        return;
      }
      mostrarModalRenombrar(seleccionados[0]);
      return;
    }

    if (opcion.includes("Borrar")) {
      if (seleccionados.length === 0) {
        mostrarModalInfo("Selecciona al menos un archivo o carpeta para borrar.");
        return;
      }
      mostrarModalConfirmarBorrar(seleccionados);
      return;
    }

    if (opcion.includes("Compartir")) {
      if (seleccionados.length === 0) {
        mostrarModalInfo("Selecciona al menos un archivo o carpeta para compartir.");
        return;
      }
      // Por ahora solo simular
      const nombres = seleccionados.map(id => {
        const archivo = archivosActuales.find(a => a._id === id);
        return archivo ? archivo.nombre : 'Desconocido';
      });
      mostrarModalInfo("Compartiendo: <br>" + nombres.join("<br>"));
      return;
    }

    if (opcion.includes("Cerrar sesión")) {
      mostrarModalCerrarSesion();
      return;
    }
  });

  // Event listener para clicks en opciones de archivos
  document.addEventListener("click", function (e) {
    // Toggle menú opciones
    if (e.target.classList.contains("btn-opciones")) {
      toggleMenu(e.target);
      e.stopPropagation();
      return;
    }

    // Abrir elemento
    if (e.target.classList.contains("abrir-opcion")) {
      const btnOpciones = e.target.closest("td").querySelector(".btn-opciones");
      const id = btnOpciones.getAttribute("data-id");
      const archivo = archivosActuales.find(a => a._id === id);
      
      if (archivo.tipo === 'carpeta') {
        abrirCarpeta(id);
      } else {
        window.location.href = 'cajas.html?id=' + id;
      }
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Eliminar elemento
    if (e.target.classList.contains("eliminar-opcion")) {
      const btnOpciones = e.target.closest("td").querySelector(".btn-opciones");
      const id = btnOpciones.getAttribute("data-id");
      
      if (confirm("¿Estás seguro de eliminar este elemento?")) {
        eliminarElemento(id);
      }
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Renombrar elemento
    if (e.target.classList.contains("renombrar-opcion")) {
      const btnOpciones = e.target.closest("td").querySelector(".btn-opciones");
      const id = btnOpciones.getAttribute("data-id");
      mostrarModalRenombrar(id);
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Cerrar menús si se hace click fuera
    if (!e.target.closest(".menu-opciones") && !e.target.classList.contains("btn-opciones")) {
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
    }
  });

  // Menú hamburguesa
  btnHamburguesa.addEventListener("click", function () {
    sidebar.classList.add("abierta");
    sidebarOverlay.classList.add("activa");
  });

  sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("abierta");
    sidebarOverlay.classList.remove("activa");
  });

  // Click fuera del modal para cerrar
  modal.addEventListener("click", function (e) {
    if (e.target === modal) cerrarModal();
  });

  // Función para toggle de menú
  function toggleMenu(button) {
    const menu = button.nextElementSibling;
    const todosMenus = document.querySelectorAll(".menu-opciones");
    
    // Cerrar todos los otros menús
    todosMenus.forEach(m => {
      if (m !== menu) m.style.display = "none";
    });
    
    // Toggle del menú actual
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  // Cargar datos iniciales
  renderizarBreadcrumb();
  cargarArchivos();
});