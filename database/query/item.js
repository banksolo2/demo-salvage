const view = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, i.page, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at 
from items i where i.item_id = ?`;

const all = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at 
from items i 
where salvage_status_id != (select salvage_status_id from salvage_status where lower(name) = 'deleted')`;

const allPending = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at 
from items i 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'pending')`;

const allApproved = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at  
from items i 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved')`;

const allDeleted = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at 
from items i 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'deleted')`;

const allClosed = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at 
from items i 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'closed')`;

const getById = 'select * from items where item_id = ?';

const create = `insert into items (name, reg_no, state_id, phone, address, close_date, brand_id, salvage_status_id, 
reserve_price, disposal_price, claim_no, created_by,front_image) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`

const update = `update items set name = ?, reg_no = ?, state_id = ?, phone = ?, address = ?, 
close_data = ?, brand_id = ?, reserve_price = ?, disposal_price = ?, claim_no = ?, updated_by = ?, 
salvage_status_id = ? where item_id = ?`;

const approved = `update items set salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved'), 
updated_by = ?, approved_by = ?, approved_at = ? where item_id = ?`;

const closed = `update items set salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'closed'), 
updated_by = ?, closed_by = ?, closed_at = ? where item_id = ? `;

const deleted = `update items set salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'deleted'), 
front_image = NULL, updated_by = ?, deleted_by = ?, deleted_at = ? where item_id = ?`;

const remove = 'delete from items where item_id = ?'

const isNameExist = `select count(*) as counts from items where salvage_status_id != (select salvage_status_id from salvage_status where lower(name) = 'deleted') 
and lower(name) = lower(?)`;

const isNameExistUpdate = `select count(*) as counts from items where item_id != ? and 
salvage_status_id != (select salvage_status_id from salvage_status where lower(name) = 'deleted') and 
lower(name) = lower(?)`;

const isFrontImageExist = 'select count(*) as counts from items where lower(front_image) = lower(?)';

const getByName = `select * from items where salvage_status_id != salvage_status_id != (select salvage_status_id from salvage_status where lower(name) = 'deleted') 
and lower(name) = lower(?)`;

const updateDisposal = `update items set disposal_price = ? where item_id = ?`;

const resetPage = `update items set page = 0 where 
salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved') `;

const updatePage = 'update items set page = ? where item_id = ?';


const getPages = `select * from items 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved') 
order by item_id desc`;


const frontPage = `select * from items 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved')`;

const sortPage = `select i.item_id, i.name, i.reg_no, i.phone, i.address, 
(select name from states where state_id = i.state_id) as state, i.close_date, i.reserve_price, i.claim_no, 
(select name from brands where brand_id = i.brand_id) as brand, 
(select name from salvage_status where salvage_status_id = i.salvage_status_id) as status, i.disposal_price, i.created_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.created_by) as created_by, i.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.updated_by) as updated_by, i.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.approved_by) as approved_by, i.deleted_at, 
(select concat(first_name,' ',last_name) from users where user_id = i.deleted_by) as deleted_by, i.front_image, 
(select concat(first_name,' ',last_name) from users where user_id = i.closed_by) as closed_by, i.closed_at,
i.front_image, i.page 
from items i 
where salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved') 
and i.page = ? 
order by i.item_id desc`;


const getNoOfPages = `select page from items where 
salvage_status_id = (select salvage_status_id from salvage_status where lower(name) = 'approved') 
order by page desc LIMIT 1`;


module.exports = {
    view,
    all,
    getById,
    create,
    update,
    approved,
    closed,
    deleted,
    remove,
    isNameExist,
    isFrontImageExist,
    getByName,
    allPending,
    allApproved,
    allDeleted,
    allClosed,
    updateDisposal,
    resetPage,
    getPages,
    updatePage,
    frontPage,
    sortPage,
    getNoOfPages
};