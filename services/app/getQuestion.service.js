const db = require('../../db/db');

const getQuestionDetails = async (studentId, drill_id, currentLevel) => {
  const [student, drillLevel, drill] = await Promise.all([
    db.Student.findByPk(studentId),
    currentLevel !== undefined && currentLevel !== null
      ? db.DrillLevel.findOne({
          where: { drill_id, std_id: studentId, levels: currentLevel },
          attributes: ['isTime', 'time', 'score', 'levels']
        })
      : null,
    db.Drill.findByPk(drill_id, {
      include: [
        {
          model: db.Question,
          required: true,
          attributes: [
            'id',
            'questionType',
            'passage',
            'statement',
            'image',
            'options',
            'correct_answer',
          ],
          include: [
            {
              model: db.QuestionStatus,
              attributes: ['attempted_answer'],
              where: { student_id: studentId },
              required: false
            },
          ],
        },
      ],
    }),
  ]);

  if (!student || !drill) {
    throw new Error('Required data not found');
  }

  if (currentLevel === undefined || currentLevel === null) {
    const randomQuestion = drill.Questions[
      Math.floor(Math.random() * drill.Questions.length)
    ];

    const correctAnswer = randomQuestion.correct_answer;

    return {
      allQuestionsAttempted: false,
      incorrectQuestions: [],
      unattemptedQuestion: null,
      isTimed: false,
      timeLimit: '',
      startPoint: 6,
      endPoint: null,
      score: 100,
      wrongAttempts: 0,
      questionsPool: randomQuestion,
      correctAnswer
    };
  }

  const incorrectQuestions = [];
  const unattemptedQuestion = drill.Questions.find((question) => {
    const studentAttempt = question.QuestionStatuses[0];
    const isCorrect =
      studentAttempt && studentAttempt.attempted_answer === question.correct_answer;

    if (studentAttempt && !isCorrect) {
      incorrectQuestions.push(question);
    }

    return !studentAttempt || !studentAttempt.attempted_answer;
  });

  const score = drillLevel?.score || 0;
  let wrongAttempts = 0;
  if (score === -20) wrongAttempts = 1;
  else if (score === -40) wrongAttempts = 2;

  const allQuestionsAttempted = !unattemptedQuestion;

  const isDrillCompleted = allQuestionsAttempted && incorrectQuestions.length === 0;

  let questionsPool = isDrillCompleted
    ? drill.Questions.filter((question) => drillLevel?.isTime) 
    : drill.Questions;

  if (isDrillCompleted && questionsPool.length === 0) {
    questionsPool = drill.Questions;
  }



  return {
    allQuestionsAttempted,
    incorrectQuestions,
    unattemptedQuestion,
    isTimed: drillLevel?.isTime || false,
    timeLimit: drillLevel?.isTime ? drillLevel.time : '',
    startPoint: currentLevel,
    endPoint: currentLevel + 1,
    score:  score < 0 ? 0 : score,
    wrongAttempts,
    questionsPool:  questionsPool ? questionsPool : drill.Questions,
  };
};

module.exports = {
    getQuestionDetails
};
