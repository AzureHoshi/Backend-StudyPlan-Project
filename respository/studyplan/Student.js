var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'students';

async function insertFeedback(values) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO students_feedback (student_id, feedback_id, sf_answer) VALUES ?`;

    console.log(Query);

    pool.query(Query, [values], function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Student Feedback inserted successfully`,
        data: results1,
      });
    });
  });
}

async function getStatusFeedback(stu_code) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT stu_status_feedback FROM ${table} WHERE stu_code = ${stu_code};`;

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1[0].stu_status_feedback === 1) {
        return resolve({
          statusCode: 200,
          returnCode: 1,
          message: `get Student StatusFeedback successfully`,
          statusFeedback: 1,
        });
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `get Student StatusFeedback successfully`,
        statusFeedback: 0,
      });
    });
  });
}

async function updatedStatusFeedback(stu_code) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE ${table} SET stu_status_feedback = 1 WHERE stu_code = ${stu_code}`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Student Feedback inserted successfully`,
        data: results1,
      });
    });
  });
}

async function getQuestionSurvey(stu_code) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT interest_questions.interest_question_id,interest_questions.interest_question_no, interest_questions.interest_question_title, interest_questions.created_datetime
FROM ${table} 
INNER JOIN curriculums ON students.student_cur_group_id = curriculums.student_cur_group_id
INNER JOIN interest_surveys ON interest_surveys.curriculum_id = curriculums.curriculum_id
INNER JOIN interest_questions ON interest_surveys.interest_survey_id = interest_questions.interest_survey_id
WHERE students.stu_code = ${stu_code} AND interest_surveys.is_deleted = 0 AND interest_questions.is_deleted = 0`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `get Question for interest_questions successfully`,
        data: results1,
      });
    });
  });
}

async function getAnswerQuestionSurvey(interest_question_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM interest_answers WHERE interest_answers.interest_question_id = ${interest_question_id}`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `get Answer For Question successfully`,
        data: results1,
      });
    });
  });
}

async function insertStudentAnswer(values) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO student_survey_answer (student_id, interest_question_id, interest_answers_id) VALUES ?`;

    console.log(Query);

    pool.query(Query, [values], function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `insert Student Survey Answers successfully`,
        data: results1,
      });
    });
  });
}

async function test() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM curriculums`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        console.log(error);
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `insert Student Survey Answers successfully`,
        data: results1,
      });
    });
  });
}

module.exports.StudentRepo = {
  insertFeedback: insertFeedback,
  getStatusFeedback: getStatusFeedback,
  updatedStatusFeedback: updatedStatusFeedback,
  getQuestionSurvey: getQuestionSurvey,
  getAnswerQuestionSurvey: getAnswerQuestionSurvey,
  insertStudentAnswer: insertStudentAnswer,
  test: test,
};
