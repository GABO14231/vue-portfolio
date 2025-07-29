<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <input type="text" name="identifier" placeholder="Username or Email" v-model="input.identifier" required />
            <div class="password-wrapper">
                <input :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password"
                    v-model="input.password" required />
                <button type="button" @click="togglePasswordVisibility" class="toggle-password">
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <button type="submit" class="login-button">Log In</button>
        </form>
        <Modal :message="message" :buttons="[{ label: 'Close', action: clearMessage }]"></Modal>
        <div class="login-links">
            <router-link to="/">Back to Home</router-link> |
            <router-link to="/register">Register</router-link> |
            <router-link to="/recoverpass">Forgot Password?</router-link>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';
import Modal from '@/components/Modal.vue';
import {authService} from '@/services/AuthService';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default defineComponent({name: 'LoginPage', components: {Modal, FontAwesomeIcon},
    setup()
    {
        const router = useRouter();
        const message = ref('');
        const showPassword = ref(false);
        const input = ref({identifier: '', password: ''});
        const togglePasswordVisibility = () => showPassword.value = !showPassword.value;
        const clearMessage = () => message.value = '';
        const validateInput = () =>
        {
            if (!input.value.identifier || !input.value.password) return "Both fields are required.";
            const isEmail = input.value.identifier.includes(".") || input.value.identifier.includes("@");

            if (isEmail)
            {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
                if (!input.value.identifier.includes("@")) return "Email must contain '@'.";
                if (!emailRegex.test(input.value.identifier)) return "Invalid email format (check domain part).";
            }
            else
            {
                const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
                if (input.value.identifier.length < 3) return "Username must be at least 3 characters.";
                if (!usernameRegex.test(input.value.identifier)) return "Username can only contain letters, numbers, and underscores.";
            }

            if (input.value.password.length < 6) return "Password must be at least 6 characters.";
            return "";
        };

        const handleSubmit = async () =>
        {
            const validationError = validateInput();
            if (validationError)
            {
                message.value = validationError;
                return;
            }
            try
            {
                const response = await authService.login(input.value.identifier, input.value.password);
                if (response.status === 'success') router.push('/dashboard');
                else message.value = response.message;
            }
            catch (error) {message.value = error.message;}
            finally {input.value.password = '';}
        };

        return {input, message, showPassword, togglePasswordVisibility, clearMessage, handleSubmit};
    }
});
</script>

<style scoped>
.login-container
{
    max-width: 600px;
    margin: 80px auto;
    padding: 20px;
    background-color: #2a2c30;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container h2
{
    color: #4A90E2;
    margin-bottom: 15px;
}

.login-container form
{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.login-container input
{
    width: 96%;
    padding: 12px;
    border: 2px solid;
    border-color: transparent;
    border-radius: 5px;
    font-size: 16px;
    background-color: #1f2023;
    color: #dadada;
    transition: border 0.3s ease-in-out;
}

.login-container input:focus
{
    border-color: #4A90E2;
    outline: none;
}

.login-button
{
    background-color: #4A90E2;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: 0.3s ease;
}

.login-button:hover {background-color: #357ABD;}
.login-links {margin-top: 15px;}

.login-links a
{
    color: #4A90E2;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s ease;
}

.login-links a:hover {color: #ddd;}
.password-wrapper {position: relative;}

.toggle-password
{
    position: absolute;
    right: 1px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    color: #dadada;
    border: none;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.toggle-password:hover {color: #4A90E2;}
</style>