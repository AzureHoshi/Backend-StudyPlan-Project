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
        WHERE sub_study.study_plan_id = ${study_plan_id} AND ${table}.is_deleted = 0 OR ${table}.is_deleted = 0`;

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
        WHERE sub_study_year = ${sub_study_year} AND sub_study_semester = ${sub_study_semester} AND ${table}.is_deleted = 0 
        OR sub_study_year = ${sub_study_year} AND sub_study_semester = ${sub_study_semester} AND ${table}.is_deleted = 0`;

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

async function addSubStudy(study_plan_id, subject_id, sub_study_semester, sub_study_year) {
  var pool = mysql.createPool(config);
  var post = {
    study_plan_id: study_plan_id,
    subject_id: subject_id,
    sub_study_semester: sub_study_semester,
    sub_study_year: sub_study_year,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO ${table} (study_plan_id, subject_id, sub_study_semester, sub_study_year) 
    VALUES ('${study_plan_id}', '${subject_id}', '${sub_study_semester}', '${sub_study_year}')`;

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Create SubStudy Successfuly:',
        id: results1.insertId,
      });
    });
  });
}

async function deleteSubStudy(sub_study_id) {
  var pool = mysql.createPool(config);

  var Query;
  return new Promise((resolve, reject) => {
    Query = `UPDATE ${table} SET is_deleted='1' WHERE sub_study_id = '${sub_study_id}'`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `SubStudy id = ${sub_study_id} is deleted!`,
        data: results1,
      });
    });
  });
}

module.exports.SubStudyRepo = {
  getSubStudyById: getSubStudyById,
  getSubStudyBySemesterYear: getSubStudyBySemesterYear,
  addSubStudy: addSubStudy,
  deleteSubStudy: deleteSubStudy,
};
