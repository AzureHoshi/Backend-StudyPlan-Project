'use strict';

// const OnlineAgent = require('./respository/OnlineAgent');

const Hapi = require('@hapi/hapi');
const mysql = require('mysql');
const Joi = require('joi');
// Create a server with a host and port
//const server = new Hapi.Server();

const RoutesBackOfficeCurriculums = require('./routes/studyplans/BackOfficeCurriculums.js');
const RoutesBackOfficeSubjects = require('./routes/studyplans/BackOfficeSubjects.js');
const RoutesBackOfficeRelations = require('./routes/studyplans/BackOfficeRelations');
const RoutesBackOfficeStudyPlans = require('./routes/studyplans/BackOfficeStudyPlans');
const RoutesBackOfficeSubStudy = require('./routes/studyplans/BackOfficeSubStudy');
const FrontEndStudent = require('./routes/studyplans/FrontEndStudent');

let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'studyplan',
  port: 3306,
});

const init = async () => {
  const server = Hapi.server({
    port: 3200,
    host: '0.0.0.0',
    routes: {
      cors: true,
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    },
  });

  // Add the route
  server.route({
    method: 'GET',
    path: '/agents',
    handler: async function (request, reply) {
      try {
        const responsedata = await OnlineAgent.OnlineAgentRepo.getOnlineAgentByAgentCode('08840');
        if (responsedata.error) {
          return responsedata.errMessage;
        } else {
          return responsedata;
        }
      } catch (err) {
        server.log(['error', 'home'], err);
        return err;
        //console.dir(err)
      }
    },
  });

  RoutesBackOfficeCurriculums(server);
  RoutesBackOfficeSubjects(server);
  RoutesBackOfficeRelations(server);
  RoutesBackOfficeStudyPlans(server);
  RoutesBackOfficeSubStudy(server);
  FrontEndStudent(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
