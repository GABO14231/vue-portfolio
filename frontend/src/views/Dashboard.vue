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
                title: 'Flappy Bird',
                description: 'A clone of the infamous Flappy Bird game, made with Python.',
                link: 'https://github.com/GABO14231/flappy-bird-python',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image10.png', 'src/assets/image11.png', 'src/assets/image12.png'],
                video: 'src/assets/video4.mp4',
                codeSnippets: [{language: 'Python', code: 'def clamp(n: float, minn: float, maxn: float) -> float: return max(min(maxn, n), minn)'},
                    {language: 'Python', code: 'import asyncio\nfrom src.flappy import Flappy\n\nif __name__ == "__main__":\n    asyncio.run(Flappy().start())'},
                    {language: 'Python', code: 'def draw(self) -> None:\n    self.x = -((-self.x + self.vel_x) % self.x_extra)\n    super().draw()'}]
            },
            {
                id: '5',
                title: 'Socket.io Example',
                description: 'A Node.js/Web App that showcases how Socket.io works.',
                link: 'https://github.com/GABO14231/Socket.io-Example',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image13.png', 'src/assets/image14.png', 'src/assets/image15.png'],
                video: 'src/assets/video5.mp4',
                codeSnippets: [{language: 'JavaScript', code: 'socket.on("message", (message) => {displayLogs(`Message from server: ${message}`);});'},
                    {language: 'JavaScript', code: 'const io = new Server({cors: {origin: "*", methods: ["GET", "POST"]}});\nconst connectedClients = new Map();\nconst screen = blessed.screen({smartCSR: true, title: "Socket.io Server Dashboard"});'},
                    {language: 'HTML', code: '<div style="display: flex; justify-content: center; gap: 10px">\n    <button class="clearLogButton">Clear Log</button>\n    <button class="disconnectButton">Disconnect</button>\n</div>'}]
            },
            {
                id: '6',
                title: 'FIFO/LIFO/RR Scheduler',
                description: 'A C++ app that implements the FIFO/LIFO/RR algorithms to schedule some tasks.',
                link: 'https://github.com/GABO14231/FIFO-LIFO-RR-App',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: ['src/assets/image16.png', 'src/assets/image17.png', 'src/assets/image18.png'],
                video: 'src/assets/video6.mp4',
                codeSnippets: [{language: 'C++', code: 'bool allProcessesFinished()\n{\n    for (const auto &p : arr) if (p.tf == 0) return false;\n    return true;\n}'},
                    {language: 'C++', code: 'for (int i = 0; i < (clock_values.size() - 1); i++) cout << clock_values[i] << ", ";\ncout << clock_values[clock_values.size() - 1] << endl;\neffective[1] = (i_avg * 100);\nclock_values.clear();'},
                    {language: 'C++', code: 'struct Processes\n{\n    string processes;\n    int ti, t, tf, T, E;\n    float I;\n};'}]
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
                modalButtons.value = [{label: 'Close', action: clearMessage}];
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

            const labels = ['JavaScript', 'HTML/CSS', 'Node.js', 'Python', 'C++', 'C'];
            const data = [95, 90, 95, 70, 80, 75];
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