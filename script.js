const gradientPreview = document.getElementById('gradientPreview');
const cssOutput = document.getElementById('cssOutput');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const linearBtn = document.getElementById('linearBtn');
const radialBtn = document.getElementById('radialBtn');
const conicBtn = document.getElementById('conicBtn');
const angleControl = document.getElementById('angleControl');
const angleSlider = document.getElementById('angleSlider');
const angleValue = document.getElementById('angleValue');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');
const addColorBtn = document.getElementById('addColorBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const colorStopsContainer = document.getElementById('colorStopsContainer');
const messageBox = document.getElementById('messageBox');
const copyIcon = document.getElementById('copyIcon');
const checkIcon = document.getElementById('checkIcon');
const closeMessageBtn = document.getElementById('closeMessageBtn');

let gradientType = 'linear-gradient';
let colors = [];
let nextColorId = 1;
let angle = 90;
let opacity = 100;

const hexToRgbA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
};

const getRandomHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');


const updateGradient = () => {
    colors.sort((a, b) => a.position - b.position);
    
    const alpha = opacity / 100;

    const colorString = colors.map(c => {
        return `${hexToRgbA(c.color, alpha)} ${c.position}%`;
    }).join(', ');

    let cssValue = '';
    switch (gradientType) {
        case 'linear-gradient':
            cssValue = `${gradientType}(${angle}deg, ${colorString})`;
            break;
        case 'radial-gradient':
            cssValue = `${gradientType}(ellipse at center, ${colorString})`; 
            break;
        case 'conic-gradient':
            cssValue = `${gradientType}(from ${angle}deg, ${colorString})`;
            break;
    }

    gradientPreview.style.backgroundImage = cssValue;
    cssOutput.value = `-webkit-box-shadow: none;\n-webkit-background-image: ${cssValue};\nbackground-image: ${cssValue};`; 
};

const createColorStopElement = (colorObject) => {
    const container = document.createElement('div');
    container.classList.add('flex', 'items-center', 'space-x-4', 'bg-slate-50', 'p-3', 'rounded-lg', 'shadow-sm', 'border', 'border-slate-200'); 
    container.dataset.id = colorObject.id;

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = colorObject.color;
    colorInput.id = `color-input-${colorObject.id}`;
    colorInput.classList.add('w-10', 'h-10', 'min-w-10', 'rounded-full', 'border-4', 'border-white', 'cursor-pointer', 'shadow-md'); 
    colorInput.setAttribute('aria-label', `Color picker for stop ${colorObject.id}`);
    colorInput.addEventListener('input', (e) => {
        const updatedColor = colors.find(c => c.id === colorObject.id);
        if (updatedColor) {
            updatedColor.color = e.target.value;
            updateGradient();
        }
    });

    const positionWrapper = document.createElement('div');
    positionWrapper.classList.add('flex-1', 'space-y-1');
    const positionLabel = document.createElement('label');
    positionLabel.htmlFor = `position-input-${colorObject.id}`;
    positionLabel.classList.add('block', 'text-sm', 'font-semibold', 'text-slate-700');
    positionLabel.textContent = `Position: ${colorObject.position}%`;
    positionLabel.id = `position-label-${colorObject.id}`;
    const positionInput = document.createElement('input');
    positionInput.type = 'range';
    positionInput.min = '0';
    positionInput.max = '100';
    positionInput.value = colorObject.position;
    positionInput.id = `position-input-${colorObject.id}`;
    positionInput.classList.add('w-full', 'h-2', 'bg-slate-200', 'rounded-lg', 'appearance-none', 'cursor-pointer');
    positionInput.setAttribute('aria-valuetext', `${colorObject.position} percent`);
    positionInput.setAttribute('aria-labelledby', `position-label-${colorObject.id}`);
    positionInput.addEventListener('input', (e) => {
        const updatedColor = colors.find(c => c.id === colorObject.id);
        if (updatedColor) {
            updatedColor.position = parseInt(e.target.value);
            positionLabel.textContent = `Position: ${e.target.value}%`;
            positionInput.setAttribute('aria-valuetext', `${e.target.value} percent`);
            updateGradient();
        }
    });
    positionWrapper.appendChild(positionLabel);
    positionWrapper.appendChild(positionInput);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('p-2', 'bg-slate-200', 'text-slate-500', 'rounded-lg', 'hover:bg-red-500', 'hover:text-white', 'transition-all', 'duration-200', 'active:scale-95'); 
    removeBtn.title = 'Remove color stop';
    removeBtn.setAttribute('aria-label', `Remove color stop at position ${colorObject.position}%`);
    removeBtn.innerHTML = `<i class="fas fa-times w-4 h-4 flex items-center justify-center" aria-hidden="true"></i>`;
    removeBtn.addEventListener('click', () => {
        if (colors.length > 2) {
            colors = colors.filter(c => c.id !== colorObject.id);
            container.remove();
            updateGradient();
            showMessage('Color stop removed.', 1500);
        } else {
            showMessage('Must have at least two color stops.', 3000);
        }
    });

    container.appendChild(colorInput);
    container.appendChild(positionWrapper);
    container.appendChild(removeBtn);
    return container;
};

const addColorStop = () => {
    const newPosition = colors.length < 5 ? 50 : Math.floor(Math.random() * 101);
    const newColor = { id: nextColorId++, color: getRandomHexColor(), position: newPosition };
    colors.push(newColor);
    colorStopsContainer.appendChild(createColorStopElement(newColor));
    updateGradient();
    showMessage('New color stop added.', 1500);
};

const generateRandomColors = () => {
    colors = [];
    colorStopsContainer.innerHTML = '';
    const numColors = Math.floor(Math.random() * 4) + 2; 
    for (let i = 0; i < numColors; i++) {
        const randomHex = getRandomHexColor();
        const randomPosition = Math.round((i / (numColors - 1)) * 100); 
        const newColor = { id: nextColorId++, color: randomHex, position: randomPosition };
        colors.push(newColor);
        colorStopsContainer.appendChild(createColorStopElement(newColor));
    }
    const types = [linearBtn, radialBtn, conicBtn];
    const randomTypeButton = types[Math.floor(Math.random() * types.length)];
    randomTypeButton.click();
    
    updateGradient();
    showMessage('New random gradient generated! ✨', 3000);
};


const showMessage = (msg, duration = 2000) => {
    const span = messageBox.querySelector('span');
    span.textContent = msg;
    messageBox.style.cssText = 'opacity: 1; bottom: 1.5rem; pointer-events: auto;';
    messageBox.setAttribute('aria-hidden', 'false');
    clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(() => {
        messageBox.style.cssText = 'opacity: 0; bottom: -999px; pointer-events: none;';
        messageBox.setAttribute('aria-hidden', 'true');
    }, duration);
};

const setActiveButton = (activeButton) => {
    const allButtons = [linearBtn, radialBtn, conicBtn];
    allButtons.forEach(btn => {
        btn.classList.remove('active-type');
        btn.setAttribute('aria-checked', 'false');
    });
    activeButton.classList.add('active-type');
    activeButton.setAttribute('aria-checked', 'true');
};

const generateShareURL = () => {
    const gradientData = {
        type: gradientType,
        colors: colors.map(c => ({ color: c.color, position: c.position })),
        angle: angle,
        opacity: opacity
    };
    const jsonString = JSON.stringify(gradientData);
    const base64String = btoa(jsonString);
    const shareUrl = `${window.location.origin}${window.location.pathname}?gradient=${base64String}`; 
    return shareUrl;
};

const loadFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gradientParam = urlParams.get('gradient');
    if (gradientParam) {
        try {
            const jsonString = atob(gradientParam);
            const gradientData = JSON.parse(jsonString);

            if (gradientData.type) {
                gradientType = gradientData.type;
                if (gradientType === 'linear-gradient') setActiveButton(linearBtn);
                else if (gradientType === 'radial-gradient') setActiveButton(radialBtn);
                else if (gradientType === 'conic-gradient') setActiveButton(conicBtn);
            }
            angleControl.style.display = (gradientType === 'radial-gradient') ? 'none' : 'block';

            if (gradientData.colors && Array.isArray(gradientData.colors) && gradientData.colors.length >= 2) {
                colors = gradientData.colors.map((c, index) => ({
                    id: index + 1,
                    color: /^#([0-9A-F]{3}){1,2}$/i.test(c.color) ? c.color : '#000000', 
                    position: Math.max(0, Math.min(100, c.position))
                }));
                nextColorId = colors.length + 1;
                colorStopsContainer.innerHTML = '';
                colors.forEach(color => colorStopsContainer.appendChild(createColorStopElement(color)));
            } else {
                return false; 
            }

            if (gradientData.angle !== undefined) {
                angle = Math.max(0, Math.min(360, gradientData.angle));
                angleSlider.value = angle;
                angleValue.textContent = `${angle}°`;
                angleSlider.setAttribute('aria-valuetext', `${angle} degrees`);
            }

            if (gradientData.opacity !== undefined) {
                opacity = Math.max(0, Math.min(100, gradientData.opacity));
                opacitySlider.value = opacity;
                opacityValue.textContent = `${opacity}%`;
                opacitySlider.setAttribute('aria-valuetext', `${opacity} percent`);
            }

            updateGradient();
            showMessage('Gradient loaded from URL! 🔗', 3000);
            return true;
        } catch (e) {
            console.error("Failed to parse URL gradient data:", e);
            showMessage('Invalid gradient URL data.', 3000);
            history.replaceState({}, document.title, window.location.pathname); 
            return false;
        }
    }
    return false;
};

linearBtn.addEventListener('click', () => {
    gradientType = 'linear-gradient';
    setActiveButton(linearBtn);
    angleControl.style.display = 'block';
    updateGradient();
});

radialBtn.addEventListener('click', () => {
    gradientType = 'radial-gradient';
    setActiveButton(radialBtn);
    angleControl.style.display = 'none';
    updateGradient();
});

conicBtn.addEventListener('click', () => {
    gradientType = 'conic-gradient';
    setActiveButton(conicBtn);
    angleControl.style.display = 'block';
    updateGradient();
});

angleSlider.addEventListener('input', (e) => {
    angle = parseInt(e.target.value);
    angleValue.textContent = `${angle}°`;
    angleSlider.setAttribute('aria-valuetext', `${angle} degrees`);
    updateGradient();
});

opacitySlider.addEventListener('input', (e) => {
    opacity = parseInt(e.target.value);
    opacityValue.textContent = `${opacity}%`;
    opacitySlider.setAttribute('aria-valuetext', `${opacity} percent`);
    updateGradient();
});

addColorBtn.addEventListener('click', addColorStop);
randomizeBtn.addEventListener('click', generateRandomColors);
closeMessageBtn.addEventListener('click', () => {
    messageBox.style.cssText = 'opacity: 0; bottom: -999px; pointer-events: none;';
    messageBox.setAttribute('aria-hidden', 'true');
});

copyBtn.addEventListener('click', () => {
    cssOutput.select();
    document.execCommand('copy');
    showMessage('CSS code copied!', 1000);
    
    copyIcon.classList.add('hidden');
    checkIcon.classList.remove('hidden');
    setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
    }, 1000);
});

shareBtn.addEventListener('click', () => {
    const shareUrl = generateShareURL();
    navigator.clipboard.writeText(shareUrl)
        .then(() => showMessage('Share URL copied to clipboard! 📋', 2000))
        .catch(() => showMessage('Failed to copy URL.', 2000));
});

const initialize = () => {
    if (!loadFromURL()) {
        colors = [
            { id: nextColorId++, color: '#4f46e5', position: 0 },
            { id: nextColorId++, color: '#ec4899', position: 100 }
        ];
        colors.forEach(color => colorStopsContainer.appendChild(createColorStopElement(color)));
        updateGradient();
    }
};

initialize();