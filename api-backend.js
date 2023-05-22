const hapi = require('@hapi/hapi');
//const H2o2 = require('@hapi/h2o2');
var express = require('express');
const AuthBearer = require('hapi-auth-bearer-token');

var express = require('express');
const Joi = require('joi');
const axios = require('axios');
const FormData = require('form-data');

const Curriculum = require('./respository/studyplan/Curriculums.js');
const Subjects = require('./respository/studyplan/Subjects.js');
const Relations = require('./respository/studyplan/Relations.js');
const StudyPlans = require('./respository/studyplan/StudyPlans.js');

const env = require('./env.js');

//---------------- Websocket -----------------------------
const hapiPort = 3200;
const webSocketPort = 3201;
const webPort = 3280;

var url = require('url');

//init Express
var app = express();
//init Express Router
var router = express.Router();

//REST route for GET /status
router.get('/status', function (req, res) {
  res.json({
    status: 'App is running!',
  });
});

//connect path to router
app.use('/', router);

//add middleware for static content
app.use(express.static('static'));
var webserver = app.listen(webPort, function () {
  console.log('Websockets listening on port: ' + webSocketPort);
  console.log('Webserver running on port: ' + webPort);
});
console.log('Running Environment: ' + env);

const init = async () => {
  const server = hapi.Server({
    port: hapiPort,
    host: '0.0.0.0',
    routes: {
      cors: true,
    },
  });

  server.route({
    method: 'GET',
    path: '/api/v1/',
    handler: () => {
      return '<h3> Welcome to CE Reform API V1.0.0</h3>';
    },
  });
  // Sample api with body
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
  // /api/v1/subjects
  server.route({
    method: 'POST',
    path: '/api/v1/subjects',
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
        const { curriculum_id, subject_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.getSubjects(
          curriculum_id,
          subject_id
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
  // /api/v1/subjects_filter
  server.route({
    method: 'POST',
    path: '/api/v1/subjects_filter',
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
          group_type_id,
          subject_type_id,
          subject_category_id,
        } = request.payload;

        // const responsedata = '';

        if (
          (group_type_id != '' &&
            subject_type_id != '' &&
            subject_category_id != '') ||
          (group_type_id != '' && subject_type_id != '') ||
          (subject_type_id != '' && subject_category_id != '') ||
          (group_type_id != '' && subject_category_id != '')
        ) {
          return;
        } else if (group_type_id != '') {
          const responsedata = await Subjects.SubjectRepo.getSubjectsGroupType(
            curriculum_id,
            group_type_id
          );

          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } else if (subject_type_id != '') {
          const responsedata =
            await Subjects.SubjectRepo.getSubjectsSubjectType(
              curriculum_id,
              subject_type_id
            );
          if (responsedata.error) {
            return responsedata.errMessage;
          } else {
            return responsedata;
          }
        } else if (subject_category_id != '') {
          const responsedata = await Subjects.SubjectRepo.getSubjectsCategory(
            curriculum_id,
            subject_category_id
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
  // /api/v1/subject_create
  server.route({
    method: 'POST',
    path: '/api/v1/subject_create',
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
          group_type_id,
          subject_code,
          subject_name_th,
          subject_name_en,
          credit_qty,
          subject_description,
        } = request.payload;

        const responsedata = await Subjects.SubjectRepo.addNewSubject(
          curriculum_id,
          group_type_id,
          subject_code,
          subject_name_th,
          subject_name_en,
          credit_qty,
          subject_description
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
  // /api/v1/subject_edit
  server.route({
    method: 'POST',
    path: '/api/v1/subject_edit',
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
          subject_id,
          group_type_id,
          subject_code,
          subject_name_th,
          subject_name_en,
          credit_qty,
          subject_description,
        } = request.payload;

        const responsedata = await Subjects.SubjectRepo.editSubject(
          subject_id,
          group_type_id,
          subject_code,
          subject_name_th,
          subject_name_en,
          credit_qty,
          subject_description
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
  // /api/v1/subject_delete
  server.route({
    method: 'POST',
    path: '/api/v1/subject_delete',
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
        const { subject_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.deleteSubject(
          subject_id
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
  // /api/v1/subject_search
  server.route({
    method: 'POST',
    path: '/api/v1/subject_search',
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
        const { search_text, column, curriculum_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.searchSubject(
          search_text,
          column,
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
  // /api/v1/categories
  server.route({
    method: 'POST',
    path: '/api/v1/categories',
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
        const { subject_category_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.getCategories(
          subject_category_id
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
  // /api/v1/category_create
  server.route({
    method: 'POST',
    path: '/api/v1/category_create',
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
        const { subject_category_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.addNewCategory(
          subject_category_name
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
  // /api/v1/grouptype
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype',
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
          const responsedata = await Subjects.SubjectRepo.getGroupType(
            curriculum_id
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
  // /api/v1/category_edit
  server.route({
    method: 'POST',
    path: '/api/v1/category_edit',
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
        const { subject_category_id, subject_category_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.editCategory(
          subject_category_id,
          subject_category_name
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
  // /api/v1/category_delete
  server.route({
    method: 'POST',
    path: '/api/v1/category_delete',
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
        const { subject_category_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.deleteCategory(
          subject_category_id
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
  // /api/v1/category_search
  server.route({
    method: 'POST',
    path: '/api/v1/category_search',
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

        const responsedata = await Subjects.SubjectRepo.searchCategories(
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
  // /api/v1/subjecttypes
  server.route({
    method: 'POST',
    path: '/api/v1/subjecttypes',
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
        const { subject_type_id, subject_category_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.getSubjectTypes(
          subject_type_id,
          subject_category_id
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
  // /api/v1/subjecttype_create
  server.route({
    method: 'POST',
    path: '/api/v1/subjecttype_create',
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
        const { subject_category_id, subject_type_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.addNewSubjectType(
          subject_category_id,
          subject_type_name
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
  // /api/v1/subjecttype_edit
  server.route({
    method: 'POST',
    path: '/api/v1/subjecttype_edit',
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
        const { subject_type_id, subject_type_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.editSubjectType(
          subject_type_id,
          subject_type_name
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
  // /api/v1/subjecttype_delete
  server.route({
    method: 'POST',
    path: '/api/v1/subjecttype_delete',
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
        const { subject_type_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.deleteSubjectType(
          subject_type_id
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
  // /api/v1/subjecttype_search
  server.route({
    method: 'POST',
    path: '/api/v1/subjecttype_search',
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

        const responsedata = await Subjects.SubjectRepo.searchSubjectType(
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
  // /api/v1/grouptype2
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype2',
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
        const { group_type_id, subject_type_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.getGroupType2(
          group_type_id,
          subject_type_id
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
  // /api/v1/grouptype_create
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype_create',
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
        const { subject_type_id, group_type_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.addNewGroupType(
          subject_type_id,
          group_type_name
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
  // /api/v1/grouptype_edit
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype_edit',
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
        const { group_type_id, group_type_name } = request.payload;

        const responsedata = await Subjects.SubjectRepo.editGroupType(
          group_type_id,
          group_type_name
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
  // /api/v1/grouptype_delete
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype_delete',
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
        const { group_type_id } = request.payload;

        const responsedata = await Subjects.SubjectRepo.deleteGroupType(
          group_type_id
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
  // /api/v1/grouptype_search
  server.route({
    method: 'POST',
    path: '/api/v1/grouptype_search',
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

        const responsedata = await Subjects.SubjectRepo.searchGroupType(
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

  // /api/v1/relations
  server.route({
    method: 'POST',
    path: '/api/v1/relations',
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
        const { curriculum_id, distinct } = request.payload;

        const responsedata = await Relations.RelationRepo.getAllRelations(
          curriculum_id,
          distinct
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
  // /api/v1/level
  server.route({
    method: 'POST',
    path: '/api/v1/level',
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

        const responsedata = await Relations.RelationRepo.getAllLevel(
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
  // /api/v1/chiles
  server.route({
    method: 'POST',
    path: '/api/v1/chiles',
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
        const { parent_id } = request.payload;

        const responsedata = await Relations.RelationRepo.getChileByParentId(
          parent_id
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
  // /api/v1/parents
  server.route({
    method: 'POST',
    path: '/api/v1/parents',
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
        const { chile_id } = request.payload;

        const responsedata = await Relations.RelationRepo.getParentByChileId(
          chile_id
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
  // /api/v1/subjectbylevel
  server.route({
    method: 'POST',
    path: '/api/v1/subjectbylevel',
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
        const { level } = request.payload;

        const responsedata = await Relations.RelationRepo.getSubjectByLevel(
          level
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
  // /api/v1/root_create
  server.route({
    method: 'POST',
    path: '/api/v1/root_create',
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
        const { subject_id } = request.payload;

        const responsedata = await Relations.RelationRepo.addRoot(subject_id);
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
  // /api/v1/addchile
  server.route({
    method: 'POST',
    path: '/api/v1/addchile',
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
        const { subject_id, parent_id } = request.payload;

        const responsedata = await Relations.RelationRepo.addChileByParentId(
          subject_id,
          parent_id
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
  // delete parent and all chiles
  // /api/v1/delete_parent
  server.route({
    method: 'POST',
    path: '/api/v1/delete_parent',
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
        const { parent_id } = request.payload;

        const responsedata = await Relations.RelationRepo.deleteParent(
          parent_id
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
  // delete one chile
  // /api/v1/delete_chile
  server.route({
    method: 'POST',
    path: '/api/v1/delete_chile',
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
        const { subject_id, parent_id } = request.payload;

        const responsedata = await Relations.RelationRepo.deleteChileByParent(
          subject_id,
          parent_id
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
  // /api/v1/check_chile
  server.route({
    method: 'POST',
    path: '/api/v1/check_chile',
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
        const { parent_id } = request.payload;

        const responsedata = await Relations.RelationRepo.relationsCheck(
          parent_id
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
  // /api/v1/deepdelete
  server.route({
    method: 'POST',
    path: '/api/v1/deepdelete',
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
        // const {
        //     parent_id,
        // } = request.payload;

        const responsedata = await Relations.RelationRepo.deepDelete();
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
  // for add root node
  // /api/v1/subjectlist
  server.route({
    method: 'POST',
    path: '/api/v1/subjectlist',
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

        const responsedata = await Relations.RelationRepo.getSubjectList(
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

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
