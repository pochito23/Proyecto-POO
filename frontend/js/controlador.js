
 var usuarios = [
  {
    id: 1,
    correo: "eduardo@gmail.com",
    contraseña: "1234",
    usuario: "eduardo",
    plan: "gratis",
    pregunta: "¿Cuál es el nombre de tu mascota?",
    respuesta: "perro",
  },
  {
    id: 2,
    correo: "Kevin@gmail.com",
    contraseña: "1234",
    usuario: "kevin",
    plan: "gratis",
    pregunta: "¿Cuál es el segundo nombre de tu madre?",
    respuesta: "...",
  },
  {
    id: 3,
    correo: "Kristhian@gmail.com",
    contraseña: "1234",
    usuario: "kristiam",
    plan: "gratis",
    pregunta: "¿Cuál es el nombre de tu mascota?",
    respuesta: "gato",
  },
  {
    id: 4,
    correo: "Maria@gmail.com",
    contraseña: "1234",
    usuario: "maria",
    plan: "gratis",
    pregunta: "¿Cómo se llamaba tu escuela primaria?",
    respuesta: "uruguay",
  },
  {
    id: 5,
    correo: "Jose@gmail.com",
    contraseña: "1234",
    usuario: "Pochito",
    plan: "Pro",
    pregunta: "¿Cómo se llamaba tu escuela primaria?",
    respuesta: "uruguay",
  },
];

const urlPostman = "http://localhost:3000";
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = localStorage.getItem("usuarioClouder");
  if (usuarioGuardado) {
    usuarioActual = JSON.parse(usuarioGuardado);
    document.getElementById(
      "usuarioActual"
    ).textContent = `Usuario: ${usuarioActual.usuario}`;
  }
});

//landing
// Menú móvil
const vistaMovil = document.getElementById("vista-movil");
const Menu = document.getElementById("menu");

if (vistaMovil && Menu) {
  vistaMovil.addEventListener("click", () => {
    Menu.classList.toggle("active");
  });
}

// Cerrar menú móvil al hacer click en un enlace
const Links = document.querySelectorAll("#menu a");
Links.forEach((link) => {
  link.addEventListener("click", () => {
    vistaMovil.classList.remove("active");
  });
});

//==============Codigo del registro, inicio de sesion de cuenta y recuperar contraseña ============================
//============================ Recuperar password (no se me ocurrieron mejores nombres jsjs)============================
//login,registro,recuperar clave
async function recuperarClave(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("❌ Debes completar el campo de email");
    return;
  }
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correo: email }),
  };
  const conseguirPregunta = await fetch(
    `${urlPostman}/usuarios/recuperar-contrasena`,
    requestOptions
  );
  const data = await conseguirPregunta.json();
  if (data.status === 404) {
    alert("❌ Email no encontrado");
    return;
  }

  if (conseguirPregunta.status === 200 && data.pregunta) {
    mostrarFormularioRespuesta(email, data.pregunta);
  }
  function mostrarFormularioRespuesta(email, pregunta) {
    const loginlog = document.querySelector("div.login-logo p i");
    const content = document.querySelector(".form-group");

    loginlog.innerHTML = `Responde la siguiente pregunta de seguridad para recuperar tu cuenta`;
    content.innerHTML = `
        <div class="form-group">
            <label for="respuestaSeguridad">${pregunta}</label>
            <input type="text" id="respuestaSeguridad" placeholder="Ingresa tu respuesta">
        </div>
    `;
    document.querySelector(".login-button").innerHTML = "VERIFICAR RESPUESTA";
    document.querySelector(".login-button").onclick = function () {
      validarRespuestaSeguridad(email);
    };
  }

  async function validarRespuestaSeguridad(email) {
    const respuestaInput = document
      .getElementById("respuestaSeguridad")
      .value.trim();

    if (!respuestaInput) {
      alert("❌ Respuesta incorrecta");
      return;
    }

    requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        respuestaSeguridad: respuestaInput,
      }),
    };

    const verificarRespuesta = await fetch(
      `${urlPostman}/usuarios/recuperar-contrasena`,
      requestOptions
    );
    const data = await verificarRespuesta.json();

    if (verificarRespuesta.status === 200 && data.contraseña) {
      alert("✅ Respuesta correcta. Tu contraseña es: " + data.contraseña);
      window.location.href = "login.html";
    } else {
      alert("❌ Respuesta incorrecta");
    }
  }
}
//============================ Validacion del formulario ============================
function validarFormulario() {
  const email = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  const pregunta = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value.trim();
  const alert = document.querySelector(".alert");

  //Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  //Campos vacios
  alert.innerHTML = ``;
  if (email === "") {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de email</label>`;
    return false;
  } else if (usuario === "") {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de Usuario</label>`;
    return false;
  } else if (password === "") {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de contraseña</label>`;
    return false;
  } else if (document.querySelector("#pregunta").value === "") {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe seleccionar una pregunta de seguridad</label>`;
    return false;
  } else if (document.querySelector("#respuesta").value.trim() === "") {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe completar la respuesta de seguridad</label>`;
    return false;
  }

  //Validacion del correo y password
  if (!emailRegex.test(email)) {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>El correo no cumple con los requisitos</label>`;
    return false;
  }
  if (!passRegex.test(password)) {
    alert.innerHTML = `<i class="fa-solid fa-exclamation"></i>
            <label>La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial.</label>`;
    return false;
  }
  return true;
}

//Funcion para validar que el usuario no exista

async function Registro(e) {
  e.preventDefault();

  const correo = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = document.getElementById("password").value;
  const preguntaSeleccionada = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value.trim();

  const preguntas = {
    mascota: "¿Cuál es el nombre de tu mascota?",
    escuela: "¿Cómo se llamaba tu escuela primaria?",
    madre: "¿Cuál es el segundo nombre de tu madre?",
  };

  if (!validarFormulario()) {
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo,
      usuario,
      contraseña,
      preguntaSeguridad: preguntas[preguntaSeleccionada],
      respuestaSeguridad: respuesta,
    }),
  };

  const respuestaRegistro = await fetch(
    `${urlPostman}/usuarios`,
    requestOptions
  );

  if (respuestaRegistro.ok) {
    const usuarioRegistrado = await respuestaRegistro.json();
    alert("✅ Usuario registrado exitosamente");
    // Animación del botón
    document.getElementById("inicioSes").innerHTML = `
      <button style="
        font-size: 16px;
        font-weight: bold;
        background-color: #0d9488;
        color: white;
        box-shadow: 0 0 10px #0d9488;
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.1s ease;
      ">
        INICIA SESIÓN
      </button>
    `;

    setTimeout(() => {
      document.getElementById(
        "inicioSes"
      ).innerHTML = `<button>INICIA SESIÓN</button>`;
    }, 5000);

    // Limpiar formulario
    document.getElementById("email").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";
    document.getElementById("pregunta").value = "";
    document.getElementById("respuesta").value = "";
    return usuarioRegistrado;
  } else {
      if (typeof data === 'string' && data.includes('ya existe')) {
        alert("❌ " + data);
      } else {
        alert("❌ Error al registrar usuario: " + (data.mensaje || 'Error desconocido'));
      }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const grupoRespuesta = document.getElementById("grupo-respuesta");
  const selectPregunta = document.getElementById("pregunta");

  grupoRespuesta.style.display = "none";

  selectPregunta.addEventListener("change", function () {
    if (selectPregunta.value !== "") {
      grupoRespuesta.style.display = "block";
    } else {
      grupoRespuesta.style.display = "none";
    }
  });
});

// async function validarLogin(e) {
//   e.preventDefault();

//   const email = document.getElementById("email").value.trim();
//   const contraseña = document.getElementById("password").value;

//   if (!email || !contraseña) {
//     alert("❌ Debes completar todos los campos");
//     return;
//   }
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       correo: email,
//       contraseña: contraseña,
//     }),
//   };

//   const usuarioEncontrado = await fetch(
//     `${urlPostman}/usuarios/login`,
//     requestOptions
//   );
//   const data = await usuarioEncontrado.json();
//   if (usuarioEncontrado.ok) {
//     usuarioActual = data.usuario;
//     localStorage.setItem("usuarioClouder", JSON.stringify(data));
//     window.location.href = "GestionArchivos.html";
//   } else {
//     alert("❌ Credenciales incorrectas");
//   }
// }

//============================ Planes y suscripciones ============================

// Datos de los planes

async function validarLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value;

  // Validaciones básicas
  if (!email || !contraseña) {
    alert('❌ Por favor completa todos los campos');
    return;
  }

  try {
    // Hacer petición POST al backend
    const response = await fetch("http://localhost:3000/usuarios/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contraseña: contraseña
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Login exitoso
      alert('✅ ' + data.mensaje);
      
      // Guardar datos del usuario en localStorage (opcional)
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Redireccionar
      window.location.href = 'GestionArchivos.html';
    } else {
      // Error en el login
      alert('❌ ' + data.mensaje);
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    alert('❌ Error de conexión con el servidor');
  }
}

// También actualiza tu función de registro para usar el backend:
async function Registro(e) {
  e.preventDefault();

  const correo = document.getElementById("email").value;
  const usuario = document.getElementById("usuario").value;
  const contraseña = document.getElementById("password").value;
  const pregunta = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value;

  // Validar formulario primero
  if (!validarFormulario()) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        usuario,
        contraseña,
        preguntaSeguridad: pregunta,
        respuestaSeguridad: respuesta
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ " + data.mensaje + ". Ahora inicia sesión");
      
      // Limpiar formulario
      document.getElementById("email").value = "";
      document.getElementById("usuario").value = "";
      document.getElementById("password").value = "";
      document.getElementById("pregunta").value = "";
      document.getElementById("respuesta").value = "";
      
      // Efecto visual en botón
      document.getElementById("inicioSes").innerHTML = `
        <button style="
          font-size: 16px;
          font-weight: bold;
          background-color: #0d9488;
          color: white;
          box-shadow: 0 0 10px #0d9488;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.1s ease;
        ">
          INICIA SESIÓN
        </button>
      `;
      
      setTimeout(() => {
        document.getElementById("inicioSes").innerHTML = `<button>INICIA SESIÓN</button>`;
      }, 5000);
      
    } else {
      alert('❌ ' + data.mensaje || data);
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('❌ Error de conexión con el servidor');
  }
}

// Función para recuperar contraseña también actualizada:
async function recuperarClave(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  
  if (!email) {
    alert("❌ Por favor ingresa tu correo");
    return;
  }

  try {
    // Primera petición para obtener la pregunta de seguridad
    const response = await fetch('http://localhost:3000/usuarios/recuperar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email })
    });

    const data = await response.json();

    if (response.status === 400 && data.mensaje.includes("¿")) {
      // El servidor devolvió la pregunta de seguridad
      mostrarPreguntaSeguridad(email, data.mensaje);
    } else if (response.status === 404) {
      alert("❌ Email no encontrado");
    } else {
      alert("❌ " + data.mensaje);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión con el servidor');
  }
}

function mostrarPreguntaSeguridad(email, pregunta) {
  const loginlog = document.querySelector("div.login-logo p i");
  const content = document.querySelector(".form-group");

  loginlog.innerHTML = `Responde la siguiente pregunta de seguridad para recuperar tu cuenta`;
  content.innerHTML = `
    <div class="form-group">
        <label for="respuestaSeguridad">${pregunta}</label>
        <input type="text" id="respuestaSeguridad" placeholder="Ingresa tu respuesta">
    </div>
  `;
  
  document.querySelector(".login-button").innerHTML = "VERIFICAR RESPUESTA";
  document.querySelector(".login-button").onclick = function () {
    validarRespuestaSeguridad(email);
  };
}

async function validarRespuestaSeguridad(email) {
  const respuestaInput = document.getElementById("respuestaSeguridad").value.trim();
  
  if (!respuestaInput) {
    alert("❌ Por favor ingresa tu respuesta");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/usuarios/recuperar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        respuestaSeguridad: respuestaInput
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`✅ ${data.mensaje}. Tu contraseña es: ${data.contraseña}`);
      // Opcional: redireccionar al login
      location.reload();
    } else {
      alert("❌ " + data.mensaje);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión con el servidor');
  }
}



const planesData = {
  gratis: {
    nombre: "Plan Gratuito",
    precio: "$0.00",
    cantidad: 1,
    beneficios: [
      "✅  Proyecto unico",
      "✅  vista previa",
      "✅  Acceso web",
      "❌  Sin soporte prioritario",
    ],
  },
  basico: {
    nombre: "Plan Básico",
    precio: "$9.99",
    cantidad: 5,
    beneficios: [
      "✅  5 proyectos",
      "✅  Acceso web y móvil",
      "✅  Soporte por email",
      "✅  Sincronización automática",
      "❌  Sin soporte prioritario",
    ],
  },
  pro: {
    nombre: "Plan Pro",
    precio: "$12.00",
    cantidad: 10,
    beneficios: [
      "✅  10 proyectos",
      "✅  Todas las características básicas",
      "✅  Soporte prioritario 24/7",
    ],
  },
  empresarial: {
    nombre: "Plan Empresarial",
    precio: "$49.99",
    cantidad: 20,
    beneficios: [
      "✅  Almacenamiento ilimitado",
      "✅  Todas las características Pro",
      "✅  Administración de usuarios",
      "✅  Gerente de cuenta dedicado",
    ],
  },
};

// Obtener plan seleccionado
let planSeleccionado = "gratis";
const urlParametro = new URLSearchParams(window.location.search);
if (urlParametro.get("plan")) {
  planSeleccionado = urlParametro.get("plan").toLowerCase();
}

// Llenar información del plan
function cargarInformacionPlan() {
  const plan = planesData[planSeleccionado] || planesData.basico;

  const resumenElemento = document.getElementById("resumenPlan");
  const precioElemento = document.getElementById("precioTotal");
  const beneficiosElemento = document.getElementById("beneficiosPlan");
  if (resumenElemento) {
    document.getElementById("resumenPlan").innerHTML = `
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 class="font-bold text-text-title">${plan.nombre}</h3>
                        <p class="text-gray-600">Suscripción mensual</p>
                    </div>
                    <div class="text-xl font-bold text-primary">${plan.precio}/mes</div>
                </div>
            `;
  }
  if (precioElemento) {
    precioElemento.textContent = `${plan.precio}/mes`;
  }

  if (beneficiosElemento) {
    const beneficiosHTML = plan.beneficios.map(
      (beneficio) =>
        `<li class="flex items-center text-sm text-gray-700">
            <span class="mr-2">${beneficio.substring(0, 2)}</span>
            <span>${beneficio.substring(3)}</span>
          </li>`
    );
    document.getElementById("beneficiosPlan").innerHTML = beneficiosHTML;
  }
}
const selectorPlan = document.getElementById("selectorPlan");
if (selectorPlan) {
  selectorPlan.addEventListener("change", function (e) {
    planSeleccionado = e.target.value;
    cargarInformacionPlan();
  });
}

const numeroTarjeta = document.getElementById("numeroTarjeta");
if (numeroTarjeta) {
  numeroTarjeta.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    let valorFormateado = valor.match(/.{1,4}/g)?.join(" ") || valor;
    if (valorFormateado !== valor) {
      e.target.value = valorFormateado;
    }
  });
}

const fechaVencimiento = document.getElementById("fechaVencimiento");
if (fechaVencimiento) {
  fechaVencimiento.addEventListener("input", function (e) {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
    }
    e.target.value = valor;
  });
}
const cvv = document.getElementById("cvv");
if (cvv) {
  cvv.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });
}

const formularioPago = document.getElementById("formularioPago");
if (formularioPago) {
  formularioPago.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!usuarioActual) {
      alert("❌ Debes iniciar sesión primero");
      return;
    }

    const boton = document.getElementById("textoBoton");
    boton.textContent = "Procesando...";

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: planSeleccionado,
      }),
    };
    const respuesta = await fetch(
      `${urlPostman}/usuarios/${usuarioActual.numeroUsuario}/plan`,
      requestOptions
    );

    setTimeout(() => {
      // En un sistema real, aquí harías la llamada al backend
      document.getElementById("modalConfirmacion").classList.remove("hidden");
      document.getElementById("modalConfirmacion").classList.add("flex");
    }, 2000);
  });
}
if (respuesta.ok) {
  const data = await respuesta.json();
  usuarioActual.plan = planSeleccionado; // Usar la variable local
  localStorage.setItem(
    "usuarioClouder",
    JSON.stringify({ usuario: usuarioActual })
  );

  document.getElementById("modalConfirmacion").classList.remove("hidden");
  document.getElementById("modalConfirmacion").classList.add("flex");
} else {
  const error = await respuesta.json();
  alert("❌ Error al cambiar plan: " + (error.mensaje || "Error desconocido"));
  boton.textContent = "Confirmar Suscripción";
}

// Cerrar modal

// Redirigir a gestión
function redirigirGestion() {
  window.location.href = "GestionArchivos.html";
}

// Cargar información al iniciar
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("selectorPlan").value = planSeleccionado;
  cargarInformacionPlan();
});

//PERFIL USUARIO
async function actualizarPerfil(e) {
  e.preventDefault();

  if (!usuarioActual) {
    alert("❌ No hay usuario logueado");
    return;
  }

  const email = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;

  const datosActualizar = {};
  if (email !== usuarioActual.correo) datosActualizar.correo = email;
  if (usuario !== usuarioActual.usuario) datosActualizar.usuario = usuario;
  if (password) datosActualizar.contraseña = password;

  if (Object.keys(datosActualizar).length === 0) {
    alert("❌ No hay cambios para guardar");
    return;
  }

  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosActualizar),
  };

  const respuesta = await fetch(
    `${urlPostman}/usuarios/${usuarioActual.numeroUsuario}`,
    requestOptions
  );

  if (respuesta.ok) {
    const resultado = await respuesta.json();

    usuarioActual = resultado.usuario;
    localStorage.setItem(
      "usuarioClouder",
      JSON.stringify({ usuario: usuarioActual })
    );
    alert("✅ Perfil actualizado correctamente");
  } else {
    alert("❌ " + resultado.data.mensaje);
  }
}
