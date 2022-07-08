const create = 'insert into buyers (name, phone, email) values(?, ?, ?)';

const all = 'select * from buyers';

const update = 'update buyers set name = ?, phone = ?, email = ? where buyer_id = ?';

const remove = 'delete from buyers where buyer_id = ?';

const getByid = 'select * from buyers where buyer_id = ?';

const getByEmail = 'select * from buyers where lower(email) = lower(?)';

const checkEmailExist = 'select count(*) as counts from buyers where lower(email) = lower(?)';

const checkEmailExistUpdate = 'select count(*) as counts from buyers where buyer_id != ? and lower(email) = lower(?)';

module.exports = {
    create,
    all,
    update,
    remove,
    getByid,
    getByEmail,
    checkEmailExist,
    checkEmailExistUpdate
};