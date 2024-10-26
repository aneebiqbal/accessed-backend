const db = require('../../db/db');
const authMiddleware = require('../../middleware/authMiddleware');
const { getQuestionDetails } = require('../../services/app/getQuestion.service');


const getQuestion = async (req, res) => {
    try {
        await authMiddleware(req, res, async () => {
            const studentId = req.user.id;
            const drill_id = req.params.id;

            const {
                allQuestionsAttempted,
                incorrectQuestions,
                unattemptedQuestion,
                isTimed,
                timeLimit,
                startPoint,
                endPoint,
                score,
                wrongAttempts
            } = await getQuestionDetails(studentId, drill_id);

            if (allQuestionsAttempted && incorrectQuestions.length > 0) {
                return res.json({
                    questions: incorrectQuestions.map(question => ({
                        id: question.id,
                        question_type: question.questionType,
                        passage: question.passage || '',
                        statement: question.statement,
                        image: question.image || '',
                        options: question.options,
                        startPoint,
                        endPoint,
                        score: question.score,
                        isTimed: isTimed,
                        time: timeLimit,
                        wrong_attempts: wrongAttempts,
                    }))
                });
            }

            if (unattemptedQuestion) {
                const studentAttempt = unattemptedQuestion.QuestionStatuses[0];
                const questionScore = studentAttempt ? 
                    (studentAttempt.attempted_answer === unattemptedQuestion.correct_answer ? score + 20 : score - 20) : score;

                return res.json({
                    id: unattemptedQuestion.id,
                    question_type: unattemptedQuestion.questionType,
                    passage: unattemptedQuestion.passage || '',
                    statement: unattemptedQuestion.statement,
                    image: unattemptedQuestion.image || '',
                    options: unattemptedQuestion.options,
                    startPoint,
                    endPoint,
                    score: questionScore,
                    isTimed: isTimed,
                    time: timeLimit,
                    wrong_attempts: wrongAttempts,
                });
            }
        });
    } catch (error) {
        console.error('Error fetching Question:', error);
        return res.status(500).json({ error: 'Failed to fetch Question' });
    }
};

module.exports = { getQuestion };