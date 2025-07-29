<template>
    <div>
        <Navbar :options="dashboardOptions"></Navbar>
        <div class="dashboard-container">
            <div class="portfolio-section">
                <h1>My Projects</h1>
                <div class="portfolio-grid">
                    <PortfolioCard v-for="item in portfolioItems" :key="item.id" :item="item" @zoom-image="handleZoomImage"></PortfolioCard>
                </div>
            </div>
            <transition name="fade">
                <div v-if="isZoomed" class="image-zoom-overlay" @click="closeZoom">
                    <div class="zoomed-image-container" @click.stop>
                        <img :src="zoomedImageSrc" alt="Zoomed Image" class="zoomed-image" />
                        <button class="close-zoom-button" @click="closeZoom">X</button>
                    </div>
                </div>
            </transition>
            <div class="graphs-section">
                <h3>Skills Overview</h3>
                <div class="chart-container"><canvas id="skillsBarChart"></canvas></div>
                <div class="chart-container pie-chart-container"><canvas id="skillsPieChart"></canvas></div>
            </div>
        </div>
        <Modal :message="message" :buttons="modalButtons" @close="clearMessage"></Modal>
        <Footer></Footer>
    </div>
</template>

<script>
import {defineComponent, ref, onMounted, watch, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Modal from '@/components/Modal.vue';
import Footer from '@/components/Footer.vue';
import PortfolioCard from '@/components/PortfolioCard.vue';
import {authService} from '@/services/AuthService';
import Chart from 'chart.js/auto';

export default defineComponent({name: 'DashboardPage', components: {Navbar, Modal, Footer, PortfolioCard},
    setup()
    {
        const router = useRouter();
        const username = ref('User');
        const message = ref('');
        const modalButtons = ref([]);
        const isZoomed = ref(false);
        const zoomedImageSrc = ref('');
        let skillsBarChart = null;
        let skillsPieChart = null;

        const portfolioItems = ref
        ([
            {
                id: '1',
                title: 'React Notepad',
                description: 'A personal notepad made using React.js.',
                link: 'https://github.com/GABO14231/react-notepad',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image1.png', 'src/assets/image2.png', 'src/assets/image3.png'],
                video: 'src/assets/video1.mp4',
                codeSnippets: [{language: 'JSX', code: 'const handleLogout = () =>\n{\n   console.log("Logging out...");\n   onLogout();\n};\n'},
                    {language: 'HTML', code: '<head>\n  <meta charset="UTF-8" />\n  <link rel="icon" type="image/x-icon" href="/favicon.ico" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>React Notepad</title>\n</head>'},
                    {language: 'JavaScript', code: 'app.listen(port, () => console.log(`Server running on port ${port}`));'}]
            },
            {
                id: '2',
                title: 'Angular Clocks',
                description: 'Visualize time in 10 unique ways, made with Angular.',
                link: 'https://github.com/GABO14231/angular-clocks',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image4.png', 'src/assets/image5.png', 'src/assets/image6.png'],
                video: 'src/assets/video2.mp4',
                codeSnippets: [{language: 'TypeScript', code: "import {bootstrapApplication} from '@angular/platform-browser';\nimport {App} from './app/app';\nimport {appConfig} from './app/app.config';\n\nbootstrapApplication(App, appConfig).catch((err) => console.error(err));"},
                    {language: 'CSS', code: "body\n{\n    background-color: #1f2023;\n    color: #dadada;\n}"},
                    {language: "JSON", code: '"references": [{"path": "./tsconfig.app.json"}, {"path": "./tsconfig.spec.json"}]'}]
            },
            {
                id: '3',
                title: 'Music Player',
                description: 'A Web Music Player app that uses IndexedDB to store music data locally.',
                link: 'https://github.com/GABO14231/music-player',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image7.png', 'src/assets/image8.png', 'src/assets/image9.png'],
                video: 'src/assets/video3.mp4',
                codeSnippets: [{language: 'JavaScript', code: "import * as musicMetadata from 'music-metadata';\nwindow.musicMetadata = musicMetadata;"},
                    {language: 'HTML', code: '<section class="cover-art">\n    <img id="album-art" src="assets/placeholder.png" alt="Cover Art">\n</section>'},
                    {language: 'CSS', code: '@keyframes fadeIn\n{\n    from {opacity: 0;}\n    to {opacity: 1;}\n}'}]
            },
            {
                id: '4',
                title: 'Personal Blog Site',
                description: 'A responsive blog platform with a content management system, built using Vue.js and a RESTful API.',
                link: 'https://github.com/yourusername/blog-site',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Blog+Site+Screenshot+1',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Blog+Site+Screenshot+2'
                ],
                video: [],
                codeSnippets: [
                    { language: 'Vue.js', code: '<template>\n  <div class="post-card">\n    <h2>{{ post.title }}</h2>\n    <p>{{ post.excerpt }}</p>\n  </div>\n</template>' },
                    { language: 'CSS', code: '.post-card {\n  border: 1px solid #eee;\n  padding: 15px;\n  margin-bottom: 20px;\n}' }
                ]
            },
            {
                id: '5',
                title: 'Data Visualization Dashboard',
                description: 'Interactive data visualization of sales trends using D3.js, allowing dynamic filtering and drill-down.',
                link: 'https://github.com/yourusername/data-viz',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Data+Viz+Screenshot+1',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Data+Viz+Screenshot+2',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Data+Viz+Screenshot+3'
                ],
                video: [],
                codeSnippets: [
                    { language: 'JavaScript', code: 'd3.select("body").append("svg")\n  .attr("width", 500).attr("height", 300)\n  .append("rect")\n  .attr("x", 0).attr("y", 0)\n  .attr("width", 100).attr("height", 50);' }
                ]
            },
            {
                id: '6',
                title: 'Mobile Game Development',
                description: 'Developed a simple 2D mobile game using Unity, featuring touch controls and basic physics.',
                link: 'https://github.com/yourusername/mobile-game',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Mobile+Game+Screenshot+1'
                ],
                videos: ['https://www.w3schools.com/html/movie.mp4'],
                codeSnippets: [
                    { language: 'C#', code: 'public class PlayerController : MonoBehaviour\n{\n  public float speed = 5f;\n  void Update()\n  {\n    float move = Input.GetAxis("Horizontal");\n    transform.Translate(Vector3.right * move * speed * Time.deltaTime);\n  }\n}' }
                ]
            }
        ]);

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
                message.value = 'Logout failed. Please try again.';
                modalButtons.value = [{ label: 'Close', action: clearMessage }];
            }
        }

        const dashboardOptions = ref([{label: "Home", path: "/"}, {label: "Settings", path: "/profile"},
            {label: "Log Out", method: handleLogout}]);

        const clearMessage = () =>
        {
            message.value = '';
            modalButtons.value = [];
        }

        const renderSkillsCharts = () =>
        {
            const barCtx = document.getElementById('skillsBarChart');
            const pieCtx = document.getElementById('skillsPieChart');

            if (skillsBarChart) skillsBarChart.destroy();
            if (skillsPieChart) skillsPieChart.destroy();

            const labels = ['Vue.js', 'JavaScript', 'HTML/CSS', 'Node.js', 'Databases', 'Python'];
            const data = [90, 85, 95, 75, 70, 60];
            const backgroundColors = ['rgba(74, 144, 226, 0.8)', 'rgba(240, 219, 79, 0.8)',
                'rgba(227, 79, 40, 0.8)', 'rgba(104, 160, 99, 0.8)', 'rgba(128, 0, 128, 0.8)',
                'rgba(59, 130, 246, 0.8)'];
            const borderColors = ['rgba(74, 144, 226, 1)', 'rgba(240, 219, 79, 1)', 'rgba(227, 79, 40, 1)',
                'rgba(104, 160, 99, 1)', 'rgba(128, 0, 128, 1)', 'rgba(59, 130, 246, 1)'];

            skillsBarChart = new Chart(barCtx, {type: 'bar', data: {labels: labels, datasets:
                [{label: 'Skill Proficiency', data: data, backgroundColor: backgroundColors, borderColor: borderColors,
                borderWidth: 1}]},
                options: {responsive: true, maintainAspectRatio: false,
                scales: {y: {beginAtZero: true, max: 100, ticks: {color: '#dadada'}, grid: {color: '#3e4044'}},
                x: {ticks: {color: '#dadada'}, grid: {color: '#3e4044'}}},
                plugins:
                {
                    legend: {labels: {color: '#dadada'}},
                    tooltip:
                    {
                        backgroundColor: 'rgba(42, 44, 48, 0.9)',
                        titleColor: '#4A90E2',
                        bodyColor: '#dadada',
                        borderColor: '#4A90E2',
                        borderWidth: 1
                    }
                }}
            });

            skillsPieChart = new Chart(pieCtx, {type: 'pie', data: {labels: labels, datasets:
                [{label: 'Skill Distribution', data: data, backgroundColor: backgroundColors, borderColor: borderColors,
                borderWidth: 1}]},
                options: {responsive: true, maintainAspectRatio: false,
                plugins:
                {
                    legend: {position: 'top', labels: {color: '#dadada'}},
                    tooltip:
                    {
                        backgroundColor: 'rgba(42, 44, 48, 0.9)',
                        titleColor: '#4A90E2',
                        bodyColor: '#dadada',
                        borderColor: '#4A90E2',
                        borderWidth: 1
                    }
                }}
            });
        }

        onMounted(() =>
        {
            watch(authService.user, (newUser) =>
            {
                if (newUser && newUser.username) username.value = newUser.username;
                else
                {
                    username.value = 'Guest';
                    router.push('/login');
                }
            }, {immediate: true});
            nextTick(() => renderSkillsCharts());
        });

        const handleZoomImage = (src) =>
        {
            zoomedImageSrc.value = src;
            isZoomed.value = true;
        };

        const closeZoom = () =>
        {
            isZoomed.value = false;
            zoomedImageSrc.value = '';
        };

        return {username, dashboardOptions, message, modalButtons, portfolioItems, handleLogout, clearMessage,
            isZoomed, zoomedImageSrc, handleZoomImage, closeZoom};
    }
});
</script>

<style scoped>
.dashboard-container
{
    max-width: 1450px;
    margin: 80px auto 20px auto;
    padding: 20px;
    background-color: #2a2c30;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #dadada;
}

.dashboard-container h2
{
    color: #4A90E2;
    margin-bottom: 15px;
}

.dashboard-container p
{
    margin-bottom: 20px;
    line-height: 1.6;
}

.graphs-section
{
    margin-top: 30px;
    border-top: 1px solid #3e4044;
    padding-top: 20px;
}

.portfolio-section h1, .graphs-section h3 {color: #4A90E2;}
.portfolio-grid
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 2fr));
    gap: 30px;
    justify-content: center;
    padding: 10px;
}

.graphs-section
{
    padding-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.chart-container
{
    background-color: #1f2023;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    max-width: 800px;
    flex: 1;
    min-width: 300px;
    height: 400px;
}

.pie-chart-container {max-width: 400px;}
.fade-enter-active, .fade-leave-active {transition: opacity 0.3s ease;}
.fade-enter-from, .fade-leave-to {opacity: 0;}

.image-zoom-overlay
{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transition: opacity 0.3s ease;
}

.zoomed-image-container
{
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1f2023;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    padding: 20px;
    transform: scale(1);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.zoomed-image
{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 5px;
    transition: transform 0.3s ease;
}

.close-zoom-button
{
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 1.2em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    z-index: 1001;
}

.close-zoom-button:hover {background-color: #357ABD;}
.fade-enter-active .zoomed-image-container, .fade-leave-active .zoomed-image-container {transform: scale(1);}
.fade-enter-from .zoomed-image-container, .fade-leave-to .zoomed-image-container {transform: scale(0.8);}

@media (max-width: 768px)
{
    .dashboard-container
    {
        margin: 70px 10px 10px 10px;
        padding: 15px;
    }

    .portfolio-grid {grid-template-columns: 1fr;}
    .graphs-section
    {
        flex-direction: column;
        align-items: center;
    }

    .chart-container
    {
        width: 100%;
        max-width: none;
    }
}
</style>