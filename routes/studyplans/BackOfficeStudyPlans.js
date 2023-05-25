const StudyPlans = require('../../respository/studyplan/StudyPlans.js');

module.exports = (server) => {
  // get all studyPlans
  server.route({
    method: 'POST',
    path: '/api/v1/studyplans',
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
        const { study_plan_id } = request.payload;
        if (study_plan_id != '') {
          const responsedata = await StudyPlans.StudyPlansRepo.getStudyPlanById(
            study_plan_id
          );
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } else {
          const responsedata =
            await StudyPlans.StudyPlansRepo.getAllStudyPlans();
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

  //api/v1/studyplan_create
  server.route({
    method: 'POST',
    path: '/api/v1/studyplan_create',
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
          curriculum_id,
          study_plan_name,
          study_plan_version,
          total_credit,
        } = request.payload;

        const responsedata = await StudyPlans.StudyPlansRepo.addNewStudyPlan(
          curriculum_id,
          study_plan_name,
          study_plan_version,
          total_credit
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

  // /api/v1/studyplan_edit
  server.route({
    method: 'POST',
    path: '/api/v1/studyplan_edit',
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
        const { study_plan_id, study_plan_name } = request.payload;

        const responsedata = await StudyPlans.StudyPlansRepo.editStudyPlan(
          study_plan_id,
          study_plan_name
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

  // /api/v1/studyplan_delete
  server.route({
    method: 'POST',
    path: '/api/v1/studyplan_delete',
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
        const { study_plan_id } = request.payload;
        const responsedata = await StudyPlans.StudyPlansRepo.deleteStudyPlan(
          study_plan_id
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

  // /api/v1/studyplan_updatacredit
  server.route({
    method: 'POST',
    path: '/api/v1/studyplan_updatacredit',
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
        const { study_plan_id, total_credit } = request.payload;

        const responsedata = await StudyPlans.StudyPlansRepo.updataTotalCredit(
          study_plan_id,
          total_credit
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
