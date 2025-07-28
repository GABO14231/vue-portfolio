<template>
    <div class="portfolio-card">
        <h4>{{item.title}}</h4>
        <p>{{item.description}}</p>
        <div class="tabs-container">
            <div class="tab-buttons">
                <button :class="{'tab-button': true, 'active': item.activeTab === 'images'}"
                    @click="item.activeTab = 'images'">Images</button>
                <button :class="{'tab-button': true, 'active': item.activeTab === 'videos'}"
                    @click="item.activeTab = 'videos'">Videos</button>
                <button :class="{'tab-button': true, 'active': item.activeTab === 'code'}"
                    @click="item.activeTab = 'code'">Code</button>
            </div>
            <div class="tab-content">
                <div v-if="item.activeTab === 'images'" class="slider-container">
                    <button @click="prevSlide('images')" class="slider-arrow left-arrow">&lt;</button>
                    <img :src="item.images[item.currentImageIndex]"
                        :alt="item.title + ' image ' + (item.currentImageIndex + 1)" class="slider-image"
                        onerror="this.onerror=null;
                        this.src='/src/assets/placeholder.jpg';"
                    />
                    <button @click="nextSlide('images')" class="slider-arrow right-arrow">&gt;</button>
                </div>
                <div v-if="item.activeTab === 'videos'" class="video-container">
                    <div v-if="item.videos">
                        <video :src="item.videos" controls class="project-video">Your browser does not support the video tag.</video>
                    </div>
                    <p v-else>No videos available for this project.</p>
                </div>
                <div v-if="item.activeTab === 'code'" class="slider-container">
                    <button @click="prevSlide('code')" class="slider-arrow left-arrow">&lt;</button>
                    <pre class="code-snippet"><code>{{item.codeSnippets[item.currentCodeIndex].code}}</code></pre>
                    <button @click="nextSlide('code')" class="slider-arrow right-arrow">&gt;</button>
                    <p class="code-language">Language: {{item.codeSnippets[item.currentCodeIndex].language}}</p>
                </div>
            </div>
        </div>
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="view-link">View Project</a>
    </div>
</template>

<script>
import {defineComponent, reactive} from 'vue';

export default defineComponent({name: 'PortfolioCard', props: {item: {type: Object, required: true}},
    setup(props)
    {
        const item = reactive(props.item);
        const prevSlide = (type) =>
        {
            if (type === 'images') item.currentImageIndex = (item.currentImageIndex - 1 + item.images.length) % item.images.length;
            else if (type === 'code') item.currentCodeIndex = (item.currentCodeIndex - 1 + item.codeSnippets.length) % item.codeSnippets.length;
        }

        const nextSlide = (type) =>
        {
            if (type === 'images') item.currentImageIndex = (item.currentImageIndex + 1) % item.images.length;
            else if (type === 'code') item.currentCodeIndex = (item.currentCodeIndex + 1) % item.codeSnippets.length;
        }

        return {item, prevSlide, nextSlide};
    }
});
</script>

<style scoped>
.portfolio-card
{
    background-color: #1f2023;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.2s ease-in-out;
    overflow: hidden;
}

.portfolio-card:hover {transform: translateY(-5px);}
.portfolio-card h4
{
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 10px;
}

.portfolio-card p
{
    font-size: 0.9em;
    color: #b0b0b0;
    flex-grow: 1;
    margin-bottom: 15px;
}

.tabs-container
{
    margin-bottom: 15px;
    border: 1px solid #3e4044;
    border-radius: 5px;
    overflow: hidden;
}

.tab-buttons
{
    display: flex;
    justify-content: space-around;
    background-color: #333;
    border-bottom: 1px solid #3e4044;
}

.tab-button
{
    flex-grow: 1;
    padding: 10px 15px;
    border: none;
    background-color: transparent;
    color: #dadada;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.tab-button:hover
{
    background-color: #4A90E2;
    color: white;
}

.tab-button.active
{
    background-color: #4A90E2;
    color: white;
    font-weight: bold;
}

.tab-content {
    padding: 0;
    background-color: #1f2023;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.slider-container
{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 40px;
    box-sizing: border-box;
}

.slider-image
{
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 5px;
}

.slider-arrow
{
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    transition: background-color 0.3s ease;
}

.slider-arrow:hover {background-color: rgba(0, 0, 0, 0.8);}
.left-arrow {left: 5px;}
.right-arrow {right: 5px;}

.project-video
{
    width: 100%;
    max-height: 200px;
    border-radius: 5px;
}

.code-snippet
{
    background-color: #2a2c30;
    color: #dadada;
    padding: 10px 15px;
    border-radius: 5px;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 0.85em;
    white-space: pre-wrap;
    word-break: break-all;
    width: 100%;
    max-height: 200px;
    box-sizing: border-box;
}

.code-language
{
    font-size: 0.8em;
    color: #999;
    margin-top: 10px;
    text-align: right;
}

.view-link
{
    display: inline-block;
    background-color: #4A90E2;
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 0.9em;
    transition: background-color 0.3s ease;
    margin-top: 15px;
}

.view-link:hover {background-color: #357ABD;}
@media (max-width: 768px)
{
    .slider-arrow
    {
        padding: 5px;
        width: 25px;
        height: 25px;
        font-size: 1em;
    }
}
</style>