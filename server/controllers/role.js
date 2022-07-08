const mysql = require('mysql');
const {pool} = require('../../database/connect');
const roleQuery = require('../../database/query/role');
let urlMessage = '';
let error = '';
let success = '';


const all = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin || req.session.user.isAdmin){
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(roleQuery.all,(err,roles) =>{
                    con.release();
                    if(err) throw err;
                    else{
                        res.render('all-roles',{
                            title : 'All Roles',
                            isTable : true,
                            user : req.session.user,
                            success : req.query.success,
                            error : req.query.error,
                            roles : roles
                        });
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
        
    }
    else res.redirect('/auth/session-expired');
};

const createForm = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            res.render('create-role',{
                title : 'Create Role',
                isTable : false,
                user : req.session.user,
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
        if(req.session.user.isSuperAdmin){
            const {name} = req.body;
            const code = name.replace(' ','_').toUpperCase();
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                //check if name already exist
                con.query(roleQuery.checkNameExist,[name],(err,checkName)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkName[0].counts === 0){
                            con.query(roleQuery.create,[name,code,req.session.user.id],(err,result)=>{
                                con.release();
                                if(err){
                                    error = 'Enable to create role. Please contact the admin for further assistant...';
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/create-role-form?error=${urlMessage}`);
                                }
                                else{
                                    success = 'New role has been created...';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/create-role-form?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            con.release();
                            error = 'Role name already exist...';
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/create-role-form?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};

const updateForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const roleId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(roleQuery.getById,[roleId],(err, role)=>{
                    con.release();
                    if(err) throw err;
                    res.render('edit-role',{
                        title : 'Edit Role',
                        user : req.session.user,
                        success : req.query.success,
                        error : req.query.error,
                        isTable : false,
                        result : role[0]
                    });
                })
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const update = (req,res) => {
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const {
                roleId,
                name
            } = req.body;
            const code = name.replace(' ','_').toUpperCase();

            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                // check if name already exist
                con.query(roleQuery.checkNameExistOnUpdate,[roleId,name],(err,checkName)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        if(checkName[0].counts === 0){
                            //update role
                            con.query(roleQuery.update,[name,code,req.session.user.id,roleId],(err,result)=>{
                                con.release();
                                if(err){
                                    error ='Enable to update role. Please contact the admin for further assistant...';
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/edit-role-form/${roleId}?error=${urlMessage}`);
                                }
                                else{
                                    success = 'Role has been updated...';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/edit-role-form/${roleId}?success=${urlMessage}`);
                                }
                            });
                        }
                        else{ 
                            con.release();
                            error = `Role name ${name} already exist....`;
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/edit-role-form/${roleId}?error=${urlMessage}`);
                        }
                    }
                });
            });
        }
    }
    else res.redirect('/auth/session-expired');
};

const remove = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isSuperAdmin){
            const roleId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(roleQuery.remove,[roleId],(err,result)=>{
                    con.release();
                    if(err){
                        error ='Enable to delete role. Please contact the admin for further assistant...';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/all-roles?error=${urlMessage}`);
                    }
                    else{
                        success = "Role has been deleted...";
                        urlMessage = encodeURIComponent(success);
                        res.redirect(`/auth/all-roles?success=${urlMessage}`);
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const view = (req,res)=>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const roleId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(roleQuery.view,[roleId],(err,result)=>{
                    con.release();
                    if(err) throw err;
                    else{
                        res.render('view-role',{
                            title : 'View Role',
                            isTable : false,
                            user : req.session.user,
                            result : result[0]
                        });
                    }
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
};


module.exports = {
    all,
    createForm,
    create,
    updateForm,
    update,
    remove,
    view
}