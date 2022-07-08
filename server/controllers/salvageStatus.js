const mysql = require('mysql');
const {pool} = require('../../database/connect');
const salvageStatusQuery = require('../../database/query/salvageStatus');
let urlMessage;
let error;
let success;


// get all salvage status page
const all = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                
                con.query(salvageStatusQuery.all,(err,result)=>{
                    con.release();
                    if(err) throw err;
                    res.render('all-salvage-status',{
                        title : 'All Salvage Status',
                        user : req.session.user,
                        success : req.query.success,
                        error : req.query.error,
                        result : result,
                        isTable : true
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}


// Create new salvage status form
const createForm = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            res.render('create-salvage-status',{
                title : 'Create Salvage Status',
                isTable : false,
                user : req.session.user,
                success : req.query.success,
                error : req.query.error
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

// save new salavge status
const create = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const name = req.body.name.trim();
            const code = name.replace(' ','_').toUpperCase();
            const createdBy = req.session.user.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //check if name already exist
                con.query(salvageStatusQuery.checkNameExist,[name],(err,checkName)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkName[0].counts === 0){
                            con.query(salvageStatusQuery.create,[name,code,createdBy],(err,result)=>{
                                con.release();
                                if(err){
                                    error = 'Enable to create salvage status. Please contact the admin for further assistance.';
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/create-salvage-status-form?error=${urlMessage}`);
                                }
                                else{
                                    success = 'Salavge status has been created...';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/create-salvage-status-form?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `Name ${name} already exist....`;
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/create-salvage-status-form?error=${urlMessage}`);
                        }
                    }
                });

            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

// Edit salvage status form
const editForm = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(salvageStatusQuery.getById,[id],(err,result)=>{
                    con.release();
                    if(err) throw err;
                    
                    res.render('edit-salvage-status',{
                        title : 'Edit Salvage Status',
                        isTable : false,
                        user : req.session.user,
                        result : result[0],
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
        if(req.session.user.isSuperAdmin){
            const {
                salvageStatusId,
                name
            } = req.body;
            const code = name.trim().replace(' ','_').toUpperCase();
            const updatedBy = req.session.user.id;

            //get database connection
            pool.getConnection((err,con) =>{
                if(err) throw err;

                //check if name already exist
                con.query(salvageStatusQuery.checkNameExistUpdate,[salvageStatusId,name],(err,checkName)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkName[0].counts === 0){
                            con.query(salvageStatusQuery.update,[name,code,updatedBy,salvageStatusId],(err,result)=>{
                                con.release();
                                if(err){
                                    error = `Enable to update salvage status. Please contact the admin for further assistance.`;
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/edit-salvage-status-form/${salvageStatusId}?error=${urlMessage}`);
                                }
                                else{
                                    success = 'Salvage status has been updated..';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/edit-salvage-status-form/${salvageStatusId}?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `Name ${name} already exist...`;
                            urlMessage = encodeURIComponent(error)
                            res.redirect(`/auth/edit-salvage-status-form/${salvageStatusId}?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

//Delete salvage status
const remove = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(salvageStatusQuery.remove,[id],(err,result)=>{
                    con.release();
                    if(err){
                        error = 'Enable to delete salvage status. Please contact the admin for further assistance.';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/all-salvage-status?error=${urlMessage}`);
                    }
                    else{
                        success = 'Salvage status has been deleted...';
                        urlMessage = encodeURIComponent(success);
                        res.redirect(`/auth/all-salvage-status?success=${urlMessage}`);
                    }
                });
            });

        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

// view full Salvage status details
const view = (req,res)=> {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const salvageStatusId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(salvageStatusQuery.view,[salvageStatusId],(err,result)=>{
                    con.release();
                    if(err) throw err;

                    res.render('view-salvage-status',{
                        title : 'View Salvage Status',
                        user : req.session.user,
                        isTable : false,
                        result : result[0]
                    });
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
    editForm,
    edit,
    remove,
    view
};