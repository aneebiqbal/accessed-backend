const db = require('../../db/db');

const getQuestionDetails = async (studentId, drill_id) => {
    const student = await db.Student.findByPk(studentId);
    if (!student) {
        throw new Error('Student not found');
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
        throw new Error('Drill not found');
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
    return {
        allQuestionsAttempted,
        incorrectQuestions,
        unattemptedQuestion,
        isTimed,
        timeLimit,
        startPoint,
        endPoint,
        score,
        wrongAttempts
    };
};

module.exports = {
    getQuestionDetails
};
