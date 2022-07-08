const insert = `insert into bid_status (name,code,created_by) values(?, ?, ?)`;

const update = 'update bid_status set name = ?, code = ?, updated_by = ? where bid_status_id = ?';

const remove = 'delete from bid_status where bid_status_id = ?';

const getById = `select * from bid_status where bid_status_id = ?`;

const getByCode = `select * from bid_status where lower(code) = lower(?)`;

const isNameExist = `select count(*) as counts from bid_status where lower(name) = lower(?)`;

const isNameExistUpdate = `select count(*) as counts from bid_status where bid_status_id != ? and lower(name) = lower(?)`;

const all = `select * from bid_status`;

const view = `select b.bid_status_id, b.name, b.code, b.created_at, b.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.created_by) as created_by, 
(select concat(first_name,' ',last_name) from users where user_id = b.updated_by) as updated_by 
from bid_status b where b.bid_status_id = ?`;


module.exports = {
    insert,
    update,
    remove,
    getById,
    getByCode,
    isNameExist,
    isNameExistUpdate,
    all,
    view
};