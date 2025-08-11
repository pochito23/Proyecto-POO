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

// Menú móvil
const vistaMovil = document.getElementById("vista-movil");
const Menu = document.getElementById("menu");

if (vistaMovil && Menu) {
  vistaMovil.addEventListener("click", () => {
    Menu.classList.toggle("active");
  });
}

// Función del botón principal
function comenzar() {
  alert("¡Bienvenido a Clouder! Funcionalidad próximamente...");
  // Aquí puedes redirigir a otra página o abrir un modal
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

function recuperarClave(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const preguntas = {
    mascota: "¿Cuál es el nombre de tu mascota?",
    escuela: "¿Cómo se llamaba tu escuela primaria?",
    madre: "¿Cuál es el segundo nombre de tu madre?",
  };
  let usuarioEncontrado = usuarios.find((buscar) => buscar.correo === email);
  if (!usuarioEncontrado) {
    alert("❌ Email no encontrado");
    return;
  }
  const label = document.querySelector("div.login-logo p i");
  const content = document.querySelector(".form-group");

  label.innerHTML = `Responde la siguiente pregunta de seguridad para recuperar tu cuenta`;
  content.innerHTML = `
        <div class="form-group">
            <label for="respuestaSeguridad">${usuarioEncontrado.pregunta}</label>
            <input type="text" id="respuestaSeguridad" placeholder="Ingresa tu respuesta">
        </div>
    `;
  document.querySelector(".login-button").innerHTML = "VERIFICAR RESPUESTA";
  document.querySelector(".login-button").onclick = function () {
    validarRespuestaSeguridad(usuarioEncontrado);
  };
}

function validarRespuestaSeguridad(usuario) {
  const respuestaInput = document
    .getElementById("respuestaSeguridad")
    .value.trim();
  const respuestaCorrecta = usuario.respuesta || "respuesta_default";

  if (respuestaInput.toLowerCase() === respuestaCorrecta.toLowerCase()) {
    alert(`✅ Tu contraseña es: ${usuario.contraseña}`);
  } else {
    alert("❌ Respuesta incorrecta");
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
function Registro(e) {
  e.preventDefault();

  const correo = document.getElementById("email").value;
  const Usuario = document.getElementById("usuario").value;
  const contraseña = document.getElementById("password").value;
  const pregunta = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value;



  if (usuarios.find((u) => u.usuario === Usuario || u.correo === correo)) {
    alert("❌ Usuario o correo ya registrado");
    return;

  } else {
    alert("✅ Usuario registrado correctamente.Ahora inicia sesion");
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
    }, 5000); // 5 segundos

    usuarios.push({
      correo: correo,
      contraseña: contraseña,
      usuario: Usuario,
      plan: "",
      pregunta: pregunta,
      respuesta: respuesta,
    });
    document.getElementById("email").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";
    document.getElementById("pregunta").value = "";
    document.getElementById("respuesta").value = "";
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







function validarLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value;

  let usuarioEncontrado = usuarios.find(
    (u) => u.correo === email && u.contraseña === contraseña
  );

  if (usuarioEncontrado) {
    window.location.href = 'GestionArchivos.html';
  } else {
    alert('❌ Credenciales incorrectas');
  }
}

   // Datos de los planes
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
      let planSeleccionado = "basico"; // Default
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("plan")) {
        planSeleccionado = urlParams.get("plan").toLowerCase();
      }

      // Llenar información del plan
      function cargarInformacionPlan() {
        const plan = planesData[planSeleccionado] || planesData.basico;

        document.getElementById("resumenPlan").innerHTML = `
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 class="font-bold text-text-title">${plan.nombre}</h3>
                        <p class="text-gray-600">Suscripción mensual</p>
                    </div>
                    <div class="text-xl font-bold text-primary">${plan.precio}/mes</div>
                </div>
            `;

        document.getElementById(
          "precioTotal"
        ).textContent = `${plan.precio}/mes`;

        const beneficiosHTML = plan.beneficios
          .map(
            (beneficio) =>
              `<li class="flex items-center text-sm text-gray-700">
                    <span class="mr-2">${beneficio.substring(0, 2)}</span>
                    <span>${beneficio.substring(3)}</span>
                </li>`
          )
          .join("");

        document.getElementById("beneficiosPlan").innerHTML = beneficiosHTML;
      }
// Event listener para cambio de plan
document.getElementById('selectorPlan').addEventListener('change', function(e) {
    planSeleccionado = e.target.value;
    cargarInformacionPlan();
});
      // Formatear número de tarjeta
      document
        .getElementById("numeroTarjeta")
        .addEventListener("input", function (e) {
          let valor = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
          let valorFormateado = valor.match(/.{1,4}/g)?.join(" ") || valor;
          if (valorFormateado !== valor) {
            e.target.value = valorFormateado;
          }
        });

      // Formatear fecha de vencimiento
      document
        .getElementById("fechaVencimiento")
        .addEventListener("input", function (e) {
          let valor = e.target.value.replace(/\D/g, "");
          if (valor.length >= 2) {
            valor = valor.substring(0, 2) + "/" + valor.substring(2, 4);
          }
          e.target.value = valor;
        });

      // Formatear CVV
      document.getElementById("cvv").addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });

      // Manejar envío del formulario
      document
        .getElementById("formularioPago")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          // Simular procesamiento
          const boton = document.getElementById("textoBoton");
          boton.textContent = "Procesando...";

          setTimeout(() => {
            // Actualizar plan del usuario (simulado)
            // En un sistema real, aquí harías la llamada al backend

            // Mostrar modal de confirmación
            document
              .getElementById("modalConfirmacion")
              .classList.remove("hidden");
            document.getElementById("modalConfirmacion").classList.add("flex");
          }, 2000);
        });

      // Redirigir a gestión
      function redirigirGestion() {
        window.location.href = "GestionArchivos.html";
      }

      // Cargar información al iniciar
      document.addEventListener("DOMContentLoaded", function () {
        document.getElementById('selectorPlan').value = planSeleccionado;
        cargarInformacionPlan();
      });