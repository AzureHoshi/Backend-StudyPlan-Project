const interest_questions = require('../../respository/studyplan/InterestSurvey');

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

        const responsedata =
          await interest_questions.InterestSurveyRepo.getQuestions(
            interest_survey_id
          );
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
