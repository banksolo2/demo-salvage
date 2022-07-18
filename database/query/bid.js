const insert = `insert into bids (buyer_id,amount,item_id,narration,bid_status_id) values(?, ?, ?, ?, (select bid_status_id from bid_status where lower(name) = 'pending'))`;

const approved = `update bids set bid_status_id = (select bid_status_id from bid_status where lower(name) = 'approved'), 
approved_by = ?, approved_at = ? where bid_id = ?`;

const declined = `update bids set bid_status_id = (select bid_status_id from bid_status where lower(name) = 'declined'), 
declined_by = ?, declined_at = ? where item_id = ? and 
bid_status_id = (select bid_status_id from bid_status where lower(name) = 'pending')`;

const remove = `delete from bids where bid_id = ?`;

const itemsView = `select b.bid_id, (select name from buyers where buyer_id = b.buyer_id) as buyer, b.amount, 
b.buyer_id, b.item_id, 
(select name from items where item_id = b.item_id) as item, b.narration, 
(select name from bid_status where bid_status_id = b.bid_status_id) as bid_status, b.created_at, b.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.approved_by) as approved_by, b.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.declined_by) as declined_by, b.declined_at 
from bids b where b.item_id = ?`;

const isItemBidApproved = `select count(*) as counts from bids where item_id = ? and 
bid_status_id = (select bid_status_id from bid_status where lower(name) = 'approved')`;

const viewApprovedBid =  `select b.bid_id, (select name from buyers where buyer_id = b.buyer_id) as buyer, b.amount, 
b.buyer_id, b.item_id, 
(select name from items where item_id = b.item_id) as item, b.narration, 
(select name from bid_status where bid_status_id = b.bid_status_id) as bid_status, b.created_at, b.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.approved_by) as approved_by, b.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.declined_by) as declined_by, b.declined_at 
from bids b where b.item_id = ? and 
bid_status_id = (select bid_status_id from bid_status where lower(name) = 'approved')`;

const getById = `select * from bids where bid_id = ?`;

const getViewById = `select b.bid_id, (select name from buyers where buyer_id = b.buyer_id) as buyer, b.amount, 
b.buyer_id, b.item_id, 
(select name from items where item_id = b.item_id) as item, b.narration, 
(select name from bid_status where bid_status_id = b.bid_status_id) as bid_status, b.created_at, b.updated_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.approved_by) as approved_by, b.approved_at, 
(select concat(first_name,' ',last_name) from users where user_id = b.declined_by) as declined_by, b.declined_at 
from bids b where b.bid_id = ?`

const getApprovedBuyerId = `select buyer_id from bids where item_id = ? and 
bid_status_id = (select bid_status_id from bid_status where lower(name) = 'approved')`;


const getHighestAmount = `select amount from bids where buyer_id = ? and item_id = ? 
order by amount desc LIMIT 1`;


const getBuyerCountItem = `select count(*) as counts from bids where buyer_id = ? and item_id = ?`;


module.exports = {
    insert,
    approved,
    declined,
    remove,
    itemsView,
    isItemBidApproved,
    getById,
    getApprovedBuyerId,
    getViewById,
    getHighestAmount,
    getBuyerCountItem
}