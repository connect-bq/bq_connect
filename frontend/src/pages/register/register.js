document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const idNumber = document.getElementById('ident_number');
    const idFullName = document.getElementById('user_full');
    const idEmail = document.getElementById('email');
    const idPhone = document.getElementById('phone');
    const idAge = document.getElementById('age');
    const idPassword = document.getElementById('password');
    const submitButton = document.getElementById('bt-register');

    //
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validaciones
        if (
            idNumber.value === "" ||
            idFullName.value === "" ||
            idEmail.value === "" ||
            idPhone.value === "" ||
            idAge.value === "" ||
            idPassword.value === ""
        ) {
            alert("Please complete all fields.");
            return;
        }
        if (idPassword.value.length < 6) {
            alert("The password must be at least 6 characters.");
            return;
        }
        if (!validateEmail(idEmail.value)) {
            alert("Por favor, ingrese un correo electrónico válido.");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Registrando...';
        submitButton.classList.add('opacity-70');

        const formData = {
            identity_number: idNumber.value,
            username: idFullName.value,
            email: idEmail.value,
            phone: idPhone.value,
            age: idAge.value,
            password: idPassword.value,
        };

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registration successful! Now, please log in.');
                window.location.href = 'login';
            } else {
                alert(data.message || 'Registration error.');
            }
        } catch (error) {
            alert('Could not connect to the server.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Sing In';
            submitButton.classList.remove('opacity-70');
        }
    });

    // Phone number validation (digits only)
    idPhone.addEventListener('input', () => {
        idPhone.value = idPhone.value.replace(/[^\d]/g, '');
    });

    // Age validation (digits only and greater than 0)
    idAge.addEventListener('input', () => {
        idAge.value = idAge.value.replace(/[^\d]/g, '');
        if (parseInt(idAge.value) < 0) {
            idAge.value = '';
        }
    });

    // ID number validation (digits only and max 20 characters)
    idNumber.addEventListener('input', () => {
        idNumber.value = idNumber.value.replace(/[^\d]/g, '');
        if (idNumber.value.length > 20) {
            idNumber.value = idNumber.value.slice(0, 20);
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
