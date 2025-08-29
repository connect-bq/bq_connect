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