<template>
    <footer class="app-footer">
        <div class="footer-content">
            <p>&copy; {{currentYear}} Gabriel Morazan. All rights reserved.</p>
            <div class="social-links">
                <a href="https://github.com/GABO14231" target="_blank" rel="noopener noreferrer"
                    aria-label="GitHub Profile">
                    <font-awesome-icon :icon="['fab', 'github']" class="social-icon" />
                </a>
                <a href="https://discordapp.com/users/421289817398050816" target="_blank"
                    rel="noopener noreferrer" aria-label="Discord Profile">
                    <font-awesome-icon :icon="['fab', 'discord']" class="social-icon" />
                </a>
                <a href="mailto:gabo1423@gmail.com" aria-label="Email Address">
                    <font-awesome-icon :icon="['fas', 'envelope']" class="social-icon" />
                </a>
            </div>
            <p>Contact: gabo1423@gmail.com</p>
        </div>
    </footer>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faGithub, faDiscord} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';

library.add(faGithub, faDiscord, faEnvelope);

export default defineComponent({name: 'FooterComponent', components: {FontAwesomeIcon},
    setup()
    {
        const currentYear = ref(new Date().getFullYear());
        return {currentYear};
    }
});
</script>

<style scoped>
.app-footer
{
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    background-color: #333;
    color: #4A90E2;
}
.footer-content {text-align: center;}

.footer-content p
{
    margin: 5px 0;
    font-size: 0.9em;
    color: #dadada;
}

.social-links
{
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 15px;
}

.social-links a
{
    color: #4A90E2;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 24px;
}
.social-links a:hover {color: #ddd;}

@media (max-width: 768px)
{
    .app-footer {padding: 15px;}
    .footer-content p {font-size: 0.8em;}
    .social-links {gap: 10px;}
}
</style>