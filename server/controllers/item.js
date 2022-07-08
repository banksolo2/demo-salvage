const mysql = require('mysql');
const {pool} = require('../../database/connect');
const itemQuery = require('../../database/query/item');
const itemBackImageQuery = require('../../database/query/itemBackImage');
const stateQuery = require('../../database/query/state');
const brandQuery = require('../../database/query/brand');
const salvageStatusQuery = require('../../database/query/salvageStatus');
const userQuery = require('../../database/query/user');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const date = require('../../functions/date');
const page = require('../../functions/page');
let success;
let error;
let urlMessage;
let count;
let uploadPath;
let newfolder;

const all = (req,res) =>{
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(itemQuery.all,(err,items)=>{
                con.release();
                if(err) throw err;

                res.render('all-items',{
                    title : 'All Items',
                    isTable : true,
                    user : req.session.user,
                    items : items,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        })
    }
    else res.redirect('/auth/session-expired');
};

const createForm = (req,res) =>{
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(stateQuery.options,[0],(err,states)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    con.query(brandQuery.options,[0],(err,brands)=>{
                        con.release();
                        if(err){
                            //con.release();
                            throw err;
                        }
                        else{
                            res.render('create-item',{
                                title : 'Create Item',
                                user : req.session.user,
                                isTable : false,
                                success : req.query.success,
                                error : req.query.error,
                                states : states,
                                brands : brands
                            });
                        }
                    });
                    
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}


const create = (req,res) => {
    if(req.session.user){
        const {
            name,
            phone,
            address,
            stateId,
            regNo,
            brandId,
            closeDate,
            claimNo,
            reservePrice
        } = req.body;
        const frontImage = req.files.frontImage;
        const gallery = req.files.gallery;
        const newCloseDate = date.convertDateFormat(closeDate);
        const createdBy = req.session.user.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

                //get salvage status
                con.query(salvageStatusQuery.getByCode,['pending'],(err,salvageStatus)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //save item
                        con.query(itemQuery.create,[name,regNo,stateId,phone,address,newCloseDate,brandId,salvageStatus[0].salvage_status_id,reservePrice,0,claimNo,createdBy,frontImage.name],(err,result)=>{
                            con.release();
                            if(err){
                                throw err;
                            }
                            else{
                                //create new folder
                                newfolder = path.join(__dirname,`../../public/upload/frontImage/${result.insertId}`);
                                uploadPath = path.join(__dirname,`../../public/upload/frontImage/${result.insertId}/${frontImage.name}`);
                                try {
                                    fs.mkdir(newfolder,(folder)=> console.log('folder has been created'));
                                } catch (error) {
                                    throw err;
                                }
                                frontImage.mv(uploadPath,(err)=>{
                                    if(err) throw err;
                                });


                                //create new folder for gallery
                                newfolder = path.join(__dirname,`../../public/upload/gallery/${result.insertId}`);
                                try{ fs.mkdir(newfolder,()=> console.log('New folder created...'));}
                                catch(err){ throw err; }

                                if(gallery[0] === undefined){
                                    uploadPath = path.join(__dirname,`../../public/upload/gallery/${result.insertId}/${gallery.name}`);
    
                                    gallery.mv(uploadPath,(err)=>{
                                        if(err) throw err;
                                        //get database connection
                                        pool.getConnection((err,con)=>{
                                            if(err) throw err;

                                            con.query(itemBackImageQuery.insert,[result.insertId,gallery.name],(err,result)=>{
                                                con.release();
                                                if(err) throw err;
                                            });
                                        });
                                    });
                                }
                                else{

                                    gallery.forEach((image)=>{
                                        uploadPath = path.join(__dirname,`../../public/upload/gallery/${result.insertId}/${image.name}`);
    
                                        image.mv(uploadPath,(err)=>{
                                            if(err) throw err;
                                            //get database connection
                                            pool.getConnection((err,con)=>{
                                                if(err) throw err;
    
                                                con.query(itemBackImageQuery.insert,[result.insertId,image.name],(err,gallery)=>{
                                                    con.release();
                                                    if(err) throw err;
                                                });
                                            });
                                        });
                                    });

                                }

                                


                                success = 'Salvage item has been created.....';
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/create-item-form?success=${urlMessage}`);

                            }
                        });
                    }
                });
            
        });
    }
    else res.redirect('/auth/session-expired');
}

const allPending = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(itemQuery.allPending,(err,items)=>{
                    con.release();
                    if(err) throw err;
                    
                    res.render('all-pending-items',{
                        title : 'All Pending Item',
                        user : req.session.user,
                        items : items,
                        success : req.query.success,
                        error : req.query.error,
                        isTable : true

                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const approvePending = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.params.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //get item details
                con.query(itemQuery.getById,[itemId],(err,item)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //get created by details
                        con.query(userQuery.getById,[item[0].created_by],(err,createdBy)=>{
                            if(err){
                                con.release();
                                throw err;
                            }
                            else{
                                // get state details
                                con.query(stateQuery.getById,[item[0].state_id],(err,state)=>{
                                    if(err){
                                        con.release();
                                        throw err;
                                    }
                                    else{
                                        //get brand details
                                        con.query(brandQuery.getById,[item[0].brand_id],(err,brand)=>{
                                            if(err){
                                                con.release();
                                                throw err;
                                            }
                                            else{
                                                // get gallery
                                                con.query(itemBackImageQuery.getByItemId,[item[0].item_id],(err,gallery)=>{
                                                    con.release();
                                                    if(err) throw err;

                                                    res.render('edit-pending-item',{
                                                        title : 'Approve Item',
                                                        user : req.session.user,
                                                        isTable : false,
                                                        success : req.query.success,
                                                        error : req.query.error,
                                                        item : item[0],
                                                        state : state[0],
                                                        brand : brand[0],
                                                        gallery : gallery,
                                                        createdBy : createdBy[0]
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const approved = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.body.itemId;
            const userId = req.session.user.id;
            const currentTime =  moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(itemQuery.approved,[userId,userId,currentTime,itemId],(err,approveItem)=>{
                    con.release();
                    if(err) throw err;

                    //set pages
                    page.setPages();
                    success = "Salvage item has been approved...";
                    urlMessage = encodeURIComponent(success);
                    res.redirect(`/auth//all-pending-items?success=${urlMessage}`);
                })
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

const allApproved = (req,res) =>{
    if(req.session.user){
        // get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(itemQuery.allApproved,(err,items)=>{
                con.release();
                if(err) throw err;

                res.render('all-approved-items',{
                    title : 'All Approved Items',
                    items : items,
                    user : req.session.user,
                    success : req.query.success,
                    error : req.query.error,
                    isTable : true
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const viewApproved = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.params.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //get item details
                con.query(itemQuery.getById,[itemId],(err,item)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //get createdBy details
                        con.query(userQuery.getById,[item[0].created_by],(err,createdBy)=>{
                            if(err){
                                con.release();
                                throw err;
                            }
                            else{
                                //get approvedBy details
                                con.query(userQuery.getById,[item[0].approved_by],(err,approvedBy)=>{
                                    if(err){
                                        con.release();
                                        throw err;
                                    }
                                    else{
                                        //get brand details
                                        con.query(brandQuery.getById,[item[0].brand_id],(err,brand)=>{
                                            if(err){
                                                con.release();
                                                throw err;
                                            }
                                            else{
                                                //get state details
                                                con.query(stateQuery.getById,[item[0].state_id],(err,state)=>{
                                                    if(err){
                                                        con.release();
                                                        throw err;
                                                    }
                                                    else{
                                                        // get gallery
                                                        con.query(itemBackImageQuery.getByItemId,[item[0].item_id],(err,gallery)=>{
                                                            con.release();
                                                            if(err) throw err;

                                                            res.render('edit-approved-item',{
                                                                title : 'View Approved Item',
                                                                isTable : false,
                                                                user : req.session.user,
                                                                success : req.query.success,
                                                                error : req.query.error,
                                                                item : item[0],
                                                                createdBy : createdBy[0],
                                                                approvedBy : approvedBy[0],
                                                                brand : brand[0],
                                                                state : state[0],
                                                                gallery : gallery
                                                            });
                                                        });
                                                    }
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
};

const deleted = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.body.itemId;
            const deletedBy = req.session.user.id;
            const frontImage = path.join(__dirname,`../../public/upload/frontImage/${itemId}`);
            const gallery = path.join(__dirname,`../../public/upload/gallery/${itemId}`);
            const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');


            // get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                // delete item
                con.query(itemQuery.deleted,[deletedBy,deletedBy,currentTime,itemId],(err,item)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //delete frontImage
                        fs.rmdir(frontImage,{recursive: true},(err)=>{
                            if(err) throw err;
                        });

                        //delete gallery
                        con.query(itemBackImageQuery.remove,[itemId],(err,result)=>{
                            con.release();
                            if(err) throw err;

                             //delete gallery
                            fs.rmdir(gallery,{recursive : true},(err)=>{
                                if(err) throw err;
                            });

                            success = 'Salvage item has been deleted....';
                            urlMessage = encodeURIComponent(success);
                            res.redirect(`/auth/all-approved-items?success=${success}`);

                        });
                    }
                    

                   
                });
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const allClosed = (req,res) =>{
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(itemQuery.allClosed,(err,items)=>{
                con.release();
                if(err) throw err;
                
                res.render('all-closed-items',{
                    title : 'All Closed Item',
                    user : req.session.user,
                    isTable : true,
                    items : items,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const deletedClosedItem = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const itemId = req.params.id;
            const deletedBy = req.session.user.id;
            const frontImage = path.join(__dirname,`../../public/upload/frontImage/${itemId}`);
            const gallery = path.join(__dirname,`../../public/upload/gallery/${itemId}`);
            const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');


            // get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                // delete item
                con.query(itemQuery.deleted,[deletedBy,deletedBy,currentTime,itemId],(err,item)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        //delete frontImage
                        fs.rmdir(frontImage,{recursive: true},(err)=>{
                            if(err) throw err;
                        });

                        //delete gallery
                        con.query(itemBackImageQuery.remove,[itemId],(err,result)=>{
                            con.release();
                            if(err) throw err;

                             //delete gallery
                            fs.rmdir(gallery,{recursive : true},(err)=>{
                                if(err) throw err;
                            });

                            success = 'Salvage item has been deleted....';
                            urlMessage = encodeURIComponent(success);
                            res.redirect(`/auth/all-closed-items?success=${success}`);

                        });
                    }
                    

                   
                });
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const allDeleted = (req,res) =>{
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(itemQuery.allDeleted,(err,items)=>{
                con.release();
                if(err) throw err;

                res.render('all-deleted-items',{
                    title : 'All Deleted Items',
                    user : req.session.user,
                    isTable : true,
                    items : items,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }else res.redirect('/auth/session-expired');
}

const deletedItem = (req,res) => {
    if(req.session.user){
        const itemId = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(itemQuery.view,[itemId],(err,item)=>{
                con.release();
                if(err) throw err;

                res.render('view-deleted-item', {
                    title : 'View Deleted Item',
                    user : req.session.user,
                    isTable : false,
                    item : item[0]
                })
            });
        });
    }
    else res.redirect('/auth/session-expired');
}


module.exports = {
    all,
    createForm,
    create,
    allPending,
    approvePending,
    approved,
    allApproved,
    viewApproved,
    deleted,
    allClosed,
    deletedClosedItem,
    allDeleted,
    deletedItem
};