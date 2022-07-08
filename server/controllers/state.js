const { redirect } = require('express/lib/response');
const mysql = require('mysql');
const {pool} = require('../../database/connect');
const stateQuery = require('../../database/query/state');
let success;
let error;
let urlMessage;


const all = (req,res) => {
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(stateQuery.all,(err,states)=>{
                    con.release();
                    if(err) throw err;

                    res.render('all-states',{
                        title : 'All States',
                        isTable : true,
                        user : req.session.user,
                        states : states,
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

const createForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            res.render('create-state',{
                title : 'Create State',
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
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const name = req.body.name.trim();
            const createdBy = req.session.user.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(stateQuery.isNameExist,[name],(err,nameExist)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(nameExist[0].counts === 0){
                            con.query(stateQuery.create,[name,createdBy],(err,insert)=>{
                                con.release();
                                if(err){
                                    error = `Enable to create state. Please contact the admin for further assistance.`;
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/create-state-form?error=${urlMessage}`);
                                }
                                else{
                                    success = 'State has been created..';
                                    urlMessage= encodeURIComponent(success);
                                    res.redirect(`/auth/create-state-form?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `State name ${name} already exist...`;
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/create-state-form?error=${urlMessage}`);
                        }
                    }

                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired')
};

const editForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(stateQuery.getById,[id],(err,state)=>{
                    con.release();
                    if(err) throw err;

                    res.render('edit-state', {
                        title : 'Edit State',
                        isTable : false,
                        user : req.session.user,
                        state : state[0],
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
                stateId,
                name
            } = req.body;
            const updatedBy = req.session.user.id;

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                //check if state name already exist
                con.query(stateQuery.isNameExistUpdate,[stateId,name.trim()],(err,nameExist)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(nameExist[0].counts === 0){
                            con.query(stateQuery.edit,[name.trim(),updatedBy,stateId],(err,result)=>{
                                con.release();
                                if(err){
                                    error = 'Enable to update state. Please contact the admin for further assistance.';
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/edit-state-form/${stateId}?error=${urlMessage}`);
                                }
                                else{
                                    success = 'State has been updated..';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/edit-state-form/${stateId}?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = `State name ${name} already exist..`;
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/edit-state-form/${stateId}?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const remove = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const id = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(stateQuery.remove,[id],(err,result)=>{
                    con.release();
                    if(err){
                        error = 'Enable to delete state. Please contact the admin further assistance.';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/all-states?error=${urlMessage}`);
                    }
                    else{
                        success = 'State has been deleted...';
                        urlMessage = encodeURIComponent(success);
                        res.redirect(`/auth/all-states?success=${urlMessage}`);
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
            const stateId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;

                con.query(stateQuery.view,[stateId],(err,state)=>{
                    con.release();
                    if(err) throw err;

                    res.render('view-state',{
                        title : 'View State',
                        isTable : false,
                        user : req.session.user,
                        result : state[0]
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
}