import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import './styles.css';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

library.add(faEye, faEyeSlash);
const app = createApp(App);
app.use(router);
app.mount('#app');