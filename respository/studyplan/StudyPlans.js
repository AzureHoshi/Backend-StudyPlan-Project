var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('./CrudModel.js');

var table = 'study_plans';

async function getAllStudyPlans() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN student_cur_group ON curriculums.student_cur_group_id = student_cur_group.student_cur_group_id
        WHERE ${table}.is_deleted IS NULL`;

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
          message: 'Do not have any Curriculum!',
        });
      }
    });
  });
}
async function getStudyPlanById(study_plan_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN student_cur_group ON curriculums.student_cur_group_id = student_cur_group.student_cur_group_id
        WHERE ${table}.study_plan_id = ${study_plan_id} AND ${table}.is_deleted IS NULL`;

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
          message: 'StudyPlan by Id ' + study_plan_id + '',
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Curriculum not found',
        });
      }
    });
  });
}

async function addNewStudyPlan(
  curriculum_id,
  study_plan_name,
  study_plan_version,
  total_credit
) {
  var pool = mysql.createPool(config);
  var post = {
    curriculum_id: curriculum_id,
    study_plan_name: study_plan_name,
    study_plan_version: study_plan_version,
    total_credit: total_credit,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO ${table} (curriculum_id, study_plan_name, study_plan_version, total_credit) 
    VALUES ('${curriculum_id}', '${study_plan_name}', '${study_plan_version}', '${total_credit}')`;

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Create Curriculum Successfuly:',
        id: results1.insertId,
      });
    });
  });
}

async function editStudyPlan(
  study_plan_id,
  curriculum_id,
  study_plan_name,
  study_plan_version,
  total_credit
) {
  var pool = mysql.createPool(config);
  var post = {
    study_plan_id: study_plan_id,
    curriculum_id: curriculum_id,
    study_plan_name: study_plan_name,
    study_plan_version: study_plan_version,
    total_credit: total_credit,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = `UPDATE ${table} 
    SET study_plan_id='${study_plan_id}',
    curriculum_id='${curriculum_id}',
    study_plan_name='${study_plan_name}',
    study_plan_version='${study_plan_version}',
    total_credit='${total_credit}'
    WHERE study_plan_id=${study_plan_id}`;

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Edit StudyPlan ById :${study_plan_id}`,
        data: results1,
      });
    });
  });
}

async function deleteStudyPlan(study_plan_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = `UPDATE ${table} SET is_deleted = '1' WHERE study_plan_id = '${study_plan_id}'`;

    console.log(Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `StudyPlan id = ${study_plan_id} is deleted!`,
        data: results1,
      });
    });
  });
}

module.exports.StudyPlansRepo = {
  getAllStudyPlans: getAllStudyPlans,
  getStudyPlanById: getStudyPlanById,
  addNewStudyPlan: addNewStudyPlan,
  editStudyPlan: editStudyPlan,
  deleteStudyPlan: deleteStudyPlan,
};
