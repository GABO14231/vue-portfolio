<template>
    <div>
        <Navbar :options="homeOptions"></Navbar>
        <header class="home">
            <h1>Welcome to Vue Portfolio</h1>
            <p>Show off all your accomplishments.</p>
            <img src="/src/assets/logo.svg" alt="Logo" class="logo">
            <p style="font-size: 25px;">Made using Vue.js.</p>
            <p>Project by Gabriel Morazan</p>
        </header>
    </div>
</template>

<script>
import {defineComponent, ref, onMounted, watch} from 'vue';
import Navbar from '@/components/Navbar.vue';
import {authService} from '@/services/AuthService';
import {useRouter} from 'vue-router';

export default defineComponent({name: 'HomePage', components: {Navbar},
    setup()
    {
        const user = ref(null);
        const homeOptions = ref([]);
        const router = useRouter();

        const handleLogout = async () =>
        {
            console.log("Logging out...");
            try
            {
                const response = await authService.logout();
                console.log(response.message);
                router.push('/');
            }
            catch (err) {console.error(`Logout failed: ${err}`);}
        };

        const setHomeOptions = () =>
        {
            if (user.value) homeOptions.value = [{label: "Portfolio", path: "/dashboard"},
                {label: "Settings", path: "/profile"}, {label: "Logout", method: handleLogout}];
            else homeOptions.value = [{label: "Login", path: "/login"}, {label: "Register", path: "/register"}];
        };

        onMounted(() =>
        {
            watch(authService.user, (newUser) =>
            {
                user.value = newUser;
                setHomeOptions();
            }, {immediate: true});
        });

        return {homeOptions};
    }
});
</script>

<style scoped>
.home
{
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 70px;
}

header h1 {color: #4A90E2;}
.logo
{
    width: 350px;
    height: auto;
}
</style>