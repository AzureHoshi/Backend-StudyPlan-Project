var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'students';

async function getFeedback(values) {
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

async function getStatusFeedback(stu_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT stu_status_feedback FROM ${table} WHERE stu_id = ${stu_id};`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1.stu_status_feedback !== 1) {
        return resolve({
          statusCode: 200,
          returnCode: 1,
          message: `Get Student StatusFeedback successfully`,
          statusFeedback: '1',
        });
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Get Student StatusFeedback successfully`,
        statusFeedback: '0',
      });
    });
  });
}

async function updatedStatusFeedback(stu_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `UPDATE ${table} SET stu_status_feedback = 1 WHERE stu_id = ${stu_id}`;

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

module.exports.StudentRepo = {
  getFeedback: getFeedback,
  getStatusFeedback: getStatusFeedback,
  updatedStatusFeedback: updatedStatusFeedback,
};
