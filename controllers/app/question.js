const db = require('../../db/db');
const authMiddleware = require('../../middleware/authMiddleware');


const getQuestion = async (req, res) => {
    try {
        await authMiddleware(req, res, async () => {
            const studentId = req.user.id;
            const drill_id = req.params.id;

            const student = await db.Student.findByPk(studentId);
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }

            const drillLevel = await db.DrillLevel.findOne({
                where: { drill_id: drill_id, std_id: studentId },
                attributes: ['isTime', 'time', 'score', 'levels'],
            });

            const isTimed = drillLevel ? drillLevel.isTime : false;
            const timeLimit = drillLevel && drillLevel.isTime ? drillLevel.time : '';
            const score = drillLevel ? drillLevel.score : 0;

            const startPoint = drillLevel ? drillLevel.levels : 1;
            const endPoint = drillLevel ? startPoint + 1 : 2;

            let wrongAttempts = 0;
            if (score === -20) wrongAttempts = 1;
            else if (score === -40) wrongAttempts = 2;

            const drill = await db.Drill.findByPk(drill_id, {
                include: [
                    {
                        model: db.Question,
                        required: true,
                        attributes: ['id', 'questionType', 'passage', 'statement', 'image', 'options', 'correct_answer'],
                        include: [
                            {
                                model: db.QuestionStatus,
                                attributes: ['attempted_answer'],
                                where: { student_id: studentId },
                                required: false,
                            }
                        ]
                    }
                ]
            });

            if (!drill) {
                return res.status(404).json({ error: 'Drill not found' });
            }

            const incorrectQuestions = [];
            const unattemptedQuestion = drill.Questions.find(question => {
                const studentAttempt = question.QuestionStatuses[0];
                const isCorrect = studentAttempt && studentAttempt.attempted_answer === question.correct_answer;

                if (studentAttempt && !isCorrect) {
                    incorrectQuestions.push(question);
                }

                return !studentAttempt || !studentAttempt.attempted_answer;
            });

            const allQuestionsAttempted = !unattemptedQuestion;

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