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
const SubStudy = require('./respository/studyplan/SubStudy.js');

const env = require('./env.js');

// Route
const RoutesBackOfficeCurriculums = require('./routes/studyplans/BackOfficeCurriculums.js');
const RoutesBackOfficeSubjects = require('./routes/studyplans/BackOfficeSubjects.js');
const RoutesBackOfficeRelations = require('./routes/studyplans/BackOfficeRelations');
const RoutesBackOfficeStudyPlans = require('./routes/studyplans/BackOfficeStudyPlans');
const RoutesBackOfficeSubStudy = require('./routes/studyplans/BackOfficeSubStudy');

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

  // สำหรับ BackOffice API
  RoutesBackOfficeCurriculums(server);
  RoutesBackOfficeSubjects(server);
  RoutesBackOfficeRelations(server);
  RoutesBackOfficeStudyPlans(server);
  RoutesBackOfficeSubStudy(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
