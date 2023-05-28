const interest_questions = require('../../respository/studyplan/InterestSurvey');
const student = require('../../respository/studyplan/Student');

module.exports = (server) => {
  // /api/v1/subjects
  server.route({
    method: 'POST',
    path: '/api/v1/interest_questions',
    config: {
      // config for multi body request
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        // body requests
        const { interest_survey_id } = request.payload;

        const responsedata = await interest_questions.InterestSurveyRepo.getQuestions(interest_survey_id);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });

  server.route({
    method: 'POST',
    path: '/api/v1/student_feedback',
    config: {
      // config for multi body request
      payload: {
        multipart: true,
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-width'],
      },
    },
    handler: async function (request, reply) {
      try {
        // body requests
        // const { student_id, feedback_id, feedback_answer } = request.payload;
        const data = request.payload; // รับค่าจาก body ของคำขอ
        const values = data.map((item) => [item.student_id, item.feedback_id, item.feedback_answer]);
        console.log(values);

        const responsedata = await student.StudentRepo.getFeedback(values);
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });
};
