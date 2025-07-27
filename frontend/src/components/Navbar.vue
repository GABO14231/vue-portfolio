<template>
    <nav :class="{'navbar': true, 'visible': isVisible, 'hidden': !isVisible}">
        <div class="navbar-left">
            <template v-if="isHome">
                <img src="/src/assets/logo.svg" alt="Logo" class="logo" />
                <h1>Vue Portfolio</h1>
            </template>
            <template v-else>
                <router-link to="/" class="navbar-home-link">
                    <img src="/src/assets/logo.svg" alt="Logo" class="logo" />
                    <h1>Vue Portfolio</h1>
                </router-link>
            </template>
        </div>
        <ul class="nav-links">
            <li v-for="(option, index) in options" :key="index">
                <router-link :to="option.path || ''" class="nav-link" @click="handleClick(option, $event)">
                    {{option.label}}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import {defineComponent, ref, onMounted, onBeforeUnmount, watch} from 'vue';
import {useRoute} from 'vue-router';

export default defineComponent({name: 'NavbarComponent', props: {options: {type: Array, default: () => []}},
    setup(props)
    {
        const isVisible = ref(true);
        const isHome = ref(false);
        let lastScrollY = 0;

        const route = useRoute();
        const checkRoute = () => {isHome.value = route.path === '/';};

        const onWindowScroll = () =>
        {
            isVisible.value = window.scrollY <= lastScrollY;
            lastScrollY = window.scrollY;
        };

        const handleClick = (option, event) =>
        {
            if (option.method)
            {
                const result = option.method();
                if (!option.path || result === false) event.preventDefault();
            }
        };

        onMounted(() =>
        {
            lastScrollY = window.scrollY;
            checkRoute();
            window.addEventListener('scroll', onWindowScroll);
        });

        onBeforeUnmount(() => {window.removeEventListener('scroll', onWindowScroll);});
        watch(() => route.path, () => {checkRoute();});
        return {isVisible, isHome, handleClick};
    }
});
</script>

<style scoped>
.navbar
{
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0 20px;
    background-color: #333;
    color: #4A90E2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
}

.navbar.hidden {transform: translateY(-100%);}
.navbar.visible {transform: translateY(0);}

.navbar-left
{
    display: flex;
    align-items: center;
}

.navbar-home-link
{
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
}

.logo
{
    width: 40px;
    height: auto;
    margin-right: 10px;
}

.nav-links
{
    cursor: pointer;
    list-style: none;
    display: flex;
    gap: 15px;
}

.nav-links li a
{
    color: #4A90E2;
    text-decoration: none;
    font-weight: bold;
    position: relative;
    transition: all 0.3s ease;
}

.nav-links li a:hover
{
    color: #ddd;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transform: scale(1.1);
}

.menu-toggle
{
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    color: white;
    cursor: pointer;
}

@media (max-width: 768px)
{
    .nav-links
    {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        background-color: #333;
        width: 100%;
        padding: 10px;
    }

    .nav-links.active {display: flex;}
    .menu-toggle {display: block;}
}
</style>