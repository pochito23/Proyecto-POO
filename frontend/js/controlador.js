// ===== CONFIGURACIÓN Y VARIABLES GLOBALES =====
const urlPostman = "http://localhost:3000";
let usuarioActual = null;

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = localStorage.getItem("usuarioClouder");
  if (usuarioGuardado) {
    usuarioActual = JSON.parse(usuarioGuardado);
    const elementoUsuario = document.getElementById("usuarioActual");
    if (elementoUsuario) {
      elementoUsuario.textContent = `Usuario: ${usuarioActual.usuario || usuarioActual.usuario?.usuario}`;
    }
  }

  // Configurar grupo de respuesta de seguridad en registro
  const grupoRespuesta = document.getElementById("grupo-respuesta");
  const selectPregunta = document.getElementById("pregunta");

  if (grupoRespuesta && selectPregunta) {
    grupoRespuesta.style.display = "none";

    selectPregunta.addEventListener("change", function () {
      if (selectPregunta.value !== "") {
        grupoRespuesta.style.display = "block";
      } else {
        grupoRespuesta.style.display = "none";
      }
    });
  }
});

// ===== MENÚ MÓVIL (LANDING) =====
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
    if (Menu) {
      Menu.classList.remove("active");
    }
  });
});

// ===== FUNCIONES DE AUTENTICACIÓN =====

// ***** LOGIN *****
async function validarLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("password").value;
  const alertDiv = document.querySelector(".alert");

  // Limpiar alertas previas
  if (alertDiv) {
    alertDiv.innerHTML = "";
  }

  // Validaciones básicas
  if (!email || !contraseña) {
    if (alertDiv) {
      alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Por favor completa todos los campos</label>';
    } else {
      alert('❌ Por favor completa todos los campos');
    }
    return;
  }

  try {
    console.log('Intentando hacer login con:', { correo: email }); // Debug (sin mostrar contraseña)

    const response = await fetch(`${urlPostman}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: email,
        contraseña: contraseña
      })
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('Login exitoso, guardando usuario:', data.usuario);
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('usuarioClouder', JSON.stringify({
        usuario: data.usuario,
        mensaje: data.mensaje
      }));
      
      usuarioActual = data.usuario;
      
      // Mostrar mensaje de éxito
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-check"></i> <label style="color: green;">✅ ' + data.mensaje + '</label>';
        alertDiv.style.color = 'green';
      }
      
      // Redireccionar después de un breve delay
      setTimeout(() => {
        window.location.href = 'GestionArchivos.html';
      }, 1000);
      
    } else {
      console.error('Error en login:', data);
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ ' + data.mensaje + '</label>';
        alertDiv.style.color = 'red';
      } else {
        alert('❌ ' + data.mensaje);
      }
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    if (alertDiv) {
      alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ Error de conexión con el servidor</label>';
      alertDiv.style.color = 'red';
    } else {
      alert('❌ Error de conexión con el servidor');
    }
  }
}

// ***** REGISTRO *****
async function Registro(e) {
  e.preventDefault();

  const correo = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = document.getElementById("password").value;
  const preguntaSeleccionada = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value.trim();
  const alertDiv = document.querySelector(".alert");

  // Mapeo de preguntas
  const preguntas = {
    mascota: "¿Cuál es el nombre de tu mascota?",
    escuela: "¿Cómo se llamaba tu escuela primaria?",
    madre: "¿Cuál es el segundo nombre de tu madre?"
  };

  // Limpiar alertas previas
  if (alertDiv) {
    alertDiv.innerHTML = "";
  }

  // Validar formulario
  if (!validarFormulario()) {
    return;
  }

  try {
    console.log('Intentando registrar usuario...');
    
    const response = await fetch(`${urlPostman}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        usuario,
        contraseña,
        preguntaSeguridad: preguntas[preguntaSeleccionada],
        respuestaSeguridad: respuesta
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      // Registro exitoso
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-check"></i> <label style="color: green;">✅ ' + data.mensaje + '</label>';
        alertDiv.style.color = 'green';
      }
      
      // Limpiar formulario
      document.getElementById("email").value = "";
      document.getElementById("usuario").value = "";
      document.getElementById("password").value = "";
      document.getElementById("pregunta").value = "";
      document.getElementById("respuesta").value = "";
      
      // Ocultar grupo de respuesta
      const grupoRespuesta = document.getElementById("grupo-respuesta");
      if (grupoRespuesta) {
        grupoRespuesta.style.display = "none";
      }
      
      // Efecto visual en botón (si existe)
      const iniciaSesionBtn = document.getElementById("inicioSes");
      if (iniciaSesionBtn) {
        iniciaSesionBtn.innerHTML = `
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
          iniciaSesionBtn.innerHTML = `<button>INICIA SESIÓN</button>`;
        }, 5000);
      }
      
    } else {
      // Error en el registro
      let errorMsg = data.mensaje || data;
      if (typeof data === 'string' && data.includes('ya existe')) {
        errorMsg = data;
      }
      
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ ' + errorMsg + '</label>';
        alertDiv.style.color = 'red';
      } else {
        alert('❌ ' + errorMsg);
      }
    }
  } catch (error) {
    console.error('Error al registrar:', error);
    if (alertDiv) {
      alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ Error de conexión con el servidor</label>';
      alertDiv.style.color = 'red';
    } else {
      alert('❌ Error de conexión con el servidor');
    }
  }
}

// ***** RECUPERAR CONTRASEÑA *****
async function recuperarClave(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const alertDiv = document.querySelector(".alert");
  
  // Limpiar alertas previas
  if (alertDiv) {
    alertDiv.innerHTML = "";
  }
  
  if (!email) {
    if (alertDiv) {
      alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Por favor ingresa tu correo</label>';
      alertDiv.style.color = 'red';
    } else {
      alert("❌ Por favor ingresa tu correo");
    }
    return;
  }

  try {
    console.log('Intentando recuperar contraseña para:', email);
    
    const response = await fetch(`${urlPostman}/usuarios/recuperar-contrasena`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: email }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.status === 404) {
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ Email no encontrado</label>';
        alertDiv.style.color = 'red';
      } else {
        alert("❌ Email no encontrado");
      }
      return;
    }

    if (response.status === 400 && data.mensaje && data.mensaje.includes("¿")) {
      // El servidor devolvió la pregunta de seguridad
      mostrarFormularioRespuesta(email, data.mensaje);
    } else {
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ ' + data.mensaje + '</label>';
        alertDiv.style.color = 'red';
      } else {
        alert("❌ " + data.mensaje);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    if (alertDiv) {
      alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ Error de conexión con el servidor</label>';
      alertDiv.style.color = 'red';
    } else {
      alert('❌ Error de conexión con el servidor');
    }
  }

  function mostrarFormularioRespuesta(email, pregunta) {
    const loginlog = document.querySelector("div.login-logo p i");
    const content = document.querySelector(".form-group");

    if (loginlog) {
      loginlog.innerHTML = `Responde la siguiente pregunta de seguridad para recuperar tu cuenta`;
    }
    
    if (content) {
      content.innerHTML = `
        <div class="form-group">
            <label for="respuestaSeguridad">${pregunta}</label>
            <input type="text" id="respuestaSeguridad" placeholder="Ingresa tu respuesta">
        </div>
      `;
    }
    
    const submitBtn = document.querySelector(".login-button");
    if (submitBtn) {
      submitBtn.innerHTML = "VERIFICAR RESPUESTA";
      submitBtn.onclick = function () {
        validarRespuestaSeguridad(email);
      };
    }
  }

  async function validarRespuestaSeguridad(email) {
    const respuestaInput = document.getElementById("respuestaSeguridad");
    const alertDiv = document.querySelector(".alert");
    
    if (!respuestaInput) {
      alert("❌ Error: No se encontró el campo de respuesta");
      return;
    }
    
    const respuesta = respuestaInput.value.trim();
    
    if (!respuesta) {
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Por favor ingresa tu respuesta</label>';
        alertDiv.style.color = 'red';
      } else {
        alert("❌ Por favor ingresa tu respuesta");
      }
      return;
    }

    try {
      console.log('Validando respuesta de seguridad...');
      
      const response = await fetch(`${urlPostman}/usuarios/recuperar-contrasena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          respuestaSeguridad: respuesta,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.contraseña) {
        alert(`✅ ${data.mensaje}. Tu contraseña es: ${data.contraseña}`);
        setTimeout(() => {
          window.location.href = "Login.html";
        }, 1000);
      } else {
        if (alertDiv) {
          alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ ' + data.mensaje + '</label>';
          alertDiv.style.color = 'red';
        } else {
          alert("❌ " + data.mensaje);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (alertDiv) {
        alertDiv.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>❌ Error de conexión con el servidor</label>';
        alertDiv.style.color = 'red';
      } else {
        alert('❌ Error de conexión con el servidor');
      }
    }
  }
}

// ===== VALIDACIÓN DE FORMULARIOS =====
function validarFormulario() {
  const email = document.getElementById("email").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  const pregunta = document.getElementById("pregunta").value;
  const respuesta = document.getElementById("respuesta").value.trim();
  const alert = document.querySelector(".alert");

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // Limpiar alertas
  if (alert) {
    alert.innerHTML = "";
  }

  // Validar campos vacíos
  if (!email) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Debe completar el campo de email</label>';
      alert.style.color = 'red';
    }
    return false;
  }
  
  if (!usuario) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Debe completar el campo de Usuario</label>';
      alert.style.color = 'red';
    }
    return false;
  }
  
  if (!password) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Debe completar el campo de contraseña</label>';
      alert.style.color = 'red';
    }
    return false;
  }
  
  if (!pregunta) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Debe seleccionar una pregunta de seguridad</label>';
      alert.style.color = 'red';
    }
    return false;
  }
  
  if (!respuesta) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>Debe completar la respuesta de seguridad</label>';
      alert.style.color = 'red';
    }
    return false;
  }

  // Validar formato de correo
  if (!emailRegex.test(email)) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>El correo no cumple con los requisitos</label>';
      alert.style.color = 'red';
    }
    return false;
  }

  // Validar formato de contraseña
  if (!passRegex.test(password)) {
    if (alert) {
      alert.innerHTML = '<i class="fa-solid fa-exclamation"></i> <label>La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial.</label>';
      alert.style.color = 'red';
    }
    return false;
  }

  return true;
}

// ===== PERFIL Y ACTUALIZACIÓN DE USUARIO =====
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

  try {
    const response = await fetch(`${urlPostman}/usuarios/${usuarioActual.numeroUsuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosActualizar),
    });

    const resultado = await response.json();

    if (response.ok) {
      usuarioActual = resultado.usuario;
      localStorage.setItem("usuarioClouder", JSON.stringify({ usuario: usuarioActual }));
      alert("✅ Perfil actualizado correctamente");
    } else {
      alert("❌ " + resultado.mensaje);
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    alert('❌ Error de conexión con el servidor');
  }
}

// ===== PLANES Y SUSCRIPCIONES =====
const planesData = {
  gratis: {
    nombre: "Plan Gratuito",
    precio: "$0.00",
    cantidad: 1,
    beneficios: [
      "✅  Proyecto único",
      "✅  Vista previa",
      "✅  Acceso web",
      "❌  Sin soporte prioritario",
    ],
  },
  basico: {
    nombre: "Plan Basico",
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
    precio: "$19.99",
    cantidad: 10,
    beneficios: [
      "✅  10 proyectos",
      "✅  Todas las características básicas",
      "✅  Soporte prioritario 24/7",
      "✅  Colaboración en equipo",
    ],
  },
  empresarial: {
    nombre: "Plan Empresarial",
    precio: "$49.99",
    cantidad: 100,
    beneficios: [
      "✅  Proyectos ilimitados",
      "✅  Todas las características Pro",
      "✅  Administración de usuarios",
      "✅  Gerente de cuenta dedicado",
    ],
  },
};

// Obtener plan seleccionado
let planSeleccionado = "basico";
const urlParametro = new URLSearchParams(window.location.search);
if (urlParametro.get("plan")) {
  planSeleccionado = urlParametro.get("plan").toLowerCase();
}

// Llenar información del plan
function cargarInformacionPlan() {
  const plan = planesData[planSeleccionado] || planesData.gratis;

  const resumenElemento = document.getElementById("resumenPlan");
  const precioElemento = document.getElementById("precioTotal");
  const beneficiosElemento = document.getElementById("beneficiosPlan");
  
  if (resumenElemento) {
    resumenElemento.innerHTML = `
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
    ).join('');
    beneficiosElemento.innerHTML = beneficiosHTML;
  }
}

// Event listeners para formularios de pago
document.addEventListener('DOMContentLoaded', function() {
  const selectorPlan = document.getElementById("selectorPlan");

  if (selectorPlan) {
    // Establecer el valor seleccionado basado en la URL o en 'basico'
    planSeleccionado = urlParametro.get("plan")?.toLowerCase() || "basico";
    selectorPlan.value = planSeleccionado;
    
    selectorPlan.addEventListener("change", function (e) {
      planSeleccionado = e.target.value;
      cargarInformacionPlan();
    });
    cargarInformacionPlan();
  }

  // Formatear número de tarjeta
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

  // Formatear fecha de vencimiento
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

  // Formatear CVV
  const cvv = document.getElementById("cvv");
  if (cvv) {
    cvv.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
  }

  // Formulario de pago
  const formularioPago = document.getElementById("formularioPago");
  if (formularioPago) {
    formularioPago.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!usuarioActual) {
        alert("❌ Debes iniciar sesión primero");
        return;
      }

      const boton = document.getElementById("textoBoton");
      if (boton) {
        boton.textContent = "Procesando...";
      }

      try {
        const response = await fetch(`${urlPostman}/usuarios/${usuarioActual.numeroUsuario}/plan`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: planSeleccionado,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          usuarioActual.plan = planSeleccionado;
          localStorage.setItem("usuarioClouder", JSON.stringify({ usuario: usuarioActual }));

          setTimeout(() => {
            const modalConfirmacion = document.getElementById("modalConfirmacion");
            if (modalConfirmacion) {
              modalConfirmacion.classList.remove("hidden");
              modalConfirmacion.classList.add("flex");
            }
            if (boton) {
              boton.textContent = "Confirmar Suscripción";
            }
          }, 2000);
        } else {
          const error = await response.json();
          alert("❌ Error al cambiar plan: " + (error.mensaje || "Error desconocido"));
          if (boton) {
            boton.textContent = "Confirmar Suscripción";
          }
        }
      } catch (error) {
        console.error('Error al cambiar plan:', error);
        alert('❌ Error de conexión con el servidor');
        if (boton) {
          boton.textContent = "Confirmar Suscripción";
        }
      }
    });
  }
});

// Función para redirigir a gestión
function redirigirGestion() {
  window.location.href = "GestionArchivos.html";
}