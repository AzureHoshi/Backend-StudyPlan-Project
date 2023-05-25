var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('../studyplan/CrudModel.js');

var table = 'subjects';

async function getSubjects(curriculum_id, subject_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (subject_id == '') {
      Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        WHERE subjects.curriculum_id = ${curriculum_id} AND ${table}.is_deleted = 0 ORDER BY ${table}.subject_code DESC`;
    } else {
      Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        WHERE subjects.subject_id = ${subject_id} AND ${table}.is_deleted = 0`;
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
          message: 'Do not have any Subject!',
        });
      }
    });
  });
}
async function getSubjectsGroupType(curriculum_id, group_type_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        WHERE subjects.group_type_id = ${group_type_id} AND subjects.curriculum_id = ${curriculum_id} AND ${table}.is_deleted = 0`;

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
          massage: `subject by group_type_id = ${group_type_id}`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Subject!',
        });
      }
    });
  });
}
async function getSubjectsSubjectType(curriculum_id, subject_type_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        INNER JOIN subject_type ON group_type.subject_type_id = subject_type.subject_type_id 
        WHERE group_type.subject_type_id = ${subject_type_id} AND subjects.curriculum_id = ${curriculum_id} AND ${table}.is_deleted = 0`;

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
          massage: `subject by subject_type_id = ${subject_type_id}`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Subject!',
        });
      }
    });
  });
}
async function getSubjectsCategory(curriculum_id, subject_category_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        INNER JOIN subject_type ON group_type.subject_type_id = subject_type.subject_type_id 
        INNER JOIN subject_category ON subject_type.subject_category_id = subject_category.subject_category_id
        WHERE subject_type.subject_category_id = ${subject_category_id} AND subjects.curriculum_id = ${curriculum_id} AND ${table}.is_deleted = 0`;

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
          massage: `subject by subject_category_id = ${subject_category_id}`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Subject!',
        });
      }
    });
  });
}
async function addNewSubject(
  curriculum_id,
  group_type_id,
  subject_code,
  subject_name_th,
  subject_name_en,
  credit_qty,
  subject_description
) {
  var pool = mysql.createPool(config);
  var post = {
    curriculum_id: curriculum_id,
    group_type_id: group_type_id,
    subject_code: subject_code,
    subject_name_th: subject_name_th,
    subject_name_en: subject_name_en,
    credit_qty: credit_qty,
    subject_description: subject_description,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create(table);
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Add Subject ${subject_name_en} in Curriculum id = ${curriculum_id} Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}
async function editSubject(
  subject_id,
  group_type_id,
  subject_code,
  subject_name_th,
  subject_name_en,
  credit_qty,
  subject_description
) {
  var pool = mysql.createPool(config);
  var post = {
    subject_id: subject_id,
    group_type_id: group_type_id,
    subject_code: subject_code,
    subject_name_th: subject_name_th,
    subject_name_en: subject_name_en,
    credit_qty: credit_qty,
    subject_description: subject_description,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById(table, 'subject_id', subject_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Edit Subject id = ${subject_id} :`,
        data: results1,
      });
    });
  });
}
async function deleteSubject(subject_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete(table, 'subject_id', subject_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Subject id = ${subject_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function searchSubject(text, column, curriculum_id) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM ${table} 
        INNER JOIN curriculums ON ${table}.curriculum_id = curriculums.curriculum_id
        INNER JOIN group_type ON ${table}.group_type_id = group_type.group_type_id
        WHERE ${table}.is_deleted = 0 AND ${column} LIKE '%${text}%' AND curriculums.curriculum_id = ${curriculum_id} ORDER BY ${table}.subject_code DESC`;

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
async function getCategories(category_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (category_id !== '') {
      Query = `SELECT * FROM subject_category WHERE subject_category_id = ${category_id} AND is_deleted = 0 ORDER BY subject_category_id DESC`;
    } else {
      Query = `SELECT * FROM subject_category WHERE is_deleted = 0 ORDER BY subject_category_id DESC`;
    }
    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) throw error;

      if (results1.length > 1) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `all category :`,
          data: results1,
        });
      } else if (results1.length > 0) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `category by id ${category_id} :`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any categories',
        });
      }
    });
  });
}
async function addNewCategory(subject_category_name) {
  var pool = mysql.createPool(config);
  var post = {
    subject_category_name: subject_category_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create('subject_category');
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Create Category Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}
async function editCategory(subject_category_id, subject_category_name) {
  var pool = mysql.createPool(config);
  var post = {
    subject_category_name: subject_category_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById(
      'subject_category',
      'subject_category_id',
      subject_category_id
    );

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Edit Category id = ${subject_category_id} :`,
        data: results1,
      });
    });
  });
}
async function deleteCategory(subject_category_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete(
      'subject_category',
      'subject_category_id',
      subject_category_id
    );

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Category id = ${subject_category_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function searchCategories(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM subject_category 
        WHERE subject_category.is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY subject_category_id DESC`;

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
async function getSubjectTypes(subject_type_id, subject_category_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (subject_type_id !== '' && subject_category_id === '') {
      Query = `SELECT * FROM subject_type 
             INNER JOIN subject_category ON subject_type.subject_category_id = subject_category.subject_category_id
            WHERE subject_type_id = ${subject_type_id} AND subject_type.is_deleted = 0 ORDER BY subject_type_id DESC`;
    } else if (subject_category_id !== '') {
      Query = `SELECT * FROM subject_type 
             INNER JOIN subject_category ON subject_type.subject_category_id = subject_category.subject_category_id
            WHERE subject_type.subject_category_id = ${subject_category_id} AND subject_type.is_deleted = 0 ORDER BY subject_type_id DESC`;
    } else {
      Query = `SELECT * FROM subject_type 
            INNER JOIN subject_category ON subject_type.subject_category_id = subject_category.subject_category_id
            WHERE subject_type.is_deleted = 0 ORDER BY subject_type_id DESC`;
    }
    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) throw error;

      if (results1.length > 1 && !subject_category_id && !subject_type_id) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `all subject type :`,
          data: results1,
        });
      } else if (
        results1.length > 0 &&
        subject_type_id &&
        !subject_category_id
      ) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `subject type by id ${subject_type_id} :`,
          data: results1,
        });
      } else if (
        subject_category_id !== '' &&
        subject_category_id &&
        !subject_type_id
      ) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `subject type by category id ${subject_category_id} :`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any subject types',
        });
      }
    });
  });
}
async function addNewSubjectType(subject_category_id, subject_type_name) {
  var pool = mysql.createPool(config);
  var post = {
    subject_category_id: subject_category_id,
    subject_type_name: subject_type_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create('subject_type');
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Create Subject Type Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}
async function editSubjectType(subject_type_id, subject_type_name) {
  var pool = mysql.createPool(config);
  var post = {
    subject_type_name: subject_type_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById('subject_type', 'subject_type_id', subject_type_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Edit Subject Type id = ${subject_type_id} :`,
        data: results1,
      });
    });
  });
}
async function deleteSubjectType(subject_type_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete('subject_type', 'subject_type_id', subject_type_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Subject type id = ${subject_type_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function searchSubjectType(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM subject_type
        INNER JOIN subject_category ON subject_type.subject_category_id = subject_category.subject_category_id
        WHERE subject_type.is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY subject_type.subject_type_id DESC`;

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
// สำหรับใช้กับ Filter ให้หน้า Subjects
async function getGroupType(curriculum_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    Query = `SELECT group_type.group_type_name,group_type.group_type_id FROM group_type
        INNER JOIN (SELECT DISTINCT group_type_id FROM subjects WHERE subjects.curriculum_id = ${curriculum_id}) a
        ON a.group_type_id = group_type.group_type_id WHERE group_type.is_deleted = 0 ORDER BY a.group_type_id DESC`;

    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) throw error;

      if (results1.length > 0) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `group_type by curriculum_id = ${curriculum_id}`,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Subject!',
        });
      }
    });
  });
}
// สำหรับแก้ไขข้อมูล Group Type
async function getGroupType2(group_type_id, subject_type_id) {
  var Query;
  var pool = mysql.createPool(config);

  return new Promise((resolve, reject) => {
    if (group_type_id !== '' && subject_type_id === '') {
      Query = `SELECT * FROM group_type
             INNER JOIN subject_type ON subject_type.subject_type_id = group_type.subject_type_id
            WHERE group_type_id = ${group_type_id} AND group_type.is_deleted = 0 ORDER BY group_type_id DESC`;
    } else if (subject_type_id !== '' && group_type_id === '') {
      Query = `SELECT * FROM group_type
            INNER JOIN subject_type ON subject_type.subject_type_id = group_type.subject_type_id
            WHERE group_type.subject_type_id = ${subject_type_id} AND group_type.is_deleted = 0 ORDER BY group_type_id DESC`;
    } else {
      Query = `SELECT * FROM group_type 
            INNER JOIN subject_type ON subject_type.subject_type_id = group_type.subject_type_id
            WHERE group_type.is_deleted = 0 ORDER BY group_type_id DESC`;
    }
    console.log('Query1 is: ', Query);

    pool.query(Query, function (error, results1, fields) {
      if (error) throw error;

      if (
        results1.length > 0 &&
        group_type_id !== '' &&
        subject_type_id === ''
      ) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `group_type by id = ${group_type_id}`,
          data: results1,
        });
      } else if (
        results1.length > 0 &&
        subject_type_id !== '' &&
        group_type_id === ''
      ) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `group_type by subject_type id = ${subject_type_id}`,
          data: results1,
        });
      } else if (
        (results1.length > 0 &&
          subject_type_id === '' &&
          group_type_id === '') ||
        (results1.length > 0 && subject_type_id !== '' && group_type_id !== '')
      ) {
        pool.end();
        return resolve({
          statusCode: 200,
          returnCode: 1,
          massage: `all group_type `,
          data: results1,
        });
      } else {
        pool.end();
        return resolve({
          statusCode: 404,
          returnCode: 11,
          message: 'Do not have any Group Type!',
        });
      }
    });
  });
}
async function addNewGroupType(subject_type_id, group_type_name) {
  var pool = mysql.createPool(config);
  var post = {
    subject_type_id: subject_type_id,
    group_type_name: group_type_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Create('group_type');
    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Create Group Type Successfuly:`,
        id: results1.insertId,
      });
    });
  });
}
async function editGroupType(group_type_id, group_type_name) {
  var pool = mysql.createPool(config);
  var post = {
    group_type_name: group_type_name,
  };
  console.log('post is: ', post);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.UpdateById('group_type', 'group_type_id', group_type_id);

    pool.query(Query, post, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Edit Group Type id = ${group_type_id} :`,
        data: results1,
      });
    });
  });
}
async function deleteGroupType(group_type_id) {
  var pool = mysql.createPool(config);

  var Query;

  return new Promise((resolve, reject) => {
    Query = crud.Delete('group_type', 'group_type_id', group_type_id);

    pool.query(Query, function (error, results1, fields) {
      if (error) {
        return resolve(reject(error));
      }
      pool.end();
      return resolve({
        statusCode: 200,
        returnCode: 1,
        message: `Group Type id = ${group_type_id} is deleted!`,
        data: results1,
      });
    });
  });
}
async function searchGroupType(text, column) {
  var pool = mysql.createPool(config);

  var Query = `SELECT * FROM group_type
        INNER JOIN subject_type ON subject_type.subject_type_id = group_type.subject_type_id
        WHERE group_type.is_deleted = 0 AND ${column} LIKE '%${text}%' ORDER BY group_type.group_type_id DESC`;

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

module.exports.SubjectRepo = {
  getSubjects: getSubjects,
  addNewSubject: addNewSubject,
  editSubject: editSubject,
  deleteSubject: deleteSubject,
  searchSubject: searchSubject,
  getSubjectsGroupType: getSubjectsGroupType,
  getSubjectsSubjectType: getSubjectsSubjectType,
  getSubjectsCategory: getSubjectsCategory,
  getGroupType: getGroupType,
  getCategories: getCategories,
  addNewCategory: addNewCategory,
  editCategory: editCategory,
  deleteCategory: deleteCategory,
  getSubjectTypes: getSubjectTypes,
  addNewSubjectType: addNewSubjectType,
  editSubjectType: editSubjectType,
  deleteSubjectType: deleteSubjectType,
  getGroupType2: getGroupType2,
  addNewGroupType: addNewGroupType,
  editGroupType: editGroupType,
  deleteGroupType: deleteGroupType,
  searchCategories: searchCategories,
  searchSubjectType: searchSubjectType,
  searchGroupType: searchGroupType,
};
