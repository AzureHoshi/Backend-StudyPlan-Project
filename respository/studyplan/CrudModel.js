const mysql = require('mysql');
const config = require('../../dbconfig.js');

var connection = mysql.createPool({
  host: config.development.host,
  user: config.development.user,
  password: config.development.password,
  database: config.development.database,
});

function SelectAll(table) {
  // var Query = `SELECT * FROM ${table} WHERE is_deleted IS NULL LIMIT ${size} OFFSET ${skip}`
  var Query = `SELECT * FROM ${table} WHERE is_deleted = 0 `;
  return Query;
}
function SelectById(table, column_id, id) {
  var Query = `SELECT * FROM ${table} WHERE ${column_id} = ${id} AND is_deleted = 0 ORDER BY ${table}.curriculum_id DESC`;
  return Query;
}
function Create(table) {
  var Query = `INSERT INTO ${table} SET ?`;
  return Query;
}

//
function DuplicateSubjects(curriculum_id, newcurriculumn_id) {
  let talble = 'subjects';
  var Query = `INSERT INTO ${talble} (curriculum_id,group_type_id,subject_code,subject_name_th,subject_name_en,credit_qty,subject_description) 
  SELECT CASE curriculum_id 
  WHEN ${curriculum_id} 
  THEN ${newcurriculumn_id} 
  ELSE null END curriculum_id,group_type_id,subject_code,subject_name_th,subject_name_en,credit_qty,subject_description FROM subjects WHERE is_deleted = 0 AND curriculum_id = ${curriculum_id}`;
  return Query;
}

function UpdateById(table, column_id, id) {
  var Query = `UPDATE ${table} SET ? WHERE ${column_id} = ${id}`;
  return Query;
}

function Delete(table, column_id, id) {
  var Query = `UPDATE ${table} SET is_deleted = 1 WHERE ${column_id} = ${id}`;
  return Query;
}

module.exports = {
  SelectAll,
  SelectById,
  Create,
  UpdateById,
  Delete,
  DuplicateSubjects,
};
