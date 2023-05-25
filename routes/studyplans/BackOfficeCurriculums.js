const Curriculum = require('../../respository/studyplan/Curriculums');
const Subjects = require('../../respository/studyplan/Subjects.js');
const Relations = require('../../respository/studyplan/Relations.js');
const StudyPlans = require('../../respository/studyplan/StudyPlans.js');
const SubStudy = require('../../respository/studyplan/SubStudy.js');

module.exports = (server) => {
  // /api/v1/curriculum
  server.route({
    method: 'POST',
    path: '/api/v1/curriculum',
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
        const { curriculum_id } = request.payload;
        if (curriculum_id != '') {
          const responsedata =
            await Curriculum.CurriculumsRepo.getCurriculmById(curriculum_id);
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } else {
          const responsedata =
            await Curriculum.CurriculumsRepo.getAllCurriculm();
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

  // /api/v1/curriculum_create
  server.route({
    method: 'POST',
    path: '/api/v1/curriculum_create',
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
          student_cur_group_id,
          faculty_id,
          curriculum_name_th,
          curriculum_name_en,
          curriculum_year,
          ref_curriculum_id,
        } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.addNewCurriculum(
          student_cur_group_id,
          faculty_id,
          curriculum_name_th,
          curriculum_name_en,
          curriculum_year,
          ref_curriculum_id
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

  // /api/v1/curriculum_edit
  server.route({
    method: 'POST',
    path: '/api/v1/curriculum_edit',
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
          student_cur_group_id,
          faculty_id,
          curriculum_name_th,
          curriculum_name_en,
          curriculum_year,
        } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.editCurriculum(
          curriculum_id,
          student_cur_group_id,
          faculty_id,
          curriculum_name_th,
          curriculum_name_en,
          curriculum_year
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

  // /api/v1/curriculum_delete
  server.route({
    method: 'POST',
    path: '/api/v1/curriculum_delete',
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
        const { curriculum_id } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.deleteCurriculum(
          curriculum_id
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

  // /api/v1/curriculum_search
  server.route({
    method: 'POST',
    path: '/api/v1/curriculum_search',
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
        const { search_text, column } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.searchCurriculums(
          search_text,
          column
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

  // /api/v1/faculty
  server.route({
    method: 'POST',
    path: '/api/v1/faculty',
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
        const { faculty_id } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.getAllFaculty(
          faculty_id
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
  // /api/v1/faculty_create
  server.route({
    method: 'POST',
    path: '/api/v1/faculty_create',
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
        const { faculty_name_th, faculty_name_en } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.addNewFaculty(
          faculty_name_th,
          faculty_name_en
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
  // /api/v1/faculty_edit
  server.route({
    method: 'POST',
    path: '/api/v1/faculty_edit',
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
        const { faculty_id, faculty_name_th, faculty_name_en } =
          request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.editFaculty(
          faculty_id,
          faculty_name_th,
          faculty_name_en
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
  // /api/v1/faculty_delete
  server.route({
    method: 'POST',
    path: '/api/v1/faculty_delete',
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
        const { faculty_id } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.deleteFaculty(
          faculty_id
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
  // /api/v1/faculty_search
  server.route({
    method: 'POST',
    path: '/api/v1/faculty_search',
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
        const { search_text, column } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.searchFaculty(
          search_text,
          column
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
  // /api/v1/studentgroups
  server.route({
    method: 'POST',
    path: '/api/v1/studentgroups',
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
        const { student_cur_group_id } = request.payload;

        const responsedata =
          await Curriculum.CurriculumsRepo.getAllCurrentGroups(
            student_cur_group_id
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

  // /api/v1/studentgroup_create
  server.route({
    method: 'POST',
    path: '/api/v1/studentgroup_create',
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
          group_name_th,
          group_name_en,
          group_short_name_th,
          group_short_name_en,
        } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.addNewGroup(
          group_name_th,
          group_name_en,
          group_short_name_th,
          group_short_name_en
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
  // /api/v1/studentgroup_edit
  server.route({
    method: 'POST',
    path: '/api/v1/studentgroup_edit',
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
          student_cur_group_id,
          group_name_th,
          group_name_en,
          group_short_name_th,
          group_short_name_en,
        } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.editGroup(
          student_cur_group_id,
          group_name_th,
          group_name_en,
          group_short_name_th,
          group_short_name_en
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
  // /api/v1/studentgroup_delete
  server.route({
    method: 'POST',
    path: '/api/v1/studentgroup_delete',
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
        const { student_cur_group_id } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.deleteGroup(
          student_cur_group_id
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
  // /api/v1/studentgroup_search
  server.route({
    method: 'POST',
    path: '/api/v1/studentgroup_search',
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
        const { search_text, column } = request.payload;

        const responsedata = await Curriculum.CurriculumsRepo.searchGroup(
          search_text,
          column
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
