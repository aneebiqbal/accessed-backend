const { Op } = require("sequelize");
const db = require("../../db/db");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  getQuestionDetails,
} = require("../../services/app/getQuestion.service");

const getQuestion = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;
      const drill_id = req.params.id;

      const inProgressLevel = await db.DrillLevel.findOne({
        where: { drill_id, std_id: studentId },
        attributes: ['levels'],
        order: [['updatedAt', 'DESC']]
      });

      if (!inProgressLevel) {
        return res.status(404).json({ error: "In-progress level not found" });
      }

      const currentLevel = inProgressLevel.levels;
      const {
        allQuestionsAttempted,
        incorrectQuestions,
        unattemptedQuestion,
        isTimed,
        timeLimit,
        startPoint,
        endPoint,
        score,
        wrongAttempts,
        questionsPool
      } = await getQuestionDetails(studentId, drill_id, currentLevel);

      const finalEndPoint = endPoint > 6 ? null : endPoint;

      if (unattemptedQuestion) {
        return res.json({
          id: unattemptedQuestion.id,
          question_type: unattemptedQuestion.questionType,
          passage: unattemptedQuestion.passage || "",
          statement: unattemptedQuestion.statement,
          image: unattemptedQuestion.image || "",
          options: unattemptedQuestion.options,
          startPoint,
          endPoint: finalEndPoint,
          score,
          isTimed: isTimed,
          time: timeLimit,
          wrong_attempts: wrongAttempts,
        });
      }

      if (allQuestionsAttempted && incorrectQuestions.length > 0) {
        const nextIncorrectQuestion = incorrectQuestions.shift();
        return res.json({
          id: nextIncorrectQuestion.id,
          question_type: nextIncorrectQuestion.questionType,
          passage: nextIncorrectQuestion.passage || "",
          statement: nextIncorrectQuestion.statement,
          image: nextIncorrectQuestion.image || "",
          options: nextIncorrectQuestion.options,
          startPoint,
          endPoint: finalEndPoint,
          score,
          isTimed: isTimed,
          time: timeLimit,
          wrong_attempts: wrongAttempts,
        });
      }
      if (allQuestionsAttempted && incorrectQuestions.length === 0 && !unattemptedQuestion) {
        const randomQuestion = getRandomQuestion(questionsPool);
        return res.json({
          id: randomQuestion.id,
          question_type: randomQuestion.questionType,
          passage: randomQuestion.passage || "",
          statement: randomQuestion.statement,
          image: randomQuestion.image || "",
          options: randomQuestion.options,
          startPoint,
          endPoint: finalEndPoint,
          score,
          isTimed,
          time: timeLimit,
          wrong_attempts: wrongAttempts,
        });
      }
    });

    
  } catch (error) {
    console.error("Error fetching Question:", error);
    return res.status(500).json({ error: "Failed to fetch Question" });
  }
};

const submitQuestion = async (req, res) => {
  try {
    await authMiddleware(req, res, async () => {
      const studentId = req.user.id;
    const { drill_id, questionId, answer } = req.body;

      const [student, drillLevel, question] = await Promise.all([
        db.Student.findByPk(studentId),
        db.DrillLevel.findOne({
          where: { drill_id, std_id: studentId, status: "inProgress" },
          attributes: ["isTime", "time", "score", "levels", "status"],
        }),
        db.Question.findByPk(questionId, {
          include: {
            model: db.QuestionStatus,
            where: { student_id: studentId },
            required: false,
          },
        }),
      ]);

      if (question.drill_id !== drill_id) {
        return res.status(400).json({ error: "Invalid question for this drill" });
      }

      const drillStatus = await db.DrillStatus.findOne({
        where: { drill_id, student_id: studentId },
      });

      const isDrillCompleted = drillStatus && drillStatus.status === "Completed";

      if (isDrillCompleted) {
        const { questionsPool } = await getQuestionDetails(studentId, drill_id);

        if (questionsPool) {
          return res.json({
            nextQuestion: {
              id: questionsPool.id,
              question_type: questionsPool.questionType,
              passage: questionsPool.passage || "",
              statement: questionsPool.statement,
              image: questionsPool.image || "",
              options: questionsPool.options,
              score: 100,
              startPoint: 6,
              endPoint: null
            },
            Answer: question.correct_answer,
          });
        }
      }
      if (!student || !question) {
        return res.status(404).json({ error: "Required data not found" });
      }

      const isAnswerCorrect = answer === question.correct_answer;
      let newScore = drillLevel ? drillLevel.score : 0;

      if (drillLevel && drillLevel.levels !== 0 && drillLevel.status === "inProgress") {
        newScore = Math.min(
          100,
          Math.max(-60, drillLevel.score + (isAnswerCorrect ? 20 : -20))
        );
      }


      const existingQuestionStatus = await db.QuestionStatus.findOne({
        where: { question_id: questionId, student_id: studentId },
      });
      if (existingQuestionStatus) {
        await existingQuestionStatus.update({ attempted_answer: answer });
      } else {
        await db.QuestionStatus.create({
          question_id: questionId,
          student_id: studentId,
          attempted_answer: answer,
        });
      }


      let promoted = false;
      let demoted = false;

      if (newScore === 100 && drillLevel.status === "inProgress") {
        promoted = true;

        await db.DrillLevel.update(
          { score: 100, status: "Completed" },
          {
            where: {
              drill_id,
              std_id: studentId,
              levels: drillLevel.levels,
              status: "inProgress",
            },
          }
        );

        const nextLevel = await db.DrillLevel.findOne({
          where: { drill_id, std_id: studentId, levels: drillLevel.levels + 1 },
        });

        if (nextLevel) {
          if (nextLevel.status === "Blocked") {
            await nextLevel.update({ status: "inProgress" });
          }
        } else if (drillLevel.levels < 6) {
          await db.DrillLevel.create({
            drill_id,
            std_id: studentId,
            levels: drillLevel.levels + 1,
            status: "inProgress",
            score: 0,
          });
        } if (drillLevel.levels === 6) {
            await db.DrillStatus.update(
                { status: "Completed" },
                { where: { drill_id, student_id: studentId } }
              );
              
              const currentDrill = await db.Drill.findByPk(drill_id);
              
              const childDrills = await db.Drill.findAll({
                
                where: { parent_drill_id: { [Op.contains]: [currentDrill.id] }},
              });
              
              await Promise.all(
                childDrills.map(async (childDrill) => {
                  const parentDrills = await db.Drill.findAll({
                    where: { id: childDrill.parent_drill_id },
                  });
              
                  const allParentsCompleted = await Promise.all(
                    parentDrills.map(async (parentDrill) => {
                      const parentStatus = await db.DrillStatus.findOne({
                        where: { drill_id: parentDrill.id, student_id: studentId },
                      });
                      return parentStatus && parentStatus.status === "Completed";
                    })
                  );
              
                  if (allParentsCompleted.every((status) => status)) {

                    let childStatus = await db.DrillStatus.findOne({
                      where: { drill_id: childDrill.id, student_id: studentId },
                    });
              
                    if (!childStatus) {
                      await db.DrillStatus.create({
                        drill_id: childDrill.id,
                        student_id: studentId,
                        status: "inProgress",
                      });
                    } else if (childStatus.status === "Blocked") {
                      await childStatus.update({ status: "inProgress" });
                    }
                  }
                })
              );
              
          }}

      if (newScore === -60 && drillLevel.status === "inProgress") {
        demoted = true;

        await db.DrillLevel.update(
          { score: 0, status: "Blocked" },
          {
            where: {
              drill_id,
              std_id: studentId,
              levels: drillLevel.levels,
              status: "inProgress",
            },
          }
        );

        if (drillLevel.levels === 1) {
          const levelZero = await db.DrillLevel.findOne({
            where: { drill_id, std_id: studentId, levels: 0 },
          });
      
          if (levelZero && levelZero.status === "Completed") {
            await levelZero.update({ status: "inProgress" });
          }
        } else {
          const previousLevel = await db.DrillLevel.findOne({
            where: { drill_id, std_id: studentId, levels: drillLevel.levels - 1 },
          });
      
          if (previousLevel && previousLevel.status === "Completed") {
            await previousLevel.update({ status: "inProgress", score: 40 });
          }
        }
      }

      if (!promoted && !demoted) {
        await db.DrillLevel.update(
          { score: newScore },
          { where: { drill_id, std_id: studentId, levels: drillLevel.levels, status: "inProgress" } }
        );
      }

      let wrongAttempts = 0;
      if (newScore === -20) wrongAttempts = 1;
      else if (newScore === -40) wrongAttempts = 2;
      else if (newScore === -60) wrongAttempts = 3;

      const { allQuestionsAttempted, incorrectQuestions, unattemptedQuestion, startPoint, endPoint, questionsPool } =
        await getQuestionDetails(studentId, drill_id, currentLevel=drillLevel.levels);

        const finalEndPoint = endPoint > 6 ? null : endPoint;

        
        if (unattemptedQuestion) {
          return res.json({
            nextQuestion: promoted || demoted ? {
              startPoint,
              endPoint: finalEndPoint,
              wrong_attempts: wrongAttempts,
              score: newScore <= 0 ? 0 : newScore
            } : {
              id: unattemptedQuestion?.id || null,
              question_type: unattemptedQuestion?.questionType || "",
              passage: unattemptedQuestion?.passage || "",
              statement: unattemptedQuestion?.statement || "",
              image: unattemptedQuestion?.image || "",
              options: unattemptedQuestion?.options || [],
              score: newScore <= 0 ? 0 : newScore,
              isTimed: drillLevel?.isTime || false,
              startPoint,
              endPoint: finalEndPoint,
              time: drillLevel?.time || "",
              wrong_attempts: wrongAttempts,
            },
            promoted,
            demoted,
            Answer: question.correct_answer,
          });
        }
  
        if (allQuestionsAttempted && incorrectQuestions.length === 0 ) {
          const randomQuestion = getRandomQuestion(questionsPool);
          return res.json({
            nextQuestion: promoted || demoted ? {
              startPoint,
              endPoint: finalEndPoint,
              wrong_attempts: wrongAttempts,
              score: newScore <= 0 ? 0 : newScore
            } : {
              id: randomQuestion.id,
              question_type: randomQuestion.questionType,
              passage: randomQuestion.passage || "",
              statement: randomQuestion.statement,
              image: randomQuestion.image || "",
              options: randomQuestion.options,
              startPoint,
              endPoint: finalEndPoint,
              score: newScore <= 0 ? 0 : newScore,
              isTimed: drillLevel?.isTime || false,
              time: drillLevel?.time || "",
              wrong_attempts: wrongAttempts,
            },
            promoted,
            demoted,
            Answer: question.correct_answer,
          });
        }
        
        if (incorrectQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * incorrectQuestions.length);
          const incorrectQuestion = incorrectQuestions[randomIndex];
          
          return res.json({
            nextQuestion: promoted || demoted ? {
              startPoint,
              endPoint: finalEndPoint,
              wrong_attempts: wrongAttempts,
              score: newScore <= 0 ? 0 : newScore
            } : {
              id: incorrectQuestion.id,
              question_type: incorrectQuestion.questionType,
              passage: incorrectQuestion.passage || "",
              statement: incorrectQuestion.statement || "",
              image: incorrectQuestion.image || "",
              options: incorrectQuestion.options || [],
              score: newScore <= 0 ? 0 : newScore,
              isTimed: drillLevel?.isTime || false,
              startPoint,
              endPoint: finalEndPoint,
              time: drillLevel?.time || "",
              wrong_attempts: wrongAttempts,
            },
            promoted,
            demoted,
            Answer: question.correct_answer,
          });
        }

    });
  } catch (error) {
    console.error("Error submitting Question:", error);
    return res.status(500).json({ error: "Failed to submit Question" });
  }
};

const getRandomQuestion = (questionsPool) => {
  const randomIndex = Math.floor(Math.random() * questionsPool.length);
  return questionsPool[randomIndex];
};

module.exports = { getQuestion, submitQuestion };
