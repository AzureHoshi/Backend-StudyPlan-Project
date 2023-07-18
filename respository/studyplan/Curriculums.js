var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('../studyplan/CrudModel.js');

var table = 'curriculums';
var join_faculty_table = 'faculty';
var join_cur_group_table = 'student_cur_group';
var column_id = 'curriculum_id';

async function getAllCurriculm() {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN ${join_faculty_table} ON ${table}.faculty_id = ${join_faculty_table}.faculty_id
        INNER JOIN ${join_cur_group_table} ON ${table}.student_cur_group_id = ${join_cur_group_table}.student_cur_group_id
        WHERE ${table}.is_deleted = 0 ORDER BY ${table}.curriculum_year DESC`;

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

async function getCurriculmById(curriculumId) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = crud.SelectById(table, column_id, curriculumId);

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
          message: 'Curriculum by Id ' + curriculumId + '',
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
async function addNewCurriculum(
  student_cur_group_id,
  faculty_id,
  curriculum_name_th,
  curriculum_name_en,
  curriculum_year,
  ref_curriculum_id
) {
  var pool = mysql.createPool(config);
  var post = {
    student_cur_group_id: student_cur_group_id,
    faculty_id: faculty_id,
    curriculum_name_th: curriculum_name_th,
    curriculum_name_en: curriculum_name_en,
    curriculum_year: curriculum_year,
  };
  console.log('post is: ', post);

  var Query;
  var duplicateStatus;

  return new Promise((resolve, reject) => {
    Query = crud.Create(table);
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      console.log('results1', results1);
      if (ref_curriculum_id.length > 0) {
        Query1 = DuplicateSubjectsByCurriculum(ref_curriculum_id, results1.insertId);
        pool.query(Query1, function (err, results) {
          if (err) {
            console.log('ere');
            duplicateStatus = 'dup fal';
            return duplicateStatus;
          }
          console.log('sus');
          duplicateStatus = 'dup ins';
          return duplicateStatus;
        });
      }
      console.log('test: ', duplicateStatus);
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Create Curriculum Successfuly:',
        id: results1.insertId,
        duplicateStatus: `${duplicateStatus}`,
      });
    });
  });
}
async function editCurriculum(
  curriculum_id,
  student_cur_group_id,
  faculty_id,
  curriculum_name_th,
  curriculum_name_en,
  curriculum_year
) {
  var pool = mysql.createPool(config);
  var post = {
    student_cur_group_id: student_cur_group_id,
    faculty_id: faculty_id,
    curriculum_name_th: curriculum_name_th,
    curriculum_name_en: curriculum_name_en,
    curriculum_year: curriculum_year,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById(table, column_id, curriculum_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Edit Curriculum :',
        data: results1,
      });
    });
  });
}
async function deleteCurriculum(curriculum_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete(table, column_id, curriculum_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Curriculum id = ${curriculum_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function searchCurriculums(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM ${table} 
        INNER JOIN ${join_faculty_table} ON ${table}.faculty_id = ${join_faculty_table}.faculty_id
        INNER JOIN ${join_cur_group_table} ON ${table}.student_cur_group_id = ${join_cur_group_table}.student_cur_group_id
        WHERE ${table}.is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY ${table}.curriculum_year DESC`;

  console.log(`Query is: `, Query);

  return new Promise((resolve, reject) => {
    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1.length === 0) {
        pool.end();
        return resolve({ data: [] });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          message: `Found rows match!`,
          data: results1,
        });
      }
    });
  });
}

// ? test
async function getCurriculmByFaculty(id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM curriculums 
    INNER JOIN faculty ON curriculums .faculty_id = faculty.faculty_id
    WHERE curriculums .faculty_id = ${id} && curriculums .is_deleted = 0 ORDER BY curriculums .curriculum_year DESC`;

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

// ? /api/v1/duplicateSubjectsCurriculum
async function DuplicateSubjectsByCurriculum(curriculum_id, newcurriculumn_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `INSERT INTO subjects (curriculum_id, group_type_id, subject_code, subject_name_th, subject_name_en, credit_qty, subject_description, is_deleted, created_datetime)
  SELECT ${newcurriculumn_id}, group_type_id, subject_code, subject_name_th, subject_name_en, credit_qty, subject_description, is_deleted, created_datetime
  FROM subjects
  WHERE curriculum_id = ${curriculum_id}`;

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
          message: 'Do not Something',
        });
      }
    });
  });
}

async function getAllFaculty(faculty_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (faculty_id != '') {
      Query = crud.SelectById('faculty', 'faculty_id', faculty_id);
    } else {
      Query = crud.SelectAll('faculty');
    }
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
          message: 'Do not have any Faculty!',
        });
      }
    });
  });
}
async function addNewFaculty(faculty_name_th, faculty_name_en) {
  var pool = mysql.createPool(config);
  var post = {
    faculty_name_th: faculty_name_th,
    faculty_name_en: faculty_name_en,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create('faculty');
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Create Faculty Successfuly:',
        id: results1.insertId,
      });
    });
  });
}

async function searchFaculty(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM faculty
        WHERE is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY faculty_id DESC`;

  console.log(`Query is: `, Query);

  return new Promise((resolve, reject) => {
    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1.length === 0) {
        pool.end();
        return resolve({ data: [] });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          message: `Found rows match!`,
          data: results1,
        });
      }
    });
  });
}
async function editFaculty(faculty_id, faculty_name_th, faculty_name_en) {
  var pool = mysql.createPool(config);
  var post = {
    faculty_id: faculty_id,
    faculty_name_th: faculty_name_th,
    faculty_name_en: faculty_name_en,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById('faculty', 'faculty_id', faculty_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Edit Faculty :',
        data: results1,
      });
    });
  });
}
async function deleteFaculty(faculty_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete('faculty', 'faculty_id', faculty_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Faculty id = ${faculty_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function getAllCurrentGroups(group_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (group_id != '') {
      Query = crud.SelectById('student_cur_group', 'student_cur_group_id', group_id);
    } else {
      Query = crud.SelectAll('student_cur_group');
    }
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
          message: 'Do not have any Student group!',
        });
      }
    });
  });
}
async function addNewGroup(group_name_th, group_name_en, group_short_name_th, group_short_name_en) {
  var pool = mysql.createPool(config);
  var post = {
    group_name_th: group_name_th,
    group_name_en: group_name_en,
    group_short_name_th: group_short_name_th,
    group_short_name_en: group_short_name_en,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create('student_cur_group');
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Create Group Successfuly:',
        id: results1.insertId,
      });
    });
  });
}
async function searchGroup(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM student_cur_group
        WHERE is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY student_cur_group_id DESC`;

  console.log(`Query is: `, Query);

  return new Promise((resolve, reject) => {
    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      if (results1.length === 0) {
        pool.end();
        return resolve({ data: [] });
      } else {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          message: `Found rows match!`,
          data: results1,
        });
      }
    });
  });
}
async function editGroup(student_cur_group_id, group_name_th, group_name_en, group_short_name_th, group_short_name_en) {
  var pool = mysql.createPool(config);
  var post = {
    student_cur_group_id: student_cur_group_id,
    group_name_th: group_name_th,
    group_name_en: group_name_en,
    group_short_name_th: group_short_name_th,
    group_short_name_en: group_short_name_en,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById('student_cur_group', 'student_cur_group_id', student_cur_group_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: 'Edit Group :',
        data: results1,
      });
    });
  });
}
async function deleteGroup(student_cur_group_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete('student_cur_group', 'student_cur_group_id', student_cur_group_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Group id = ${student_cur_group_id} is deleted!`,
        data: results1,
      });
    });
  });
}

module.exports.CurriculumsRepo = {
  getCurriculmById: getCurriculmById,
  addNewCurriculum: addNewCurriculum,
  editCurriculum: editCurriculum,
  deleteCurriculum: deleteCurriculum,
  getAllCurriculm: getAllCurriculm,
  searchCurriculums: searchCurriculums,
  DuplicateSubjectsByCurriculum: DuplicateSubjectsByCurriculum,
  getAllFaculty: getAllFaculty,
  getAllCurrentGroups: getAllCurrentGroups,
  getCurriculmByFaculty: getCurriculmByFaculty,
  searchFaculty: searchFaculty,
  editFaculty: editFaculty,
  deleteFaculty: deleteFaculty,
  addNewFaculty: addNewFaculty,
  addNewGroup: addNewGroup,
  searchGroup: searchGroup,
  editGroup: editGroup,
  deleteGroup: deleteGroup,
};

// example multi query
// async function setInboundCall(customer_number) {

//     var Query;
//     var pool = mysql.createPool(config);
//     const unique_id = uuidv4();

//     //console.log('unique_id is: ', unique_id);

//     return new Promise((resolve, reject) => {
//         //return resolve('OK');

//         var post = {
//             customer_number: customer_number,
//             api_callout_at: new Date(),
//             uuid: unique_id
//         };
//         console.log('post is: ', post);

//         //return resolve('OK');

//         Query = `SELECT * FROM  inbound_details WHERE inbound_customer_number = '${customer_number}' ORDER BY idinbound_details DESC LIMIT 1;`;
//         console.log('Query1 is: ', Query);

//         pool.query(Query, function (error, results1, fields) {
//             if (error) throw error;
//             console.log('results1 is: ', results1);

//             //return resolve('OK');

//             if (results1.length > 0) {
//                 //pool.end();

//                 pool.query('UPDATE inbound_details set is_call_ext_api = ?, call_ext_api_at = ? WHERE idinbound_details = ?', ['1', new Date(), results1[0].idinbound_details], function (error, results2, fields) {

//                     if (error) {
//                         return resolve(reject(error));
//                     }
//                     pool.end();

//                     // return resolve({
//                     //     statusCode: 200,
//                     //     returnCode: 1,
//                     //     message: 'Agent status has been changed to ['+status_code+']',
//                     // });

//                     return resolve({
//                         statusCode: 200,
//                         returnCode: 1,
//                         uuid: unique_id,
//                         idinbound_details: results1[0].idinbound_details,
//                         inbound_datetime: results1[0].inbound_datetime,
//                         ivr_number: results1[0].ivr_number,
//                         inbound_callref: results1[0].inbound_callref,
//                         inbound_customer_number: results1[0].inbound_customer_number,
//                         message: '3CX received your Inbound call request : ' + customer_number
//                     });

//                 });

//             } else {
//                 pool.end();
//                 return resolve({
//                     statusCode: 404,
//                     returnCode: 11,
//                     message: 'inbound_customer_number not found !!',
//                 });
//             }

//         });

//         /*
//                 pool.query('INSERT INTO outbound_calls SET ?', post, function (error, results3, fields) {

//                     if (error) {
//                         return resolve(reject(error));
//                     }
//                     pool.end();
//                     return resolve({
//                         statusCode: 200,
//                         returnCode: 1,
//                         uuid: unique_id,
//                         message:'3CX received your outbound call request : '+customer_number+ ' called by : '+agent_code
//                     });

//                 });
//         */

//     });

// }
