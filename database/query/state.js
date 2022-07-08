const all = 'select * from states';

const view = `select s.state_id, s.name, s.created_at, s.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = s.created_by) as created_by, 
(select concat(first_name,' ',last_name) from users where user_id = s.updated_by) as updated_by 
from states s where s.state_id = ?`;

const create = 'insert into states (name,created_by) values(?, ?)';

const edit = 'update states set name = ?, updated_by = ? where state_id = ?';

const remove = 'delete from states where state_id = ?';

const isNameExist = 'select count(*) as counts from states where lower(name) = lower(?)';

const isNameExistUpdate = 'select count(*) as counts from states where state_id != ? and lower(name) = lower(?)';

const options = 'select * from states where state_id != ? order by name asc';

const getById = 'select * from states where state_id = ?';

module.exports = {
    all,
    view,
    create,
    edit,
    remove,
    isNameExist,
    isNameExistUpdate,
    options,
    getById
};