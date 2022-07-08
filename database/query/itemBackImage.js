const all = 'select * from items_back_images';

const getById = 'select * from items_back_images where item_back_image_id = ?';

const insert = 'insert into items_back_images (item_id,image) values(?,?)';

const getByItemId = 'select * from items_back_images where item_id  = ?';

const remove = 'delete from items_back_images where item_id = ?';


module.exports = {
    all,
    getById,
    insert,
    getByItemId,
    remove
};