<template>
    <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleSubmit">
            <input name="username" placeholder="Username" v-model="input.username" />
            <input name="email" placeholder="Email" v-model="input.email" />
            <input name="first_name" placeholder="First Name" v-model="input.first_name" />
            <input name="last_name" placeholder="Last Name" v-model="input.last_name" />
            <div class="password-wrapper">
                <input :type="showPassword ? 'text' : 'password'" name="password" placeholder="Password"
                    v-model="input.password" />
                <button type="button" @click="togglePasswordVisibility" class="toggle-password">
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <button type="submit" class="submitButton">Register</button>
        </form>
        <Modal :message="message" :buttons="[{ label: 'Close', action: handleModalClose }]"></Modal>
        <div class="login-links">
            <a @click="previousPage">Go Back</a>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import Modal from '@/components/Modal.vue';
import {profileService} from '@/services/ProfileService';
import {urlService} from '@/services/URLService';

export default defineComponent({name: 'RegisterPage', components: {Modal, FontAwesomeIcon},
    setup()
    {
        const router = useRouter();
        const input = reactive({username: '', email: '', first_name: '', last_name: '', password: ''});
        const message = ref('');
        const showPassword = ref(false);

        const handleSubmit = async () =>
        {
            if (!input.username || !input.email || !input.password)
            {
                message.value = 'Please fill in all required fields.';
                return;
            }
            if (input.password.length < 6)
            {
                message.value = 'Password must be at least 6 characters long.';
                return;
            }

            try
            {
                const response = await profileService.registerUser(input);
                if (response.status === 'success')
                {
                    message.value = 'Registration successful!';
                    router.push('/login');
                }
                else message.value = response.data && response.data.message ? response.data.message : 'Registration failed.';
            }
            catch (error)
            {
                message.value = error.message;
                console.error('Registration error:', error);
            }
        };

        const handleModalClose = () => {message.value = '';};
        const togglePasswordVisibility = () => {showPassword.value = !showPassword.value;};

        const previousPage = () =>
        {
            const prevUrl = urlService.getPreviousUrl();
            if (prevUrl && prevUrl !== '/register' && prevUrl !== '/login') router.go(-1);
            else router.push('/');
        };

        return {input, handleSubmit, message, handleModalClose, showPassword, togglePasswordVisibility, previousPage};
    }
});
</script>

<style scoped>
.register-container
{
    max-width: 600px;
    margin: 80px auto;
    padding: 20px;
    background-color: #2a2c30;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-container h2
{
    color: #4A90E2;
    margin-bottom: 15px;
}

.register-container form
{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.register-container input
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

.register-container input:focus
{
    border-color: #4A90E2;
    outline: none;
}

.submitButton
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

.submitButton:hover {background-color: #357ABD;}
.register-container .error
{
    color: #F44336;
    font-weight: bold;
}

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
.login-links {margin-top: 15px; cursor: pointer;}

.login-links a
{
    color: #4A90E2;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s ease;
}
.login-links a:hover {color: #ddd;}
</style>