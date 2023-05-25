const SubStudy = require('../../respository/studyplan/SubStudy.js');

module.exports = (server) => {
  // get all studyPlans
  server.route({
    method: 'POST',
    path: '/api/v1/substudy',
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
        const { study_plan_id, sub_study_semester, sub_study_year } =
          request.payload;
        if (
          study_plan_id !== '' &&
          sub_study_semester === '' &&
          sub_study_year === ''
        ) {
          const responsedata = await SubStudy.SubStudyRepo.getSubStudyById(
            study_plan_id
          );
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } else if (
          study_plan_id !== '' &&
          sub_study_semester !== '' &&
          sub_study_year !== ''
        ) {
          const responsedata =
            await SubStudy.SubStudyRepo.getSubStudyBySemesterYear(
              sub_study_semester,
              sub_study_year
            );
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
      }
    },
  });

  // substudy_create
  server.route({
    method: 'POST',
    path: '/api/v1/substudy_create',
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
        const {
          study_plan_id,
          subject_id,
          sub_study_semester,
          sub_study_year,
        } = request.payload;

        const responsedata = await SubStudy.SubStudyRepo.addSubStudy(
          study_plan_id,
          subject_id,
          sub_study_semester,
          sub_study_year
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

  // /api/v1/substudy_delete
  server.route({
    method: 'POST',
    path: '/api/v1/substudy_delete',
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
        const { sub_study_id } = request.payload;
        const responsedata = await SubStudy.SubStudyRepo.deleteSubStudy(
          sub_study_id
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
