var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'interest_questions';

async function getQuestions(interest_survey_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT *
    FROM interest_questions WHERE interest_survey_id = ${interest_survey_id}`;

    console.log('Query1 is: ', Query);

    pool.query(Query, async function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1.length > 0) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Sub Study!',
        });
      }
    });
  });
}

async function getQuestionsFormat(interest_survey_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    // Query = `SELECT * FROM ${table}
    //     WHERE interest_survey_id = ${interest_survey_id} AND is_deleted = 0`;
    let format = {
      id: '-',
      labelquestion: '-',
      answers: [],
    };

    Query1 = `SELECT *
    FROM interest_questions WHERE interest_survey_id = ${interest_survey_id}`;

    Query2 =
      'SELECT * FROM interest_questions INNER JOIN answer_questions ON answer_questions.interest_question_id = interest_questions.interest_question_id';

    console.log('Query1 is: ', Query);

    pool.query(Query1, async function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      var question = [];
      for (let i = 0; i < results1.length; i++) {
        question[i] = format;
      }
      console.log(question);

      // for (let i in results1) {
      //   question[i] = format;
      //   question[i].id = results1[i].interest_question_id;
      //   // console.log(results1[i].interest_question_id);
      // }
      // pool.query(Query2, function (error, results) {
      //   let temp = 0;
      //   for (let i in results) {
      //     //console.log(question[0].id);
      //   }
      //   //console.log(results);
      //   //console.log(question);
      // });
      if (results1.length > 0) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          data: question,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Sub Study!',
        });
      }
    });
  });
}

module.exports.InterestSurveyRepo = {
  getQuestions: getQuestions,
  getQuestionsFormat: getQuestionsFormat,
};
