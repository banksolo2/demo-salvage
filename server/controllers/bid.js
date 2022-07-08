const mysql = require('mysql');
const {pool} = require('../../database/connect');
const itemQuery = require(`../../database/query/item`);
const bidQuery = require('../../database/query/bid');
const bidStatusQuery = require('../../database/query/bidStatus');
const moment = require('moment');
let success;
let error;
let urlMessage;


const viewItemBids = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.params.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(bidQuery.itemsView,[itemId],(err,bids)=>{
                    con.release();
                    if(err) throw err;

                   /* console.log(bids[0].buyer);
                    res.send('OK');
                    */

                   res.render('view-item-bids', {
                       title : 'View Bids',
                       isTable : true,
                       user : req.session.user,
                       success : req.query.success,
                       error : req.query.error,
                       bids : bids
                    });
                });
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}


const approveBid = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const bidId = req.params.id;
            const approvedBy = req.session.user.id;
            const itemId = req.query.item;
            const approvedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //approve item bid
                con.query(bidQuery.approved,[approvedBy,approvedAt,bidId],(err,approved)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //get bid details
                        con.query(bidQuery.getById,[bidId],(err,bid)=>{
                            if(err){
                                con.release();
                                throw err;
                            }
                            else{
                                //update disposal price
                                con.query(itemQuery.updateDisposal,[bid[0].amount,itemId],(err,disposal)=>{
                                    if(err){
                                        con.release();
                                        throw err;
                                    }
                                    else{
                                        // decline other item bid
                                        con.query(bidQuery.declined,[approvedBy,approvedAt,itemId],(err,declined)=>{
                                            if(err){
                                                con.release();
                                                throw err;
                                            }
                                            else{
                                                // close item
                                                con.query(itemQuery.closed,[approvedBy,approvedBy,approvedAt,itemId],(err,closeItem)=>{
                                                    con.release();
                                                    if(err) throw err;

                                                    success = 'Buyer bid has been approved....';
                                                    urlMessage = encodeURIComponent(success);
                                                    res.redirect(`/auth/all-approved-items?success=${urlMessage}`);
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}


const viewClosedBid = (req,res)=>{
    if(req.session.user){
        const itemId = req.params.id;

        // get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //get item bids
            con.query(bidQuery.itemsView,[itemId],(err, bids)=>{
                con.release();
                if(err) throw err;

                res.render('view-bids',{
                    title : 'View Bids',
                    user : req.session.user,
                    isTable : true,
                    bids : bids,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const viewBuyerClosedBid = (req,res) =>{
    if(req.session.user){
        const bidId = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(bidQuery.getViewById,[bidId],(err,bid)=>{
                con.release();
                if(err) throw err;

                res.render('view-buyer-bid', {
                    title : 'view Bid',
                    user : req.session.user,
                    isTable : false,
                    bid : bid[0]
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

module.exports = {
    viewItemBids,
    approveBid,
    viewClosedBid,
    viewBuyerClosedBid
}