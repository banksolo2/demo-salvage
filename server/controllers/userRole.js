const mysql = require('mysql');
const {pool} = require('../../database/connect');
const userRoleQuery = require('../../database/query/userRole');
const userQuery = require('../../database/query/user');
const roleQuery = require('../../database/query/role');
let urlMessage = '';
let error = '';
let success = '';


const all = (req,res) =>{
    if(req.session.user){
        let userId = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(userRoleQuery.viewByuser,[userId],(err,result)=>{
                con.release();
                if(err) throw err;
                res.render('all-user-roles',{
                    title : 'All user roles',
                    isTable : true,
                    user : req.session.user,
                    id : req.params.id,
                    result : result,
                    userId : req.params.id,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const createForm = (req,res) => {
    if(req.session.user){
        const userId = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            //get user details
            con.query(userQuery.getById,[userId],(err,userResult)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    //get roles options
                    con.query(roleQuery.options,[0],(err,roleOption)=>{
                        con.release();
                        if(err) throw err;
                        
                        res.render('create-user-role',{
                            title : 'Create User Role',
                            user : req.session.user,
                            success : req.query.success,
                            error : req.query.error,
                            roleOption : roleOption,
                            userResult : userResult[0],
                            isTable : false
                        });
                    });
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
};

const create = (req,res) => {
    if(req.session.user){
        const {
            userId,
            roleId
        } = req.body

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            //check if user role already exist
            con.query(userRoleQuery.checkUserRoleExistCreate,[userId,roleId],(err,checkUserRole)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkUserRole[0].counts === 0){
                        //save user new role
                        con.query(userRoleQuery.create,[userId,roleId,req.session.user.id],(err,result)=>{
                            con.release();
                            if(err){
                                error = 'Enable to create user role. Please contact the admin for further assistance.';
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/create-user-role-form/${userId}?error=${urlMessage}`);
                            } 
                            else{
                                success = 'User role has been created.',
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/all-user-roles/${userId}?success=${urlMessage}`);
                            }
                        });
                    }
                    else{
                        error = 'User role already exist...';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/create-user-role-form/${userId}?error=${urlMessage}`);
                    }
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
};

const remove = (req,res) => {
    if(req.session.user){
        const userRoleId = req.params.id;
        const userId = req.query.userId;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            
            //delete user role
            con.query(userRoleQuery.remove,[userRoleId],(err,result)=>{
                con.release();
                if(err){
                    error = 'Enable to delete user role. Please contact the admin for further assistance.';
                    urlMessage = encodeURIComponent(error);
                    res.redirect(`/auth/all-user-roles/${userId}?error=${urlMessage}`);
                    
                }
                else{
                    success = 'User role has been deleted..';
                    urlMessage = encodeURIComponent(success);
                    res.redirect(`/auth/all-user-roles/${userId}?success=${urlMessage}`);
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
};

const editForm = (req,res) =>{
    if(req.session.user){
        const userRoleId = req.params.id;
        // get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            //get user role
            con.query(userRoleQuery.getById,[userRoleId],(err,userRole)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    //get role name
                    con.query(roleQuery.getById,[userRole[0].role_id],(err,roleInfo)=>{
                        if(err){
                            con.release();
                            throw err;
                        }
                        //get role options
                        con.query(roleQuery.options,[userRoleId],(err,roleOption) => {
                            if(err){
                                con.release();
                                throw err;
                            }
                            //get user info
                            con.query(userQuery.getById,[userRole[0].user_id],(err,userInfo)=>{
                                con.release();
                                if(err) throw err;
                                res.render('edit-user-role',{
                                    title : 'Edit User Role',
                                    user : req.session.user,
                                    userInfo : userInfo[0],
                                    roleInfo : roleInfo[0],
                                    roleOption : roleOption,
                                    userRole : userRole[0],
                                    success : req.query.success,
                                    error : req.query.error,
                                    isTable : false
                                });
                            });
                        });
                    });
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const edit = (req, res) =>{
    if(req.session.user){
        const {
            userRoleId,
            userId,
            roleId
        } = req.body;
        const updatedBy = req.session.user.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //check if user role already exist
            con.query(userRoleQuery.checkUserRoleExistUpdate,[userRoleId,userId,roleId],(err,checkUserRole)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkUserRole[0].counts === 0){
                        con.query(userRoleQuery.update,[userId,roleId,updatedBy,userRoleId],(err,result)=>{
                            con.release();
                            if(err){
                                error = 'Enable to update user role. Please contact the admin for further assistance.';
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/edit-user-role-form/${userRoleId}?error=${urlMessage}`);
                            }
                            success = 'User role has been updated...';
                            urlMessage = encodeURIComponent(success);
                            res.redirect(`/auth/edit-user-role-form/${userRoleId}?success=${urlMessage}`);
                        });
                    }
                    else{
                        con.release();
                        error = 'User role already exist....';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/edit-user-role-form/${userRoleId}?error=${urlMessage}`);
                    }
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
    remove,
    editForm,
    edit
}