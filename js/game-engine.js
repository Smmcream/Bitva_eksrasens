class GameEngine {
    constructor() {
        this.score = 0;
        this.currentRound = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.gameActive = true;
    }
    
    startGame() {
        this.score = 0;
        this.currentRound = 0;
        this.currentQuestion = 0;
        this.gameActive = true;
        this.calculateTotalQuestions();
    }
    
    getCurrentQuestion() {
        if (!this.gameActive || this.currentRound >= gameData.rounds.length) {
            return null;
        }
        
        const round = gameData.rounds[this.currentRound];
        if (this.currentQuestion >= round.items.length) {
            return null;
        }
        
        return round.items[this.currentQuestion];
    }
    
    checkAnswer(answerIndex) {
        const question = this.getCurrentQuestion();
        if (!question) return { isCorrect: false, story: "", gameFinished: true };
        
        const isCorrect = (answerIndex === question.correct);
        if (isCorrect) this.score++;
        
        // Переходим к следующему вопросу
        this.currentQuestion++;
        
        // Проверяем, закончился ли текущий раунд
        const currentRoundData = gameData.rounds[this.currentRound];
        if (this.currentQuestion >= currentRoundData.items.length) {
            this.currentRound++;
            this.currentQuestion = 0;
        }
        
        // Проверяем, закончилась ли игра
        const gameFinished = this.currentRound >= gameData.rounds.length;
        if (gameFinished) {
            this.gameActive = false;
        }
        
        return {
            isCorrect,
            story: question.story,
            gameFinished: gameFinished
        };
    }
    
    getFinalResult() {
        const percentage = (this.score / this.totalQuestions) * 100;
        let titleKey = 1;
        
        if (percentage >= 90) titleKey = 5;
        else if (percentage >= 70) titleKey = 4;
        else if (percentage >= 50) titleKey = 3;
        else if (percentage >= 30) titleKey = 2;
        
        return {
            ...gameData.titles[titleKey],
            score: this.score,
            total: this.totalQuestions
        };
    }
    
    calculateTotalQuestions() {
        this.totalQuestions = gameData.rounds.reduce((total, round) => {
            return total + round.items.length;
        }, 0);
    }
}