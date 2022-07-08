const { redirect } = require('express/lib/response');
const mysql = require('mysql');
const {pool} = require('../../database/connect');
const bidStatusQuery = require('../../database/query/bidStatus');
let success;
let error;
let urlMessage;


const all = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isAdmin){
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //get bid statues
                con.query(bidStatusQuery.all,(err,bidStatus)=>{
                    con.release();
                    if(err) throw err;

                    res.render('all-bid-status',{
                        title : 'All Bid Status',
                        isTable : true,
                        user : req.session.user,
                        bidStatus : bidStatus,
                        success : req.query.success,
                        error : req.query.error
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

const createForm = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isAdmin){
            res.render('create-bid-status',{
                title : 'Create Bid Status',
                user : req.session.user,
                isTable : false,
                success : req.query.success,
                error : req.query.error
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

const create = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isAdmin){
            const name = req.body.name.trim();
            const code = name.replace(' ','_').toUpperCase();
            const createdBy = req.session.user.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //check if name already exist
                con.query(bidStatusQuery.isNameExist,[name],(err, isNameExist)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(isNameExist[0].counts === 0){
                            con.query(bidStatusQuery.insert,[name,code,createdBy],(err,result)=>{
                                con.release();
                                if(err) throw err;
            
                                success = 'Bid status has been created....';
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/create-bid-status-form?success=${success}`);
                            });
                        }
                        else{
                            error = 'Name already exist on the system....';
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/create-bid-status-form?error=${urlMessage}`);
                        }
                    }
                });
                
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const view = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const bidStatusId = req.params.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(bidStatusQuery.view,[bidStatusId],(err,result)=>{
                    con.release();
                    if(err) throw err;

                    res.render('view-bid-status',{
                        title : 'View Bid Status',
                        user : req.session.user,
                        result : result[0],
                        isTable : false
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const editForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isAdmin){
            const id = req.params.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(bidStatusQuery.getById,[id],(err,bidStatus)=>{
                    con.release();
                    if(err) throw err;

                    res.render('edit-bid-status',{
                        title : 'Edit Bid Status',
                        user : req.session.user,
                        isTable : false,
                        bidStatus : bidStatus[0],
                        success : req.query.success,
                        error : req.query.error
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

const edit = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const {
                bidStatusId,
                name
            } = req.body;
            const code = name.trim().replace(' ','_').toUpperCase();
            const updatedBy = req.session.user.id;

            pool.getConnection((err,con)=>{
                if(err) throw err;

                //Check if name already
                con.query(bidStatusQuery.isNameExistUpdate,[bidStatusId,name],(err,isNameExist)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(isNameExist[0].counts === 0){
                            //save bid status
                            con.query(bidStatusQuery.update,[name,code,updatedBy,bidStatusId],(err,result)=>{
                                con.release();
                                if(err) throw err;

                                success = 'Bid status has been updated...';
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/edit-bid-status-form/${bidStatusId}?success=${urlMessage}`);
                            });
                        }
                        else{
                            error = 'Name already exist on the system....';
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/edit-bid-status-form/${bidStatusId}?error=${urlMessage}`);
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

                con.query(bidStatusQuery.remove,[id],(err,result)=>{
                    con.release();
                    if(err) throw err;

                    success = 'Bid status has been deleted....';
                    urlMessage = encodeURIComponent(success);
                    res.redirect(`/auth/all-bid-status?success=${urlMessage}`);
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

module.exports = {
    all,
    createForm,
    create,
    view,
    editForm,
    edit,
    remove
};