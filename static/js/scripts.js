

const content_dir = 'contents/'
const config_file = 'config.yml'

// Global language management
let currentLang = 'zh';

window.addEventListener('DOMContentLoaded', event => {
    console.log('DOM Content Loaded - scripts.js');

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Load configuration
    console.log('Loading configuration...');
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            console.log('Configuration loaded:', text);
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    const element = document.getElementById(key);
                    if (element) {
                        element.innerHTML = yml[key];
                        console.log(`Set ${key}:`, yml[key]);
                    }
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log('Config error:', error));

    // Configure marked for better rendering
    marked.use({ 
        mangle: false, 
        headerIds: false,
        breaks: true,
        gfm: true
    });

    // Initialize content after a short delay
    setTimeout(() => {
        console.log('Loading initial content...');
        loadAllContent('zh');
    }, 500);

}); 

function toggleLanguage() {
    console.log('Toggling language from', currentLang);
    if (currentLang === 'zh') {
        currentLang = 'en';
        document.getElementById('lang-toggle').innerHTML = '<i class="bi bi-translate"></i> 中文';
        loadAllContent('en');
    } else {
        currentLang = 'zh';
        document.getElementById('lang-toggle').innerHTML = '<i class="bi bi-translate"></i> EN';
        loadAllContent('zh');
    }
}

function loadAllContent(lang) {
    console.log('Loading all content for language:', lang);
    // Load all section content based on language
    const sections = ['overview', 'schedule', 'registration', 'faq'];
    
    sections.forEach(section => {
        const filename = `${section}_${lang}.md`;
        console.log(`Loading ${filename}...`);
        
        fetch(`${content_dir}${filename}`)
            .then(response => {
                console.log(`Response for ${filename}:`, response.ok, response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                console.log(`Content loaded for ${filename}, length:`, text.length);
                // Parse and display the markdown content
                const html = marked.parse(text);
                const element = document.getElementById(`${section}-md`);
                if (element) {
                    element.innerHTML = html;
                    console.log(`Content set for ${section}-md`);
                } else {
                    console.error(`Element ${section}-md not found`);
                }
            })
            .catch(error => {
                console.error(`Error loading ${filename}:`, error);
            });
    });
    
    // Update static text elements based on language
    updateStaticText(lang);
    
    // Re-render math if present after all content is loaded
    setTimeout(() => {
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset();
        }
    }, 1000);
}

function updateStaticText(lang) {
    console.log('Updating static text for language:', lang);
    if (lang === 'zh') {
        document.getElementById('event-date').textContent = '2025年8月31日-9月4日 | 复旦大学江湾校区';
        document.getElementById('event-tagline').textContent = '5天集训 · 全流程实战 · 最高3000元奖学金';
        document.getElementById('overview-title').textContent = '概览';
        document.getElementById('schedule-title').textContent = '日程安排';
        document.getElementById('registration-title').textContent = '报名参与';
        document.getElementById('faq-title').textContent = '常见问题';
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length >= 5) {
            navLinks[0].textContent = '首页';
            navLinks[1].textContent = '概览';
            navLinks[2].textContent = '日程';
            navLinks[3].textContent = '报名';
            navLinks[4].textContent = '常见问题';
        }
        
        // Update document title
        document.title = '全国产全流程EDA软件培训 2025';
    } else {
        document.getElementById('event-date').textContent = 'August 31 - September 4, 2025 | Jiangwan Campus, Fudan University';
        document.getElementById('event-tagline').textContent = '5-Day Intensive Training · Full-Process Hands-on · Up to 3000 RMB Scholarship';
        document.getElementById('overview-title').textContent = 'OVERVIEW';
        document.getElementById('schedule-title').textContent = 'SCHEDULE';
        document.getElementById('registration-title').textContent = 'REGISTRATION';
        document.getElementById('faq-title').textContent = 'FAQ';
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length >= 5) {
            navLinks[0].textContent = 'HOME';
            navLinks[1].textContent = 'OVERVIEW';
            navLinks[2].textContent = 'SCHEDULE';
            navLinks[3].textContent = 'REGISTRATION';
            navLinks[4].textContent = 'FAQ';
        }
        
        // Update document title
        document.title = 'National Domestic EDA Software Training 2025';
    }
} 
