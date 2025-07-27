<template>
    <div class="delete-profile-page">
        <h2>Delete Profile</h2>
        <p>This action cannot be undone.</p>
        <form @submit.prevent>
            <div class="password-wrapper">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Enter your password to confirm"
                    v-model="password" name="password" />
                <button type="button" @click="togglePasswordVisibility" class="toggle-password">
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <button class="deleteButton" type="button" @click="confirmDeleteProfile()">Confirm Delete</button>
        </form>
        <Modal v-if="showConfirmModal" :message="confirmModalConfig.message" :buttons="confirmModalConfig.buttons"></Modal>
        <Modal v-if="message" :message="message" :buttons="[{ label: 'Close', action: clearMessage }]"></Modal>
        <button class="cancelButton" @click="cancel()">Cancel</button>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';
import Modal from '@/components/Modal.vue';
import {profileService} from '@/services/ProfileService'
import {authService} from '@/services/AuthService';
import {urlService} from '@/services/URLService';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default defineComponent({name: 'DeleteProfilePage', components: {Modal, FontAwesomeIcon},
    setup()
    {
        const router = useRouter();
        const password = ref('');
        const showPassword = ref(false);
        const message = ref('');
        const showConfirmModal = ref(false);
        const confirmModalConfig = ref({message: '', buttons: []});
        const user = authService.user;
        const togglePasswordVisibility = () => showPassword.value = !showPassword.value;

        const confirmDeleteProfile = () =>
        {
            confirmModalConfig.value =
            {
                message: 'Are you sure you want to delete your profile? This action cannot be undone.',
                buttons: [{label: 'Yes', action: handleDeleteProfile},
                    {label: 'No', action: () => showConfirmModal.value = false},],
            };
            showConfirmModal.value = true;
        };

        const handleDeleteProfile = async () =>
        {
            showConfirmModal.value = false;
            try
            {
                if (!user.value || !user.value.id)
                {
                    message.value = "User not logged in or ID missing.";
                    return;
                }

                const response = await profileService.deleteProfile(password.value, user.value.id);
                message.value = response.message;
                if (response.status === 'success')
                {
                    await authService.logout();
                    setTimeout(() => router.push('/'), 2000);
                }
            }
            catch (error) {message.value = error.message;}
            finally {password.value = '';}
        };

        const clearMessage = () => message.value = '';
        const cancel = () =>
        {
            const prevUrl = urlService.getPreviousUrl();
            if (prevUrl && prevUrl !== router.currentRoute.value.fullPath) router.go(-1);
            else router.push('/profile');
        };

        return {password, showPassword, message, showConfirmModal, confirmModalConfig, togglePasswordVisibility,
            confirmDeleteProfile, clearMessage, cancel};
    },
});
</script>

<style scoped>
.delete-profile-page
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

.delete-profile-page h2
{
    color: #dc3545;
    margin-bottom: 15px;
}

.delete-profile-page p
{
    color: #dadada;
    margin-bottom: 20px;
    font-size: 16px;
}

.delete-profile-page form
{
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
}

.delete-profile-page input
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

.delete-profile-page input:hover
{
    border-color: #4A90E2;
    outline: none;
}

.deleteButton, .cancelButton
{
    background-color: red;
    color: white;
    padding: 12px;
    width: 100%;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.cancelButton
{
    background-color: #4A90E2;
    margin-top: 10px;
    width: 100%;
}
.cancelButton:hover {background-color: #357ABD;}

.delete-profile-page .error
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