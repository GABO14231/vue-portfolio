<template>
    <div class="recover-password-page">
        <h2>Recover Password</h2>
        <p>Please enter your recovery code and choose a new password.</p>
        <form @submit.prevent="handleRecovery">
            <input id="recovery-code" type="text" placeholder="Enter your recovery code" v-model="code"
                name="code" maxLength="6" />
            <div class="password-wrapper">
                <input :type="showNewPassword ? 'text' : 'password'" placeholder="New Password"
                    v-model="newPassword" name="newPassword" />
                <button type="button" @click="toggleNewPasswordVisibility" class="toggle-password">
                    <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <div class="password-wrapper">
                <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm New Password"
                    v-model="confirmPassword" name="confirmPassword" />
                <button type="button" @click="toggleConfirmPasswordVisibility" class="toggle-password">
                    <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <button class="submitButton" type="submit">Reset Password</button>
        </form>
        <button class="cancelButton" @click="cancel">Cancel</button>
        <Modal :message="message" :buttons="[{ label: 'Close', action: handleModalClose }]"></Modal>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';
import Modal from '@/components/Modal.vue';
import {profileService} from '@/services/ProfileService';
import {urlService} from '@/services/URLService';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default defineComponent({name: 'RecoverPasswordPage', components: {Modal, FontAwesomeIcon},
    setup()
    {
        const router = useRouter();
        const code = ref('');
        const newPassword = ref('');
        const confirmPassword = ref('');
        const message = ref('');
        const showNewPassword = ref(false);
        const showConfirmPassword = ref(false);
        const toggleNewPasswordVisibility = () => showNewPassword.value = !showNewPassword.value;
        const toggleConfirmPasswordVisibility = () => showConfirmPassword.value = !showConfirmPassword.value;

        const handleRecovery = async () =>
        {
            if (newPassword.value !== confirmPassword.value)
            {
                message.value = 'New password and confirm password do not match.';
                return;
            }

            if (!code.value || !newPassword.value)
            {
                message.value = 'Please enter both the recovery code and a new password.';
                return;
            }

            try
            {
                const response = await profileService.recoverPassword(code.value, newPassword.value);
                message.value = response.message;
                if (response.status === 'success') setTimeout(() => router.push('/login'), 2000);
            }
            catch (error) {message.value = error.message;}
        };

        const handleModalClose = () => message.value = '';
        const cancel = () =>
        {
            const prevUrl = urlService.getPreviousUrl();
            if (prevUrl && prevUrl !== router.currentRoute.value.fullPath) router.go(-1);
            else router.push('/login');
        };

        return {code, newPassword, confirmPassword, message, showNewPassword, showConfirmPassword,
            toggleNewPasswordVisibility, toggleConfirmPasswordVisibility, handleRecovery, handleModalClose, cancel};
    },
});
</script>

<style scoped>
.recover-password-page
{
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
    background-color: #2a2c30;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.recover-password-page h2
{
    color: #4A90E2;
    margin-bottom: 15px;
}

.recover-password-page p
{
    color: #dadada;
    margin-bottom: 20px;
    font-size: 16px;
}

.recover-password-page form
{
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
}

.recover-password-page input
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

.recover-password-page input:hover
{
    border-color: #4A90E2;
    outline: none;
}

.submitButton, .cancelButton
{
    background-color: #4A90E2;
    color: white;
    padding: 12px;
    width: 100%;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.cancelButton {margin-top: 10px;}
.recover-password-page .error
{
    color: #F44336;
    font-weight: bold;
    margin-top: 10px;
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
</style>