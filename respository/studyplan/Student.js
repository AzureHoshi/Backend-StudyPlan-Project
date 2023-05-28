var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'student_feedback';

async function getFeedback(values) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO student_feedback (student_id, feedback_id, feedback_answer) VALUES ?`;

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

module.exports.StudentRepo = {
  getFeedback: getFeedback,
};
