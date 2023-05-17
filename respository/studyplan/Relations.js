var mysql = require('mysql');
//const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid')
const uuid = uuidv4()

const env = require('../../env.js');
const config = require('../../dbconfig.js')[env];
const crud = require('../studyplan/CrudModel.js')

const recursive = `with recursive _tree as ( select subject_id,parent_id, 1 as level from subject_tree where parent_id is null   
                    union all select t.subject_id ,t.parent_id,level+1 from subject_tree t inner join _tree a on a.subject_id = t.parent_id)`

//                     
async function getAllRelations(curriculum_id, distinct) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {
        if (distinct) {
            Query = recursive + ` select * from _tree t 
                            inner join subjects s on t.subject_id = s.subject_id where curriculum_id = ${curriculum_id} group by t.subject_id order by t.level asc`
        } else {
            Query = recursive + ` select * from _tree t 
                            inner join subjects s on t.subject_id = s.subject_id where curriculum_id = ${curriculum_id} order by t.level asc`
        }
        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }

            if (results1.length > 0) {
                pool.end();
                return resolve({
                    statusCode: 200,
                    returnCode: 1,
                    curriculum_id: `${curriculum_id}`,
                    data: results1,
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 404,
                    returnCode: 11,
                    message: 'Do not have any Relations!',
                });
            }

        });

    });
}
async function getAllLevel(curriculum_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = recursive + ` select t.level from _tree t inner join subjects s on t.subject_id = s.subject_id where curriculum_id = ${curriculum_id} group by t.level order by t.level asc`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
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
                    message: 'Do not have any Level!',
                });
            }

        });

    });
}
async function getChileByParentId(parent_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = recursive + ` select  s.subject_code,s.subject_name_th,s.subject_name_en,s.credit_qty,t.subject_id ,t.parent_id , t.level from _tree t 
                                inner join subjects s on t.subject_id = s.subject_id where t.parent_id = ${parent_id} order by t.level asc`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
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
                    message: `Do not have any Chile of parent id = ${parent_id}`,
                });
            }

        });

    });
}
async function getParentByChileId(chile_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = recursive + ` select t.subject_id as chile_id,s.subject_code,s.subject_name_th,s.subject_name_en,s.credit_qty,t.parent_id , t.level from _tree t 
                                inner join subjects s on t.parent_id = s.subject_id where t.subject_id = ${chile_id} order by t.subject_id asc`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
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
                });
            }

        });

    });
}
async function getSubjectByLevel(level) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = recursive + ` select t.subject_id ,s.subject_code,s.subject_name_th,s.subject_name_en,s.credit_qty,t.parent_id , t.level from _tree t 
                            inner join subjects s on t.subject_id = s.subject_id where t.level = ${level} order by t.level asc`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
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
                    message: `Do not have any Subject at Level = ${level}`,
                });
            }

        });

    });
}
async function addRoot(subject_id) {
    var Query;
    var pool = mysql.createPool(config);
    var post = {
        subject_id: subject_id,
    }
    return new Promise((resolve, reject) => {

        Query = crud.Create('subject_tree');

        console.log('Query1 is: ', Query);

        pool.query(Query, post, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }
            pool.end();
            return resolve({
                statusCode: 200,
                returnCode: 1,
                message: `Add root id = ${subject_id} Successfuly:`,
                id: results1.insertId,
            })


        });

    });
}
async function addChileByParentId(subject_id, parent_id) {
    var Query;
    var pool = mysql.createPool(config);
    var post = {
        subject_id: subject_id,
        parent_id: parent_id,
    }
    return new Promise((resolve, reject) => {
        // check query
        Query = recursive + ` select * from _tree t 
                            where t.subject_id = ${subject_id} and parent_id = ${parent_id} group by t.subject_id order by t.level asc`

        console.log('Query check is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            } else if (results1.length > 0) {
                pool.end();
                return resolve({
                    // 302 = have row 
                    statusCode: 302,
                    message: `Chile id = ${subject_id} of Parent id = ${parent_id} already added`,
                })
            }
            // add query
            Query = crud.Create('subject_tree');
            console.log('Query add is: ', Query);
            pool.query(Query, post, function (error2, results2, fields2) {
                if (error2) {
                    return resolve(reject(error2))
                }
                pool.end();
                return resolve({
                    statusCode: 200,
                    message: `Add chile id = ${subject_id} of parent id = ${parent_id} Successfully!`,
                    id: results2.insertId
                })
            });

        });

    });
}
// สำหรับเช็คว่ามีความสัมพันธ์ของ subject_id ที่เลือกลบหรือไม่เพื่อเตือนก่อนลบ
async function relationsCheck(parent_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = ` select * from subject_tree
                where parent_id = ${parent_id}`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }
            if (results1.length > 0) {
                pool.end();
                return resolve({
                    statusCode: 200,
                    returnCode: 1, // have chiles
                    massage: `this parent id = ${parent_id} have chile!`
                });
            } else {
                pool.end();
                return resolve({
                    statusCode: 404,
                    returnCode: 2, // not have any chile
                    massage: `this parent id = ${parent_id} not have any chile.`
                });
            }

        });

    });
}
// สำหรับลบมากกว่า 1 level สั่งลบ node ที่ไม่มีพ่อทั้งหมด
async function deepDelete() {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = `delete t1 from subject_tree as t1 
                inner join subject_tree as t2
                where t1.parent_id != t2.subject_id`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }
            pool.end();
            return resolve({
                statusCode: 200,
                returnCode: 1,
                message: `Delete Succuessfully`,
            })

        });

    });
}
async function deleteParent(parent_id) {
    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = `delete from subject_tree where parent_id = ${parent_id} or subject_id = ${parent_id}`;

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }
            pool.end();
            return resolve({
                statusCode: 200,
                returnCode: 1,
                message: `Delete parent id = ${parent_id} and all chile Succuessfully`,
            })


        });

    });
}
async function deleteChileByParent(subject_id, parent_id) {
    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        Query = `delete from subject_tree where subject_id = ${subject_id} and parent_id = ${parent_id}`;

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
            }
            pool.end();
            return resolve({
                statusCode: 200,
                returnCode: 1,
                message: `Delete chile id = ${subject_id} Succuessfully`,
            })


        });

    });
}
async function getSubjectList(curriculum_id) {

    var Query;
    var pool = mysql.createPool(config);

    return new Promise((resolve, reject) => {

        // Query = ` select * from subjects
        //         where curriculum_id = ${curriculum_id} and  not exists (
        //         select 1 from subject_tree WHERE subject_tree.subject_id = subjects.subject_id ) order by subjects.subject_id`
        Query = ` select * from subjects
                where curriculum_id = ${curriculum_id} order by subjects.subject_id`

        console.log('Query1 is: ', Query);

        pool.query(Query, function (error, results1, fields) {
            if (error) {
                return resolve(reject(error))
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
                    message: 'Do not have any subjects',
                });
            }

        });

    });
}
module.exports.RelationRepo = {
    getAllRelations: getAllRelations,
    getAllLevel: getAllLevel,
    getChileByParentId: getChileByParentId,
    getParentByChileId: getParentByChileId,
    getSubjectByLevel: getSubjectByLevel,
    addRoot: addRoot,
    addChileByParentId: addChileByParentId,
    deleteParent: deleteParent,
    deleteChileByParent: deleteChileByParent,
    getSubjectList: getSubjectList,
    relationsCheck: relationsCheck,
    deepDelete: deepDelete,
};
