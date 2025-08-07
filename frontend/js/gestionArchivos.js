document.addEventListener("DOMContentLoaded", function () {
  const crearBtn = document.getElementById("crearBtn");
  const modal = document.getElementById("modalCrear");
  const archivoTabla = document.getElementById("archivoTabla");
  const breadcrumb = document.getElementById("breadcrumb");
  const ordenarPor = document.getElementById("ordenarPor");
  const searchInput = document.querySelector(".navbar-search");
  const sidebar = document.querySelector(".sidebar");
  const menuLateral = document.querySelector(".menu-lateral");
  const almacenamiento = document.querySelector(".almacenamiento");

  let ubicacionActual = "root";
  let carpetas = {};
  let historial = [];
  let filtroBusqueda = "";

  // Cargar desde localStorage
  function cargarDatos() {
    const data = localStorage.getItem("cloudlerData");
    if (data) {
      carpetas = JSON.parse(data);
    } else {
      carpetas = { root: [] };
    }
  }

  function guardarDatos() {
    localStorage.setItem("cloudlerData", JSON.stringify(carpetas));
  }

  // Modal de creación mejorado
  let tipoAcrear = null;
  function mostrarModalCrear() {
    modal.innerHTML = `
      <div class="modal-content">
        <h3>¿Qué deseas crear?</h3>
        <button class="modal-btn" id="btnNuevaCarpeta">📁 Nueva Carpeta</button>
        <button class="modal-btn" id="btnNuevoArchivo">📄 Nuevo Archivo</button>
        <button class="modal-cerrar" id="btnCancelarCrear">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnNuevaCarpeta").onclick = () => pedirNombre("carpeta");
    document.getElementById("btnNuevoArchivo").onclick = () => pedirNombre("archivo");
    document.getElementById("btnCancelarCrear").onclick = cerrarModal;
  }

  function pedirNombre(tipo) {
    tipoAcrear = tipo;
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Nombre del ${tipo === "carpeta" ? "carpeta" : "archivo"}</h3>
        <input type="text" id="inputNombre" placeholder="Escribe el nombre..." style="padding:8px;width:80%;margin-bottom:10px;" maxlength="40"/>
        <div id="errorNombre" style="color:red;font-size:13px;height:18px;"></div>
        <button class="modal-btn" id="btnCrearAhora">Crear</button>
        <button class="modal-cerrar" id="btnCancelarCrear">Cancelar</button>
      </div>
    `;
    document.getElementById("inputNombre").focus();
    document.getElementById("btnCrearAhora").onclick = () => crearElemento(tipo);
    document.getElementById("btnCancelarCrear").onclick = cerrarModal;
    document.getElementById("inputNombre").onkeydown = e => {
      if (e.key === "Enter") crearElemento(tipo);
    };
  }

  function cerrarModal() {
    modal.style.display = "none";
    modal.innerHTML = "";
    tipoAcrear = null;
  }

  function crearElemento(tipo) {
    const input = document.getElementById("inputNombre");
    if (!input) return;
    const nombre = input.value.trim();
    const errorDiv = document.getElementById("errorNombre");
    if (!nombre) {
      errorDiv.textContent = "El nombre no puede estar vacío.";
      return;
    }
    if (nombre.length > 40) {
      errorDiv.textContent = "El nombre es demasiado largo.";
      return;
    }
    if (carpetas[ubicacionActual]?.some(e => e.nombre.toLowerCase() === nombre.toLowerCase())) {
      errorDiv.textContent = "Ya existe un elemento con ese nombre.";
      return;
    }
    if (!carpetas[ubicacionActual]) carpetas[ubicacionActual] = [];
    const fecha = new Date().toISOString();
    const tamaño = tipo === "carpeta" ? "—" : (Math.random() * 5 + 1).toFixed(1) + " MB";
    carpetas[ubicacionActual].push({ nombre, tipo, fecha, tamaño });
    if (tipo === "carpeta" && !carpetas[nombre]) carpetas[nombre] = [];
    guardarDatos();
    renderizarCarpeta(ubicacionActual);
    cerrarModal();
  }

  function abrirElemento(nombre) {
    const item = (carpetas[ubicacionActual] || []).find(e => e.nombre === nombre);
    if (!item || item.tipo !== "carpeta") return;
    historial.push(ubicacionActual);
    ubicacionActual = nombre;
    renderizarBreadcrumb();
    renderizarCarpeta(ubicacionActual);
  }

  function renderizarCarpeta(nombre) {
    archivoTabla.innerHTML = "";
    let elementos = carpetas[nombre] || [];
    // Filtro de búsqueda
    if (filtroBusqueda.trim() !== "") {
      elementos = elementos.filter(e => e.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()));
    }
    // Ordenar según select
    elementos = ordenarElementos(elementos);

    if (elementos.length === 0) {
      archivoTabla.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 20px;">No hay archivos creados.</td>
        </tr>
      `;
      return;
    }

    elementos.forEach((item, idx) => {
      const icono = item.tipo === "carpeta" ? "📁" : "📄";
      const fecha = item.fecha ? item.fecha.split("T")[0] : new Date().toISOString().split("T")[0];
      const tamaño = item.tipo === "carpeta" ? "—" : item.tamaño || (Math.random() * 5 + 1).toFixed(1) + " MB";
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><input type="checkbox" class="fila-checkbox" data-nombre="${item.nombre}"/></td>
        <td class="nombre-click" style="cursor:pointer;"><span class="icono">${icono}</span> ${item.nombre}</td>
        <td>${fecha}</td>
        <td>${tamaño}</td>
        <td style="position: relative;">
          <button class="btn-opciones" type="button">⋮</button>
          <ul class="menu-opciones">
            <li class="abrir-opcion"  onclick="window.location.href='cajas.html'">${item.tipo === "carpeta" ? "📂 Abrir" : "🔍 Ver"}</li>
            <li class="renombrar-opcion">✏️ Renombrar</li>
            <li class="eliminar-opcion">🗑️ Eliminar</li>
          </ul>
        </td>
      `;
      // Hacer clic en el nombre abre la carpeta o muestra el archivo
      fila.querySelector(".nombre-click").addEventListener("click", () => {
        if (item.tipo === "carpeta") {
          abrirElemento(item.nombre);
        } else {
          mostrarModalInfo(`Vista previa de archivo: <b>${item.nombre}</b>`);
        }
      });
      archivoTabla.appendChild(fila);
    });
  }

  function renderizarBreadcrumb() {
    breadcrumb.innerHTML = `
      <button id="btnAtras" class="btn-atras" style="${ubicacionActual === 'root' ? 'display: none;' : ''}">
        <span class="atras-icono">⬅️</span> <span class="atras-texto">Atrás</span>
      </button>
      <span class="breadcrumb-text">${ubicacionActual === 'root' ? 'Menú principal' : 'Carpeta: ' + ubicacionActual}</span>
    `;
  }

  function actualizarMensajeVacio() {
    if (archivoTabla.children.length === 0) {
      archivoTabla.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 20px;">No hay archivos creados.</td>
        </tr>
      `;
    }
  }

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
        arr.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        break;
      case "fecha-antigua":
        arr.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        break;
      case "tamano-mayor":
        arr.sort((a, b) => {
          const ta = a.tipo === "carpeta" ? 0 : parseFloat(a.tamaño);
          const tb = b.tipo === "carpeta" ? 0 : parseFloat(b.tamaño);
          return tb - ta;
        });
        break;
      case "tamano-menor":
        arr.sort((a, b) => {
          const ta = a.tipo === "carpeta" ? 0 : parseFloat(a.tamaño);
          const tb = b.tipo === "carpeta" ? 0 : parseFloat(b.tamaño);
          return ta - tb;
        });
        break;
    }
    return arr;
  }

  // Delegación para acciones en la tabla
  document.body.addEventListener("click", function (e) {
    // Botón atrás
    if (e.target.id === "btnAtras" || e.target.closest("#btnAtras")) {
      ubicacionActual = historial.pop() || "root";
      renderizarBreadcrumb();
      renderizarCarpeta(ubicacionActual);
      return;
    }

    // Botón opciones
    if (e.target.classList.contains("btn-opciones")) {
      toggleMenu(e.target);
      e.stopPropagation();
      return;
    }

    // Abrir carpeta o ver archivo
    if (e.target.classList.contains("abrir-opcion")) {
      const fila = e.target.closest("tr");
      const nombre = fila.querySelector("td:nth-child(2)").innerText.trim().replace(/^📁 |^📄 /, "");
      abrirElemento(nombre);
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Eliminar archivo/carpeta
    if (e.target.classList.contains("eliminar-opcion")) {
      const fila = e.target.closest("tr");
      const nombre = fila.querySelector("td:nth-child(2)").innerText.trim().replace(/^📁 |^📄 /, "");
      eliminarElemento(nombre);
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Renombrar archivo/carpeta
    if (e.target.classList.contains("renombrar-opcion")) {
      const fila = e.target.closest("tr");
      const nombre = fila.querySelector("td:nth-child(2)").innerText.trim().replace(/^📁 |^📄 /, "");
      mostrarModalRenombrar(nombre);
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
      return;
    }

    // Cerrar menús si se hace click fuera
    if (!e.target.closest(".menu-opciones") && !e.target.classList.contains("btn-opciones")) {
      document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");
    }
  });

  // Barra de búsqueda funcional
  searchInput.addEventListener("input", function () {
    filtroBusqueda = this.value;
    renderizarCarpeta(ubicacionActual);
  });

  // Selección múltiple y acciones de barra lateral
  menuLateral.addEventListener("click", function (e) {
    const opcion = e.target.innerText.trim();
    const seleccionados = Array.from(document.querySelectorAll(".fila-checkbox:checked"))
      .map(cb => cb.getAttribute("data-nombre"));

    if (opcion.includes("Mis archivos")) {
      ubicacionActual = "root";
      historial = [];
      renderizarBreadcrumb();
      renderizarCarpeta(ubicacionActual);
      return;
    }

    if (opcion.includes("Descargar")) {
      if (seleccionados.length === 0) {
        mostrarModalInfo("Selecciona al menos un archivo o carpeta para descargar.");
        return;
      }
      mostrarModalInfo("Descargando: <br>" + seleccionados.join("<br>"));
          //Aqui se pondra la logica para descargar los archivos
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
      mostrarModalInfo("Compartiendo: <br>" + seleccionados.join("<br>"));
          //Aqui se pondra la logica para compartir los archivos
      return;
    }

    if (opcion.includes("Cerrar sesión")) {
      mostrarModalCerrarSesion();
      return;
    }
  });

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

  function mostrarModalConfirmarBorrar(nombres) {
    modal.innerHTML = `
      <div class="modal-content">
        <div style="margin-bottom:15px;">¿Seguro que deseas eliminar los siguientes elementos?<br><b>${nombres.join("<br>")}</b></div>
        <button class="modal-btn" id="btnBorrarAhora">Borrar</button>
        <button class="modal-cerrar" id="btnCancelarBorrar">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnBorrarAhora").onclick = () => {
      nombres.forEach(nombre => eliminarElemento(nombre, true));
      cerrarModal();
    };
    document.getElementById("btnCancelarBorrar").onclick = cerrarModal;
  }

  function mostrarModalCerrarSesion() {
    modal.innerHTML = `
      <div class="modal-content">
        <div style="margin-bottom:15px;">¿Seguro que deseas cerrar sesión?</div>
        <button class="modal-btn" id="btnCerrarSesionAhora" >Cerrar sesión</button>
        <button class="modal-cerrar" id="btnCancelarCerrarSesion">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("btnCerrarSesionAhora").onclick = () => {
      // Aquí puedes limpiar datos, redirigir, etc.
      localStorage.removeItem("cloudlerData");
      window.location.href = "landing.html";
    };
    document.getElementById("btnCancelarCerrarSesion").onclick = cerrarModal;
  }

  function eliminarElemento(nombre, silencioso = false) {
    let idx = carpetas[ubicacionActual].findIndex(e => e.nombre === nombre);
    if (idx !== -1) {
      const tipo = carpetas[ubicacionActual][idx].tipo;
      if (tipo === "carpeta") delete carpetas[nombre];
      carpetas[ubicacionActual].splice(idx, 1);
      guardarDatos();
      renderizarCarpeta(ubicacionActual);
    }
    if (!silencioso) cerrarModal();
  }

  function mostrarModalRenombrar(nombreViejo) {
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Renombrar</h3>
        <input type="text" id="inputNuevoNombre" value="${nombreViejo}" style="padding:8px;width:80%;margin-bottom:10px;" maxlength="40"/>
        <div id="errorNombre" style="color:red;font-size:13px;height:18px;"></div>
        <button class="modal-btn" id="btnRenombrarAhora">Renombrar</button>
        <button class="modal-cerrar" id="btnCancelarRenombrar">Cancelar</button>
      </div>
    `;
    modal.style.display = "flex";
    document.getElementById("inputNuevoNombre").focus();
    document.getElementById("btnRenombrarAhora").onclick = () => renombrarElemento(nombreViejo);
    document.getElementById("btnCancelarRenombrar").onclick = cerrarModal;
    document.getElementById("inputNuevoNombre").onkeydown = e => {
      if (e.key === "Enter") renombrarElemento(nombreViejo);
    };
  }

  function renombrarElemento(nombreViejo) {
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
    if (carpetas[ubicacionActual].some(e => e.nombre.toLowerCase() === nuevoNombre.toLowerCase() && e.nombre !== nombreViejo)) {
      errorDiv.textContent = "Ya existe un elemento con ese nombre.";
      return;
    }
    let item = carpetas[ubicacionActual].find(e => e.nombre === nombreViejo);
    if (!item) return;
    if (item.tipo === "carpeta") {
      carpetas[nuevoNombre] = carpetas[nombreViejo];
      delete carpetas[nombreViejo];
      if (ubicacionActual === nombreViejo) ubicacionActual = nuevoNombre;
    }
    item.nombre = nuevoNombre;
    guardarDatos();
    renderizarBreadcrumb();
    renderizarCarpeta(ubicacionActual);
    cerrarModal();
  }

  // Modal: cerrar al hacer click fuera
  modal.addEventListener("click", function (e) {
    if (e.target === modal) cerrarModal();
  });

  // Abrir modal crear
  crearBtn.addEventListener("click", mostrarModalCrear);

  // Ordenar al cambiar select
  ordenarPor.addEventListener("change", () => renderizarCarpeta(ubicacionActual));

  // Inicializar
  cargarDatos();
  renderizarBreadcrumb();
  renderizarCarpeta(ubicacionActual);

  // Responsive: mover almacenamiento arriba en sidebar en móvil
  // function ajustarSidebar() {
  //   if (window.innerWidth < 768) {
  //     sidebar.insertBefore(almacenamiento, sidebar.children[1]);
  //   } else {
  //     sidebar.appendChild(almacenamiento);
  //   }
  // }
  // ajustarSidebar();
  // window.addEventListener("resize", ajustarSidebar);

  // Exponer funciones globales para el modal inline del HTML (opcional)
  window.cerrarModal = cerrarModal;
  window.crearElemento = crearElemento;

  // Menú hamburguesa responsive
  const btnHamburguesa = document.getElementById("btnHamburguesa");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  btnHamburguesa.addEventListener("click", function () {
    sidebar.classList.add("abierta");
    sidebarOverlay.classList.add("activa");
  });

  sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("abierta");
    sidebarOverlay.classList.remove("activa");
  });
});

function toggleMenu(button) {
  const menu = button.nextElementSibling;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
  document.querySelectorAll(".menu-opciones").forEach(m => {
    if (m !== menu) m.style.display = "none";
  });
}
