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
            try
            {
                const response = await authService.logout();
                router.push('/');
            }
            catch (err) {console.error("Logout failed:", err);}
        };

        const setHomeOptions = () =>
        {
            homeOptions.value = [{label: "Home", path: "/"}, {label: "Settings", path: "/profile"},
                {label: "Log Out", method: handleLogout}];
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
    padding: 50px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #dadada;
}

.home h1
{
    color: #4A90E2;
    font-size: 3em;
    margin-bottom: 10px;
}

.home p
{
    font-size: 1.2em;
    margin-bottom: 20px;
}

.home .logo
{
    width: 150px;
    height: auto;
    margin: 30px auto;
    display: block;
}
</style>