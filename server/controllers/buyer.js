const mysql = require('mysql');
const {pool} = require('../../database/connect');
const buyerQuery = require('../../database/query/buyer');
const bidQuery = require('../../database/query/bid');
let urlMessage;
let error;
let success;


// all buyers
const all = (req,res) => {
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(buyerQuery.all,(err,buyers)=>{
                con.release();
                if(err) throw err;
                
                res.render('all-buyers',{
                    title : 'All Buyers',
                    isTable : true,
                    user : req.session.user,
                    success : req.query.success,
                    error : req.query.error,
                    buyers : buyers
                });
            });
        });
    }
    else res.render('/auth/session-expired');
}

// create buyer form page
const createForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            res.render('create-buyer',{
                title : 'Create Buyer',
                isTable : false,
                user : req.session.user,
                error : req.query.error,
                success : req.query.success
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

// create buyer function
const create = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const {
                name,
                email,
                phone
            } = req.body;

            // get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //check email exist
                con.query(buyerQuery.checkEmailExist,[email],(err,checkEmail)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkEmail[0].counts ===  0){
                            con.query(buyerQuery.create,[name,phone,email],(err,result)=>{
                                con.release();
                                if(err){
                                    error = `Enable create buyer. Please contact the admin for further assistance.`;
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/create-buyer-form?error=${urlMessage}`);
                                }
                                else{
                                    success = 'Buyer has been created...';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/create-buyer-form?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `Buyer email address ${email} already exist...`;
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/create-buyer-form?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden')
    }
    else res.redirect('/auth/session-expired');
}


// edit buyer form
const editForm = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(buyerQuery.getByid,[id],(err,buyer)=>{
                    con.release();
                    if(err) throw err;

                    res.render('edit-buyer',{
                        title : 'Edit Buyer',
                        isTable : false,
                        user : req.session.user,
                        result : buyer[0],
                        success : req.query.success,
                        error : req.query.error
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}
    
const edit = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const {
                buyerId,
                name,
                phone,
                email
            } = req.body;
            //get database connection
            const moblie = phone;
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //check if email already exist
                con.query(buyerQuery.checkEmailExistUpdate,[buyerId,email.trim()],(err,checkEmail)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkEmail[0].counts === 0){
                            con.query(buyerQuery.update,[name, moblie, email, buyerId],(err,result)=>{
                                con.release();
                                if(err){
                                    error = `Enable to update buyer. Please contact the admin for further assistance.`
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/edit-buyer-form/${buyerId}?error=${urlMessage}`);
                                }
                                else{
                                    success = 'Buyer details has been updated...';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/edit-buyer-form/${buyerId}?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `Email address ${email} already exist..`
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/edit-buyer-form/${buyerId}?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const remove = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(buyerQuery.remove,[id],(err,result)=>{
                   con.release();
                   if(err){
                       error = 'Enable to delete buyer. Please contract the admin for further assistance.';
                       urlMessage = encodeURIComponent(error);
                       res.redirect(`/auth/all-buyers?error=${urlMessage}`);
                   } 
                   else{
                       success = 'Buyer has been deleted....';
                       urlMessage = encodeURIComponent(success);
                       res.redirect(`/auth/all-buyers?success=${urlMessage}`);
                   }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const view = (req,res) => {
    if(req.session.user){
        const id = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(buyerQuery.getByid,[id],(err,buyer)=>{
                con.release();
                if(err) throw err;

                res.render('view-buyer',{
                    title : "View Buyer",
                    user : req.session.user,
                    isTable : false,
                    buyer : buyer[0]
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
};

const buyerInfo = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isSalvageCommittee){
            const buyerId = req.params.id;
            const itemId = req.query.item

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(buyerQuery.getByid,[buyerId],(err,buyer)=>{
                    con.release();
                    if(err) throw err;

                    res.render('view-buyer-info',{
                        title : 'View Buyer Info',
                        isTable : false,
                        user : req.session.user,
                        itemId : itemId,
                        buyer : buyer[0]
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const approveBuyer = (req,res) =>{
    if(req.session.user){
        const itemId = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //get approved Buyer ID
            con.query(bidQuery.getApprovedBuyerId,[itemId],(err,approvedBuyer)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    //get Buyer info
                    con.query(buyerQuery.getByid,[approvedBuyer[0].buyer_id],(err,buyer)=>{
                        con.release();
                        if(err) throw err;

                        res.render('view-approved-buyer',{
                            title : 'View Approved Buyer',
                            isTable : false,
                            user : req.session.user,
                            buyer : buyer[0]
                        });
                    });
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

module.exports = {
    all,
    createForm,
    create,
    editForm,
    edit,
    remove,
    view,
    buyerInfo,
    approveBuyer
}