var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'sub_study';

// รับค่า semester และ year มาใช้ค้นหา
async function getSubStudyById(study_plan_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN study_plans ON ${table}.study_plan_id = study_plans.study_plan_id
        INNER JOIN subjects ON ${table}.subject_id = subjects.subject_id 
        WHERE sub_study.study_plan_id = ${study_plan_id} AND ${table}.is_deleted IS NULL OR ${table}.is_deleted = 0`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
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

// รับค่า semester และ year มาใช้ค้นหา
async function getSubStudyBySemesterYear(sub_study_semester, sub_study_year) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN study_plans ON ${table}.study_plan_id = study_plans.study_plan_id
        INNER JOIN subjects ON ${table}.subject_id = subjects.subject_id 
        WHERE sub_study_year = ${sub_study_year} AND sub_study_semester = ${sub_study_semester} AND ${table}.is_deleted IS NULL 
        OR sub_study_year = ${sub_study_year} AND sub_study_semester = ${sub_study_semester} AND ${table}.is_deleted = 0
        ORDER BY sub_study_id  DESC`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
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

module.exports.SubStudyRepo = {
  getSubStudyById: getSubStudyById,
  getSubStudyBySemesterYear: getSubStudyBySemesterYear,
};
