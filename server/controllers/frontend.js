const mysql = require('mysql');
const {pool} = require('../../database/connect');
const itemQuery = require('../../database/query/item');
const itemBackImageQuery = require('../../database/query/itemBackImage');
const buyerQuery = require('../../database/query/buyer');
const bidQuery = require('../../database/query/bid');
const bidStatusQuery = require('../../database/query/bidStatus');
let message;
let urlMessage;
//How many post you want to show on a page
const resultsPerPage = 6;


const home = (req,res)=>{
    let page = req.query.page || 1;

    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;

        //get number of pages
        con.query(itemQuery.getNoOfPages,(err,noOfpages)=>{
            if(err){
                con.release();
                throw err;
            }
            else{
                if(page > noOfpages[0].page) page = noOfpages[0].page;
                con.query(itemQuery.sortPage,[page],(err,items)=>{
                    con.release();
                    if(err){
                        //con.release();
                        throw err;
                    }
                    else{
                        res.render('index',{
                            title : "Home Page",
                            layout : './layouts/frontend',
                            noOfPages : noOfpages[0].page,
                            page : page,
                            success : req.query.success,
                            error : req.query.error,
                            items : items
                        })
                    }
                });
            }
        });
    });
    
}

const bidForm = (req,res)=>{
    const itemId = req.params.id;

    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;

        con.query(itemQuery.view,[itemId],(err,item)=>{
            if(err){
                con.release();
                throw err;
            }
            else{
                // get gallery
                con.query(itemBackImageQuery.getByItemId,[item[0].item_id],(err,gallery)=>{
                    con.release();
                    if(err) throw err;

                    res.render('bid-form',{
                        title : 'Make Bid',
                        layout : './layouts/frontend',
                        item : item[0],
                        gallery : gallery,
                        success : req.query.success,
                        error : req.query.error
                    });
                });
            }
        });
    
    });
}

const bid = (req,res)=>{
    const {
        name,
        email,
        phone,
        amount,
        narration,
        itemId
    } = req.body;

    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;
            
        //check if buyer email exist
        con.query(buyerQuery.checkEmailExist,[email],(err,isEmailExist)=>{
            if(err){
                con.release();
                throw err;
            }
            else{
                if(isEmailExist[0].counts >= 1){
                    //get buyer
                    con.query(buyerQuery.getByEmail,[email],(err,buyer)=>{
                        if(err){
                            con.release();
                            throw err;
                        }
                        else{
                            //make bid
                            con.query(bidQuery.insert,[buyer[0].buyer_id,amount,itemId,narration],(err,result)=>{
                                con.release();
                                if(err){
                                    message = 'Enable make bid. Please contact the admin for further assistance.';
                                    urlMessage = encodeURIComponent(message);
                                    res.redirect(`/make-bid-form/${itemId}?error=${urlMessage}`);
                                }
                                else{
                                    message = 'Bid was successful...';
                                    urlMessage = encodeURIComponent(message);
                                    res.redirect(`/make-bid-form/${itemId}?success=${urlMessage}`);
                                }
                            });
                        }
                    });
                }
                else{
                    // add new buyer
                    con.query(buyerQuery.create,[name,phone,email],(err,buyer)=>{
                        if(err){
                            con.release();
                            throw err;
                        }
                        else{
                            con.query(bidQuery.insert,[buyer.insertId,amount,itemId,narration],(err,result)=>{
                                con.release();
                                if(err){
                                    message = 'Enable make bid. Please contact the admin for further assistance.';
                                    urlMessage = encodeURIComponent(message);
                                    res.redirect(`/make-bid-form/${itemId}?error=${urlMessage}`);
                                }
                                else{
                                    message = 'Bid was successful...';
                                    urlMessage = encodeURIComponent(message);
                                    res.redirect(`/make-bid-form/${itemId}?success=${urlMessage}`);
                                }
                            });
                        }
                    });
                }
            }
        });
    });
}


module.exports = {
    home,
    bidForm,
    bid
}