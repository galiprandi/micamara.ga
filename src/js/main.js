import '../css/reset.css'
import '../css/main.scss'
import './sw'
import App from '../comp/App.svelte';

const app = new App({target: document.body });

export default app;