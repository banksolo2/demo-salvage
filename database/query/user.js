const login = `select count(*) from users where email = ? and password = ? and status = 'active'`;

const create = `insert into users (first_name, last_name, email, status, password, phone, created_by) values(?, ?, ?, ?, ?, ?, ?)`;

const update = `update users set first_name = ?, last_name = ?, email = ?, status = ?, phone = ?, updated_by = ? where user_id = ?`;

const updatePassword = 'update users set password = ?, updated_by = ?  where user_id = ?';

const checkEmailOnCreate = 'select count(*) as counts from users where lower(email) = lower(?)';

const checkEmailOnUpdate = 'select count(*) as counts  from users where user_id != ? and lower(email) = lower(?)';

const getUser = `select * from users where user_id = ?`;

const deleteUser = `update users set status = 'removed', deleted_by = ?, deleted_at = ?, updated_by = ? where user_id = ?` ;

const allUser = `select * from users where status != 'removed'`;

const usersOptions = `select * from users where user_id != ? and status = 'active' `

const getByEmail = 'select * from users where lower(email) = lower(?)';

const getById = 'select * from users where user_id = ?';

const veiwUser = `select u.first_name, u.last_name, u.email, u.status, u.phone, 
(select concat(first_name,' ',last_name) from users where user_id = u.created_by) as created_by,
created_at, (select concat(first_name,' ',last_name) from users where user_id = u.updated_by) as updated_by, updated_at 
from users u where u.user_id = ?`;

const changePassword = 'update users set password = ? where user_id = ?';

const updateProfile = 'update users set first_name = ?, last_name = ?, email = ?, phone = ?, updated_by = ?  where user_id = ?';

const updateProfileWithPhoto = 'update users set first_name = ?, last_name = ?, email = ?, phone = ?, photo= ?, updated_by = ?  where user_id = ?';



module.exports = {
    login,
    create,
    update,
    updatePassword,
    checkEmailOnCreate,
    checkEmailOnUpdate,
    deleteUser,
    allUser,
    usersOptions,
    getUser,
    getByEmail,
    getById,
    veiwUser,
    changePassword,
    updateProfile,
    updateProfileWithPhoto
};