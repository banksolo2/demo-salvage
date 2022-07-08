const all = 'select * from salvage_status';

const create = 'insert into salvage_status (name,code,created_by) values(?, ?, ?)';

const checkNameExist = 'select count(*) as counts from salvage_status where lower(name) = lower(?)';

const update = 'update salvage_status set name = ?, code = ?, updated_by = ? where salvage_status_id = ?';

const checkNameExistUpdate = 'select count(*) as counts from salvage_status where salvage_status_id != ? and lower(name) = lower(?)';

const remove = 'delete from salvage_status where salvage_status_id = ?';

const view = `select s.salvage_status_id, s.name, s.code, 
(select concat(first_name,' ',last_name) from users where user_id = s.created_by) as created_by, s.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = s.updated_by) as updated_by, s.updated_at 
from salvage_status s where s.salvage_status_id = ?`;

const option = 'select * from salvage_status where salvage_status_id != ?';

const getById = 'select * from salvage_status where salvage_status_id = ?';

const getByCode = 'select * from salvage_status where lower(code) = lower(?)';




module.exports = {
    all,
    create,
    checkNameExist,
    update,
    checkNameExistUpdate,
    remove,
    view,
    option,
    getById,
    getByCode
};