document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-button');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessageDiv.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Ingresando...';
        submitButton.classList.add('opacity-70');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                window.location.href = '/dashboard';
            } else {
                errorMessageDiv.textContent = data.message || 'Credenciales inválidas.';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'No se pudo conectar al servidor.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Iniciar Sesión';
            submitButton.classList.remove('opacity-70');
        }
    });
});