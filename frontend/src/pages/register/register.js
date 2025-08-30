document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-button');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageDiv.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        submitButton.classList.add('opacity-70');

        const formData = {
            identity_number: document.getElementById('identity_number').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            password: document.getElementById('password').value,
        };

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert('¡Registro exitoso! Ahora, por favor inicia sesión.');
                window.location.href = '/login';
            } else {
                errorMessageDiv.textContent = data.message || 'Error en el registro.';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'No se pudo conectar al servidor.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Registrarse';
            submitButton.classList.remove('opacity-70');
        }
    });
});


const idNumber= document.getElementById('identity_number');
const idFullName= document.getElementById('full_name');
const idEmail= document.getElementById('email');
const idPhone= document.getElementById('phone');
const idAge= document.getElementById('age');
const idPassword= document.getElementById('password');
const idBtn= document.getElementById('bt-register');


idBtn.addEventListener('click',()=>{
    if(idNumber.value=="" || idFullName.value=="" || idEmail.value=="" || idPhone.value=="" || idAge.value=="" || idPassword.value==""){
        alert("Por favor, complete todos los campos.");
    } else {
        if(idPassword.value.length < 6){
            alert("La contraseña debe tener al menos 6 caracteres.");
        } else {
            if(!validateEmail(idEmail.value)){
                alert("Por favor, ingrese un correo electrónico válido.");
            } else {
                registerForm.submit();
            }
        }
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Validación de número de teléfono (opcional)
idPhone.addEventListener('input', () => {
    const phonePattern = /^\d*$/; // Solo permite dígitos
    if (!phonePattern.test(idPhone.value)) {
        idPhone.value = idPhone.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
    }
});

// Validación de edad (opcional)
idAge.addEventListener('input', () => {
    const agePattern = /^\d*$/; // Solo permite dígitos
    if (!agePattern.test(idAge.value)) {
        idAge.value = idAge.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
    }
    if (idAge.value < 0) {
        idAge.value = '';
    }
});
// Validación de número de identificación (opcional)
idNumber.addEventListener('input', () => {
    const idPattern = /^\d*$/; // Solo permite dígitos
    if (!idPattern.test(idNumber.value)) {
        idNumber.value = idNumber.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
    }
    if (idNumber.value.length > 20) { // Limita la longitud a 20 caracteres
        idNumber.value = idNumber.value.slice(0, 20);
    }
}); 
