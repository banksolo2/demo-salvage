const create = `insert into users_roles (user_id, role_id, created_by) values(?, ?, ?)`;

const viewByuser = `select u.user_role_id, user_id, role_id,(select concat(first_name,' ',last_name) from users where user_id = u.user_id) as user, (select name from roles where role_id = u.role_id) as role from users_roles u where u.user_id = ?`;

const update = `update users_roles set user_id = ?, role_id = ?, updated_by = ? where user_role_id = ?`;

const remove = `delete from users_roles where user_role_id = ? `;

const checkUserRoleExistCreate = 'select count(*) as counts from users_roles where user_id = ? and role_id = ?';

const getById = 'select * from users_roles where user_role_id = ?';

const checkUserRoleExistUpdate = 'select count(*) as counts from users_roles where user_role_id != ? and user_id = ? and role_id = ?';


module.exports= {
    create,
    viewByuser,
    update,
    remove,
    checkUserRoleExistCreate,
    getById,
    checkUserRoleExistUpdate
};