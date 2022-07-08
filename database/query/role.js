const view = `select r.role_id, r.name, r.code, r.created_at,
(select concat(first_name,' ',last_name ) from users where user_id = r.created_by) as created_by,
r.updated_at, (select concat(first_name,' ',last_name ) from users where user_id = r.updated_by) as updated_by 
from roles r where r.role_id = ?`;

const all = 'select * from roles';

const create = 'insert into roles (name, code, created_by) values(?, ?, ?)';

const remove = "delete from roles where role_id = ?";

const update = "update roles set name = ?, code = ?, updated_by = ? where role_id = ? ";
 
const getById = 'select * from roles where role_id = ?';

const getBycode = 'select * from roles where lower(code) = lower(?)';

const checkNameExist = 'select count(*) as counts from roles where lower(name) = lower(?)';

const checkNameExistOnUpdate = 'select count(*) as counts from roles where role_id != ? and lower(name) = lower(?)';

const options = 'select * from roles where role_id != ? order by name desc ';



module.exports = {
    view,
    all,
    create,
    remove,
    update,
    getById,
    getBycode,
    checkNameExist,
    checkNameExistOnUpdate,
    options
}