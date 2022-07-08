const all = 'select * from brands';

const view = `select b.brand_id, b.name, b.created_at, b.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.created_by) as created_by, 
(select concat(first_name,' ',last_name) from users where user_id = b.updated_by) as updated_by 
from brands b where b.brand_id = ? `;

const create = 'insert into brands (name, created_by) values(?, ?)';

const update = 'update brands set name = ?, updated_by = ? where brand_id = ?';

const remove = 'delete from brands where brand_id = ?';

const getById = 'select * from brands where brand_id = ?';

const options = 'select * from brands where brand_id != ?';

const isNameExist = 'select count(*) as counts from brands where lower(name) = lower(?)';

const isNameExistOnUpdate = 'select count(*) as counts from brands where brand_id != ? and lower(name) = lower(?)';


module.exports = {
    all,
    view,
    create,
    update,
    remove,
    getById,
    options,
    isNameExist,
    isNameExistOnUpdate
}