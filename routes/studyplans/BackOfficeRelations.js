const Relations = require('../../respository/studyplan/Relations.js');

module.exports = (server) => {
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
};
