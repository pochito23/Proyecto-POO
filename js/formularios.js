//==============Codigo del registro, inicio de sesion de cuenta y recuperar contraseña ============================
//============================ Recuperar password (no se me ocurrieron mejores nombres jsjs)============================
function Siguiente() {
    const label = document.querySelector('div.login-logo p i');
    const content = document.querySelector('.form-group');
    //const btn = document.querySelector('.login-button');
    label.innerHTML = ` <p><i>Responde la siguiente pregunta de seguridad para recuperar tu cuenta</i></p>`;
    content.innerHTML = `
                <div class="form-group">
                    <label for="email">¿Cual es el nombre de tu mascota?</label>
                    <input type="text" name="email" placeholder="Ingresa tu correo">
                </div>
    `;
    // btn.removeEventListener("onclick");
    // btn.addEventListener("onclick", Finalizar);
}



//============================ Validacion del formulario ============================
function validarFormulario() {
    const email = document.querySelector('#email').value.trim();
    const usuario = document.querySelector('#usuario').value.trim();
    const password = document.querySelector('#password').value;
    const alert = document.querySelector('.alert');
    //Regex
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    //Campos vacios
    alert.innerHTML = ``;
    if (email == '') {
        alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de email</label>`;
    } else if (usuario == '') {
        alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de Usuario</label>`;
    } else if (password == '') {
        alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>Debe de completar el campo de contraseña</label>`;
    }

    //Validacion del correo y password
    if (!emailRegex.test(email)) {
        alert.innerHTML = `<i class="fa-solid fa-exclamation"></i> <label>El correo no cumple con los requisitos</label>`;
        return false;
    }
    if (!passRegex.test(password)) {
        alert.innerHTML =
            `<i class="fa-solid fa-exclamation"></i>
            <label>La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial.</label>`;
        return false;
    }

    return true;
}
