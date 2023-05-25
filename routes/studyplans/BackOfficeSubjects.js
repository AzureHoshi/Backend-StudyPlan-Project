const Subjects = require('../../respository/studyplan/Subjects.js');

module.exports = (server) => {
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
};
