// Глобальные переменные
let gameEngine;
let timerInterval;
let currentQuestion;

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('game.html')) {
        initGame();
    }
});

// Инициализация игры
function initGame() {
    gameEngine = new GameEngine();
    gameEngine.startGame();
    loadQuestion();
    updateProgress();
}

// Загрузка вопроса в интерфейс
function loadQuestion() {
    currentQuestion = gameEngine.getCurrentQuestion();
    
    if (!currentQuestion) {
        endGame();
        return;
    }
    
    // Скрываем секцию продолжения
    document.getElementById('continue-section').classList.add('hidden');
    
    // Обновляем заголовок раунда
    const roundTitle = document.getElementById('round-title');
    const currentRoundData = gameData.rounds[gameEngine.currentRound];
    roundTitle.textContent = currentRoundData.title;
    
    // Загружаем изображение
    const questionImg = document.getElementById('question-img');
    questionImg.src = currentQuestion.image;
    questionImg.alt = currentQuestion.item;
    
    // Обновляем текст вопроса
    const questionText = document.getElementById('question-text');
    questionText.textContent = currentQuestion.question;
    
    // Создаем варианты ответов
    createOptions(currentQuestion.options);
    
    // Запускаем таймер
    startTimer(currentRoundData.time);
    
    // Обновляем прогресс
    updateProgress();
}

// Создание кнопок с вариантами ответов
function createOptions(options) {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option fade-in';
        optionElement.textContent = option;
        optionElement.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionElement);
    });
}

// Выбор ответа 
function selectAnswer(selectedIndex) {
    // Останавливаем таймер
    stopTimer();
    
    // Проверяем ответ
    const result = gameEngine.checkAnswer(selectedIndex);
    
    // подсвечиваем правильный/неправильный ответ
    highlightAnswers(selectedIndex, currentQuestion.correct);
    
    // показываем историю и кнопку продолжения
    showContinueSection(result.story, result.gameFinished);
}

// Подсветка ответов
function highlightAnswers(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
}

// Показ секции продолжения
function showContinueSection(story, gameFinished) {
    const storyText = document.getElementById('story-text');
    storyText.textContent = story;
    
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.textContent = gameFinished ? 'УЗНАТЬ РЕЗУЛЬТАТ' : 'СЛЕДУЮЩИЙ ВОПРОС';
    continueBtn.onclick = () => {
        if (gameFinished) {
            endGame();
        } else {
            loadQuestion();
        }
    };
    
    // показываем секцию продолжения
    document.getElementById('continue-section').classList.remove('hidden');
    
    // Плавная прокрутка к результату
    setTimeout(() => {
        document.getElementById('continue-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
}

// Таймер
function startTimer(seconds) {
    const timerElement = document.getElementById('timer');
    let timeLeft = seconds;
    
    timerElement.textContent = timeLeft;
    timerElement.style.background = 'linear-gradient(45deg, var(--accent-light), var(--accent-color))';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 5) {
            timerElement.style.background = 'linear-gradient(45deg, #ff6b6b, #ff4757)';
        }
        
        if (timeLeft <= 0) {
            stopTimer();
            const randomAnswer = Math.floor(Math.random() * currentQuestion.options.length);
            selectAnswer(randomAnswer);
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Обновление прогресса
function updateProgress() {
    const currentRoundElement = document.getElementById('current-round');
    const totalRoundsElement = document.getElementById('total-rounds');
    
    if (currentRoundElement && totalRoundsElement) {
        currentRoundElement.textContent = gameEngine.currentRound + 1;
        totalRoundsElement.textContent = gameData.rounds.length;
    }
}

// Завершение игры ура!
function endGame() {
    const result = gameEngine.getFinalResult();
    localStorage.setItem('gameResult', JSON.stringify(result));
    window.location.href = 'result.html';
}

// Частицы для фона (для главной страницы)
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Запускаем частицы на главной странице
if (window.location.pathname.includes('index.html') || 
    window.location.pathname.endsWith('/')) {
    createParticles();
}