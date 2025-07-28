<template>
    <div>
        <Navbar :options="dashboardOptions"></Navbar>
        <div class="dashboard-container">
            <div class="portfolio-section">
                <h2>My Projects</h2>
                <div class="portfolio-grid">
                    <PortfolioCard v-for="item in portfolioItems" :key="item.id" :item="item"></PortfolioCard>
                </div>
            </div>
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
        let skillsBarChart = null;
        let skillsPieChart = null;

        const portfolioItems = ref([
            {
                id: '1',
                title: 'E-commerce Platform',
                description: 'A full-stack e-commerce solution with user authentication, product catalog, and shopping cart functionality.',
                link: 'https://github.com/yourusername/ecommerce-platform',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=E-commerce+Screenshot+1',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=E-commerce+Screenshot+2',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=E-commerce+Screenshot+3'
                ],
                videos: '',
                codeSnippets: [
                    { language: 'JavaScript', code: 'console.log("Welcome to our store!");\n// Example product fetching logic' },
                    { language: 'HTML', code: '<body>\n  <nav>...</nav>\n  <main>\n    <h1>Products</h1>\n    <div id="product-list"></div>\n  </main>\n</body>' }
                ]
            },
            {
                id: '2',
                title: 'Real-time Chat Application',
                description: 'A real-time chat application built with WebSockets, allowing multiple users to communicate instantly.',
                link: 'https://github.com/yourusername/chat-app',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Chat+App+Screenshot+1',
                    'https://placehold.co/600x400/4A90E2/ffffff?text=Chat+App+Screenshot+2'
                ],
                videos: ['https://www.w3schools.com/html/mov_bbb.mp4'], // Example video URL
                codeSnippets: [
                    { language: 'Python', code: 'def send_message(user, message):\n  # Logic to send message via WebSocket' },
                    { language: 'JavaScript', code: 'socket.onmessage = (event) => {\n  const msg = JSON.parse(event.data);\n  // Append message to chat window\n};' }
                ]
            },
            {
                id: '3',
                title: 'Machine Learning Model Deployment',
                description: 'Deployed a predictive machine learning model as a web service using Flask and Docker.',
                link: 'https://github.com/yourusername/ml-deployment',
                activeTab: 'images',
                currentImageIndex: 0,
                currentCodeIndex: 0,
                images: [
                    'https://placehold.co/600x400/4A90E2/ffffff?text=ML+Deployment+Screenshot+1'
                ],
                videos: [],
                codeSnippets: [
                    { language: 'Python', code: 'from flask import Flask, request, jsonify\napp = Flask(__name__)\n@app.route("/predict", methods=["POST"])\ndef predict():\n  # Prediction logic\n  return jsonify(result)' }
                ]
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
                videos: [],
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
                videos: [],
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
        return {username, dashboardOptions, message, modalButtons, portfolioItems, handleLogout, clearMessage};
    }
});
</script>

<style scoped>
.dashboard-container
{
    max-width: 1200px;
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

.portfolio-section h2, .graphs-section h3 {color: #4A90E2;}
.portfolio-grid
{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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