<template>
    <div class="profile-page">
        <Navbar :options="navbarOptions"></Navbar>
        <h2>Update Profile</h2>
        <form @submit.prevent="confirmUpdate">
            <input name="username" placeholder="Username" v-model="form.username" />
            <input name="email" placeholder="Email" v-model="form.email" />
            <input name="first_name" placeholder="First Name" v-model="form.first_name" />
            <input name="last_name" placeholder="Last Name" v-model="form.last_name" />
            <h2>Change Password</h2>
            <div class="password-wrapper">
                <input :type="passwordVisibility.currentPassword ? 'text' : 'password'" name="currentPassword"
                    placeholder="Current Password" v-model="form.currentPassword" />
                <button type="button" @click="togglePasswordVisibility('currentPassword')" class="toggle-password">
                    <font-awesome-icon :icon="passwordVisibility.currentPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <div class="password-wrapper">
                <input :type="passwordVisibility.newPassword ? 'text' : 'password'" name="newPassword"
                    placeholder="New Password" v-model="form.newPassword" />
                <button type="button" @click="togglePasswordVisibility('newPassword')" class="toggle-password">
                    <font-awesome-icon :icon="passwordVisibility.newPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <div class="password-wrapper">
                <input :type="passwordVisibility.confirmPassword ? 'text' : 'password'" name="confirmPassword"
                    placeholder="Confirm New Password" v-model="form.confirmPassword" />
                <button type="button" @click="togglePasswordVisibility('confirmPassword')" class="toggle-password">
                    <font-awesome-icon :icon="passwordVisibility.confirmPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>
            <button class="submitButton" type="submit">Update Profile</button>
        </form>
        <h2>Backup Code</h2>
        <div class="password-wrapper">
            <input style="text-align: center;" :type="passwordVisibility.backupCode ? 'text' : 'password'" readonly
                v-model="form.code" />
            <button type="button" @click="togglePasswordVisibility('backupCode')" class="toggle-password">
                <font-awesome-icon :icon="passwordVisibility.backupCode ? 'eye-slash' : 'eye'" />
            </button>
        </div>
        <button style="width: 100%" class="backupButton" @click="confirmGenerateNewCode">Change Backup Code</button>
        <hr />
        <button class="deleteButton" @click="goToDeleteProfile">Delete Profile</button>
        <Modal v-if="showMessageModal" :message="message" :buttons="[{ label: 'Close', action: closeModal }]"></Modal>
        <Modal v-if="showConfirmModal" :message="confirmModalConfig.message" :buttons="confirmModalConfig.buttons"></Modal>
    </div>
</template>

<script>
import {defineComponent, ref, reactive, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Modal from '@/components/Modal.vue';
import {profileService} from '@/services/ProfileService';
import {authService} from '@/services/AuthService';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default defineComponent({name: 'ProfilePage', components: {Navbar, Modal, FontAwesomeIcon},
    setup()
    {
        const router = useRouter();
        const user = authService.user;
        const message = ref('');
        const showMessageModal = ref(false);
        const showConfirmModal = ref(false);
        const confirmModalConfig = reactive({message: '', buttons: [],});
        const form = reactive({username: '', email: '', first_name: '', last_name: '', currentPassword: '',
            newPassword: '', confirmPassword: '', code: '',});
        const passwordVisibility = reactive({currentPassword: false, newPassword: false, confirmPassword: false,
            backupCode: false});

        const validateInput = () =>
        {
            const {username, email, currentPassword, newPassword, confirmPassword} = form;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
            if (!email.includes("@")) return "Email must contain '@'.";
            if (!emailRegex.test(email)) return "Invalid email format (check domain part).";

            const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
            if (username.length < 3) return "Username must be at least 3 characters.";
            if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, and underscores.";
            if ((currentPassword !== '') || (newPassword !== '') || (confirmPassword !== ''))
            {
                if (((currentPassword === "") && (confirmPassword !== "")) || ((currentPassword === "") && (newPassword !== ""))) return "Please insert your current password."
                if (((newPassword !== "") && (confirmPassword === "")) || ((confirmPassword !== "") && (newPassword === ""))) return "Please enter your new password twice."
                if ((currentPassword.length < 6) || (newPassword.length < 6) || (confirmPassword.length < 6)) return "Password must be at least 6 characters.";
                if (newPassword !== confirmPassword) return "The passwords do not match."
                if ((newPassword === confirmPassword) && (confirmPassword === currentPassword)) return "You are using your current password. Please use a new one."
            }
            return "";
        };
        
        const handleLogout = async () =>
        {
            try
            {
                await authService.logout();
                router.push('/');
            }
            catch (err)
            {
                console.error(`Logout failed: ${err}`);
                message.value = "Logout failed.";
                showMessageModal.value = true;
            }
        };
        const navbarOptions = ref([{label: "Home", path: "/"}, {label: "Portfolio", path: "/dashboard"},
            {label: "Log Out", method: handleLogout}]);

        const togglePasswordVisibility = (field) => passwordVisibility[field] = !passwordVisibility[field];
        const closeModal = () =>
        {
            message.value = '';
            showMessageModal.value = false;
        };

        const confirmUpdate = () =>
        {
            confirmModalConfig.message = 'Are you sure you want to update your profile?';
            confirmModalConfig.buttons = [{label: 'Yes', action: handleUpdate},
                {label: 'No', action: () => showConfirmModal.value = false}];
            showConfirmModal.value = true;
        };

        const handleUpdate = async () =>
        {
            showConfirmModal.value = false;
            const validationError = validateInput();
            if (validationError)
            {
                message.value = validationError;
                showMessageModal.value = true;
                return;
            }

            try
            {
                const payload = {};
                payload.username = form.username;
                payload.email = form.email;
                payload.first_name = form.first_name;
                payload.last_name = form.last_name;

                if (form.newPassword)
                {
                    payload.currentPassword = form.currentPassword;
                    payload.newPassword = form.newPassword;
                }

                const response = await profileService.loadProfile(payload, user.value);
                message.value = response.message;
                await authService.checkSession();
            }
            catch (error) {message.value = error.message;}
            finally
            {
                showMessageModal.value = true;
                form.currentPassword = '';
                form.newPassword = '';
                form.confirmPassword = '';
            }
        };

        const confirmGenerateNewCode = () =>
        {
            confirmModalConfig.message = 'Generating a new backup code will invalidate the old one. Are you sure?';
            confirmModalConfig.buttons = [{label: 'Yes', action: handleGenerateNewCode},
                {label: 'No', action: () => showConfirmModal.value = false},];
            showConfirmModal.value = true;
        };

        const handleGenerateNewCode = async () =>
        {
            showConfirmModal.value = false;
            try
            {
                const response = await profileService.updateCode(user.value.id);
                message.value = response.message;
                await authService.checkSession();
            }
            catch (error) {message.value = error.message;}
            finally {showMessageModal.value = true;}
        };

        const goToDeleteProfile = () => router.push('/delprofile');
        onMounted(async () =>
        {
            watch(user, (newUser) =>
            {
                if (newUser)
                {
                    form.username = newUser.username || '';
                    form.email = newUser.email || '';
                    form.first_name = newUser.first_name || '';
                    form.last_name = newUser.last_name || '';
                    form.code = newUser.code || '';
                }
                else
                {
                    form.username = '';
                    form.email = '';
                    form.first_name = '';
                    form.last_name = '';
                    form.code = '';
                    router.push('/login');
                }
            }, {immediate: true});
        });

        return {navbarOptions, form, passwordVisibility, message, showMessageModal, showConfirmModal,
            confirmModalConfig, togglePasswordVisibility, closeModal, confirmUpdate, confirmGenerateNewCode,
            goToDeleteProfile};
    }
});
</script>

<style scoped>
.profile-page
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

.profile-page h2
{
    color: #4A90E2;
    margin-bottom: 12px;
}

.profile-page form
{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profile-page input
{
    width: 96%;
    padding: 12px;
    border: 2px solid transparent;
    border-radius: 5px;
    font-size: 16px;
    background-color: #1f2023;
    color: #dadada;
    transition: border 0.3s ease-in-out;
}

.profile-page input:focus
{
    border-color: #4A90E2;
    outline: none;
}

.backupButton, .submitButton
{
    margin-top: 10px;
    background-color: #4A90E2;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s ease;
}

.deleteButton
{
    width: 100%;
    background-color: red;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s ease;
}

.deleteButton:hover {background-color: #d90303;}
.backupButton:hover, .submitButton:hover {background-color: #357ABD;}
.profile-page hr
{
    margin: 20px 0;
    border: none;
    border-top: 1px solid #4A90E2;
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