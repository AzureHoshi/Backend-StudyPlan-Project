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

  // /api/v1/student_feedback
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
        const data = request.payload; // รับค่าจาก body ของคำขอ
        const values = data.map((item) => [item.student_id, item.feedback_id, item.sf_answer]);
        console.log(data);

        const responsedata = await student.StudentRepo.insertFeedback(values);
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

  // /api/v1/getstatusfeedback
  server.route({
    method: 'POST',
    path: '/api/v1/getstatusfeedback',
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
        const { stu_code } = request.payload;

        console.log('stu_code: ', stu_code);
        const responsedata = await student.StudentRepo.getStatusFeedback(stu_code);
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

  // /api/v1/update_statusfeedback
  server.route({
    method: 'POST',
    path: '/api/v1/update_statusfeedback',
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
        const { stu_code } = request.payload;

        console.log(stu_code);
        const responsedata = await student.StudentRepo.updatedStatusFeedback(stu_code);
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

  // /api/v1/questions_student
  server.route({
    method: 'POST',
    path: '/api/v1/questions_student',
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
        const { stu_code } = request.payload;

        console.log('student_id: ', stu_code);
        const responsedata = await student.StudentRepo.getQuestionSurvey(stu_code);
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

  // /api/v1/answer_questionstudent
  server.route({
    method: 'POST',
    path: '/api/v1/answer_questionstudent',
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
        const { interest_question_id } = request.payload;

        console.log('interest_question_id: ', interest_question_id);
        const responsedata = await student.StudentRepo.getAnswerQuestionSurvey(interest_question_id);
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

  // /api/v1/student_answer
  server.route({
    method: 'POST',
    path: '/api/v1/student_answers',
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
        const data = request.payload; // รับค่าจาก body ของคำขอ
        const values = data.map((item) => [item.student_id, item.interest_question_id, item.interest_answers_id]);
        console.log(values);

        const responsedata = await student.StudentRepo.insertStudentAnswer(values);
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
