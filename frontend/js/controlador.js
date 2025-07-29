var usuarios = [
  {
    correo: "eduardo@gmail.com",
    contraseña: "1234",
    usuario: "eduardo",
    plan: "gratis",
    pregunta: "¿Cuál es el nombre de tu mascota?",
    respuesta: "perro",
  },
  {
    correo: "Kevin@gmail.com",
    contraseña: "1234",
    usuario: "kevin",
    plan: "gratis",
    pregunta: "¿Cuál es el segundo nombre de tu madre?",
    respuesta: "...",
  },
  {
    correo: "Kristhian@gmail.com",
    contraseña: "1234",
    usuario: "kristiam",
    plan: "gratis",
    pregunta: "¿Cuál es el nombre de tu mascota?",
    respuesta: "gato",
  },
  {
    correo: "Maria@gmail.com",
    contraseña: "1234",
    usuario: "maria",
    plan: "gratis",
    pregunta: "¿Cómo se llamaba tu escuela primaria?",
    respuesta: "uruguay",
  },
  {
    correo: "Jose@gmail.com",
    contraseña: "1234",
    usuario: "Pochito",
    plan: "Pro",
    pregunta: "¿Cómo se llamaba tu escuela primaria?",
    respuesta: "uruguay",
  },
];

// Menú móvil
const mobileToggle = document.getElementById("mobile-toggle");
const mobileMenu = document.getElementById("menu-mobile");

if(mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

// Función del botón principal
function comenzar() {
  alert("¡Bienvenido a Clouder! Funcionalidad próximamente...");
  // Aquí puedes redirigir a otra página o abrir un modal
}

// Cerrar menú móvil al hacer click en un enlace
const mobileLinks = document.querySelectorAll("#menu-mobile a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});

//==============Codigo del registro, inicio de sesion de cuenta y recuperar contraseña ============================
//============================ Recuperar password (no se me ocurrieron mejores nombres jsjs)============================
if(document.getElementById("respuesta")) {
  document.getElementById("respuesta").style.display = "none";
}
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

  function mostrarPregunta() {
    const pregunta = document.getElementById("pregunta").value;
    const respuestaDiv = document.getElementById("respuesta").parentElement;

    if (pregunta !== "") {
      respuestaDiv.style.display = "block";
    } else {
      respuestaDiv.style.display = "none";
    }
  }


function validarLogin(e){
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value;

  let usuarioEncontrado = usuarios.find(
    (u) => u.correo === email && u.contraseña === contraseña
  );

  if(usuarioEncontrado){
    window.location.href = 'GestionArchivos.html';
  } else {
    alert('❌ Credenciales incorrectas');
  }
}
