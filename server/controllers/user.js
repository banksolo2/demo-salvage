//const req = require('express/lib/request');
const mysql = require('mysql');
const {pool} = require('../../database/connect');
const userQuery = require('../../database/query/user');
const roleQuery = require('../../database/query/role');
const userRoleQuery = require('../../database/query/userRole');
const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
let urlMessage = '';
let count = 0;
let error = '';
let success = '';


const create = async (req,res)=> {
    if(req.session.user){
        const {
            firstName,
            lastName,
            email,
            status,
            phone
        } = req.body;
    
        try {
            const password = await bcrypt.hash('Salvage1234_',10);
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(userQuery.checkEmailOnCreate,[email],(err,emailCheck) =>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    if(emailCheck[0].counts === 0){
                        //create new user
                        con.query(userQuery.create,[firstName,lastName,email,status,password,phone,req.session.user.id],(err, newUser)=>{
                            con.release();
                            if(err){
                                error = "Enable to create new user. Please, contact the admin for assistant...";
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/create-user-form?error=${urlMessage}`);
                            }
                            else{
                                try{
                                    let newFolder = path.join(__dirname ,'../../public/upload/users/'+newUser.insertId);
                                    fs.mkdir(newFolder,(result)=>{});
                                }
                                catch(err){
                                    throw err;
                                }
                                success = "User has been created.....";
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/create-user-form?success=${urlMessage}`);
                            }
                        });
                    }
                    else{
                        con.release();
                        error = "Email address already exist....";
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/create-user-form?error=${urlMessage}`);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }
    else{
        res.redirect('/auth/session-expired');
    }
}

const loginForm = (req,res) => {
    if(req.session.user){
        res.redirect('/auth/dashboard');
    }
    else{
        res.render('login',{
            title : 'Login page',
            layout : './layouts/backend-login',
            success : req.query.success,
            error : req.query.error
        });
    }

}

const dashboard = (req,res) => {
    if(req.session.user){
        console.log(req.session.user);
        res.render('dashboard',{
            title : "Dashboard",
            layout : './layouts/backend',
            isTable : false,
            user : req.session.user
        });
    }
    else{
        res.redirect('/auth/session-expired');
    }
}

const login = async (req,res) =>{
    const {
        email,
        password
    } = req.body;

    //get database connection
    pool.getConnection((err,con)=>{
        if(err){
            con.release();
            throw err;
        }
        //check if email exist
        con.query(userQuery.getByEmail,[email],(err,result,fields)=>{
            if(err) throw err;
            if(result[0]){
                try {
                    if(bcrypt.compareSync(password,result[0].password)){
                        //get super admin ID
                        con.query(roleQuery.getBycode,['SUPER_ADMIN'],(err,superAdmin)=>{
                            if(err){
                                con.release();
                                throw err;
                            }
                            // get admin ID
                            con.query(roleQuery.getBycode,['ADMIN'],(err,admin)=>{
                                if(err){
                                    con.release();
                                    throw err;
                                }
                                //get salvage committee ID
                                con.query(roleQuery.getBycode,['SALVAGE_COMMITTEE'],(err,salvageCommittee)=>{
                                    if(err){
                                        con.release();
                                        throw err;
                                    }

                                    // is user super admin
                                    con.query(userRoleQuery.checkUserRoleExistCreate,[result[0].user_id,superAdmin[0].role_id],(err,isSuperAdmin)=>{
                                        if(err){
                                            con.release();
                                            throw err;
                                        }

                                        //is user admin
                                        con.query(userRoleQuery.checkUserRoleExistCreate,[result[0].user_id,admin[0].role_id],(err,isAdmin)=>{
                                            if(err){
                                                con.release();
                                                throw err;
                                            }

                                            //is user salvage committee
                                            con.query(userRoleQuery.checkUserRoleExistCreate,[result[0].user_id,salvageCommittee[0].role_id],(err,isSalvageCommittee)=>{
                                                con.release();
                                                if(err) throw err;

                                                let user = {
                                                    id : result[0].user_id,
                                                    firstName : result[0].first_name,
                                                    lastName : result[0].last_name,
                                                    email : result[0].email,
                                                    phone : result[0].phone,
                                                    status : result[0].status,
                                                    photo : result[0].photo,
                                                    isSuperAdmin : (isSuperAdmin[0].counts === 1),
                                                    isAdmin : (isAdmin[0].counts === 1),
                                                    isSalvageCommittee : (isSalvageCommittee[0].counts === 1)
                                                };

                                                req.session.user = user;
                                                res.redirect('/auth/dashboard');
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    }
                    else{
                        con.release();
                        error = 'Invalid user password...';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/login-form?error=${urlMessage}`);
                    }
                } catch (error) {
                    res.status(500).send(error);
                }
            }
            else{
                error = 'User does not exist on the system';
                urlMessage = encodeURIComponent(error);
                res.redirect(`/auth/login-form?error=${urlMessage}`);
            }
            
        });
    });
}

const logout = (req,res) =>{
    req.session.destroy((err)=>{
        if(err) throw err;
        else{
            success = 'Logout successfully...';
            urlMessage = encodeURIComponent(success);
            res.redirect(`/auth/login-form?success=${urlMessage}`);
        }

    });
}

const all = (req,res) =>{
    if(req.session.user){
        pool.getConnection((err,con)=>{
            if(err) throw err;
            con.query(userQuery.allUser,(err,rows)=>{
                con.release();
                if(err) throw err;
                res.render('all-users',{
                    title : 'All Users',
                    rows : rows,
                    isTable : true,
                    user : req.session.user,
                    error : req.query.error,
                    success : req.query.success
                });
            });
        });
    }
    else{
        res.redirect('/auth/session-expired');
    }
};

const createForm = (req,res)=>{
    if(req.session.user){
        res.render('create-user',{
            title : 'Create User',
            success : req.query.success,
            error : req.query.error,
            isTable : false,
            user : req.session.user
        })
    }
    else{
        res.redirect('/auth/session-expired');
    }
}

const remove = (req,res) => {
    if(req.session.user){
        const userId = req.params.id;
        const deletedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            con.query(userQuery.deleteUser,[req.session.user.id,deletedAt,req.session.user.id,userId],(err,result)=>{
                con.release();
                if(err){
                    error = 'Enable to delete user. Please contact the admin for further assistance..';
                    urlMessage = encodeURIComponent(error);
                    console.log(err);
                    res.redirect(`/auth/all-users?error=${urlMessage}`);
                }
                else{
                    success = 'User has been deleted.....';
                    urlMessage = encodeURIComponent(success);
                    res.redirect(`/auth/all-users?success=${urlMessage}`);
                }
            });
        });
    }
    else{
        res.redirect('/auth/session-expired');
    }
}

const editUserForm = (req,res) => {
    if(req.session.user){
        const userId = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            con.query(userQuery.getById,[userId],(err,result)=>{
                con.release();
                if(err) throw err;
                res.render('edit-user',{
                    title : 'Edit User',
                    result : result[0],
                    success : req.query.success,
                    error : req.query.error,
                    user : req.session.user,
                    isTable : false
                });
            });
        });
    }
    else{
        res.redirect('/auth/session-expired');
    }
};

const editUser = (req,res)=>{
    if(req.session.user){
        const {
            userId,
            firstName,
            lastName,
            email,
            phone,
            status
        } = req.body;
        
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            //check if email already exist
            con.query(userQuery.checkEmailOnUpdate,[userId,email],(err,checkEmail)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkEmail[0].counts === 0){
                        //update user information
                        con.query(userQuery.update,[firstName,lastName,email,status,phone,req.session.user.id,userId],(err,result)=>{
                            con.release();
                            if(err){
                                error = `Enable to update user. Please contact admin for further assistance.`;
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/edit-user-form/${userId}?error=${urlMessage}`);
                            }
                            else{
                                success = 'User has been updated....';
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/all-users?success=${urlMessage}`);
                            }
                        });
                    }
                    else{
                        con.release();
                        error = `Email address ${email} already exist....`;
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/edit-user-form/${userId}?error=${urlMessage}`);
                    }
                }
            });
        });
    }
    else{
        res.redirect('/auth/session-expired');
    }
}

const view = (req,res)=>{
    if(req.session.user){
        const userId = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            //get user details
            con.query(userQuery.veiwUser,[userId],(err,result)=>{
                con.release();
                if(err) throw err;
                else{
                    res.render('view-user',{
                        title : 'View User',
                        isTable : false,
                        user : req.session.user,
                        result : result[0]
                    });
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
};

const changePasswordForm = (req,res) => {
    if(req.session.user){
        const userId = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;
            con.query(userQuery.getById,[userId],(err,result)=>{
                con.release();
                if(err) throw err;
                //console.log(result[0]);
                res.render('changePassword',{
                    title : 'Change Password',
                    user : req.session.user,
                    isTable : false,
                    success : req.query.success,
                    error : req.query.error,
                    result : result[0]
                });
            });
        })
    }
    else res.redirect('/auth/session-expired');
};

const changePassword  = async (req,res) => {
    if(req.session.user){
        const {
            userId,
            email,
            password,
            confirmPassword
        } = req.body;

        if(password === confirmPassword){
            //hash password
            const hashPassword = await bcrypt.hash(password,10);
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(userQuery.changePassword,[hashPassword,req.session.user.id,userId],(err,result)=>{
                    con.release();
                    if(err){
                        error = 'Enable to change password. Please contact the admin for further assistant...';
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/change-password-form/${userId}?error=${urlMessage}`);
                    }
                    else{
                        success = "Password was successfully updated......";
                        urlMessage = encodeURIComponent(success);
                        res.redirect(`/auth/change-password-form/${userId}?success=${urlMessage}`);
                    }
                });
            });
        }
        else{
            error = 'Password and confirm password does not match',
            urlMessage = encodeURIComponent(error);
            res.redirect(`/auth/change-password-form/${userId}?error=${urlMessage}`);
        }
    }
    else res.redirect(`/auth/session-expired`);
    
}

const updateProfileForm = (req,res) =>{
    if(req.session.user){
        res.render('user-profile',{
            title : 'Update Profile',
            user : req.session.user,
            isTable : false,
            success : req.query.success,
            error : req.query.error
        });
    }
    else res.redirect('/auth/session-expired');
};

const updateProfile = (req,res) =>{
    if(req.session.user){
        let photo;
        let uploadPath;
        const {
            userId,
            firstName,
            lastName,
            email,
            phone
        } = req.body;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //check if email already exist
            con.query(userQuery.checkEmailOnUpdate,[userId,email],(err,checkEmail)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkEmail[0].counts === 0){
                        if(!req.files || Object.keys(req.files).length === 0){
                            con.query(userQuery.updateProfile,[firstName,lastName,email,phone,req.session.user.id,userId],(err,result)=>{
                                con.release();
                                if(err){
                                    error = 'Enable to update your profile. Please contact the admin for further assistant...';
                                    urlMessage = encodeURIComponent(error);
                                    res.redirect(`/auth/update-profile-form?error=${urlMessage}`);
                                }
                                else{
                                    req.session.user.firstName = firstName;
                                    req.session.user.lastName = lastName;
                                    req.session.user.email = email;
                                    req.session.user.phone = phone;
                                    success = 'Your profile has been updated....';
                                    urlMessage = encodeURIComponent(success);
                                    res.redirect(`/auth/update-profile-form?success=${urlMessage}`);
                                }
                            });
                        }
                        else{
                            photo = req.files.photo;
                            uploadPath = path.join(__dirname ,`../../public/upload/users/${req.session.user.id}/${photo.name}`);
                            if(req.session.user.photo){
                                const imagePath = path.join(__dirname ,`../../public/upload/users/${req.session.user.id}/${req.session.user.photo}`);
                                try {
                                    fs.unlinkSync(imagePath)
                                    //file removed
                                } 
                                catch(err) {
                                    throw err;
                                }
                            }
                            photo.mv(uploadPath,(err)=>{
                                if(err){
                                    con.release();
                                    throw err;
                                }
                                con.query(userQuery.updateProfileWithPhoto,[firstName,lastName,email,phone,photo.name,req.session.user.id,userId],(err,result)=>{
                                    con.release();
                                    if(err){
                                        error = 'Enable to update your profile. Please contact the admin for further assistant...';
                                        urlMessage = encodeURIComponent(error);
                                        res.redirect(`/auth/update-profile-form?error=${urlMessage}`);
                                    }
                                    else{
                                        req.session.user.firstName = firstName;
                                        req.session.user.lastName = lastName;
                                        req.session.user.email = email;
                                        req.session.user.phone = phone;
                                        req.session.user.photo = photo.name;
                                        success = 'Your profile has been updated....';
                                        urlMessage = encodeURIComponent(success);
                                        res.redirect(`/auth/update-profile-form?success=${urlMessage}`);
                                    }
                                });
                            });
                        }
                    }
                    else{
                        con.release();
                        error = `Email address ${email} already exist..`;
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/update-profile-form?error=${urlMessage}`);
                    }
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const apiCreate = async (req,res) => {
    const {
        firstName,
        lastName,
        email,
        status,
        phone,
        password,
        createdBy
    } = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;
        con.query(userQuery.create,[firstName,lastName,email,status,hashPassword,phone,createdBy],(err,result)=>{
            con.release();
            if(err) throw err;
            else{
                try{
                    let newFolder = path.join(__dirname ,`../../public/upload/users/${result.insertId}`);
                    fs.mkdir(newFolder,(folder)=>{
                        console.log('user folder created');
                    });
                }
                catch(err){
                    throw err;
                }
                res.status(200).json({ message : 'successful'});
            }
        });
    });
}

const changeUserPasswordForm = (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            let userId = req.params.id;
            //get database connection
            pool.getConnection((err,con)=>{
                if(err) throw err;
                con.query(userQuery.getById,[userId],(err,userInfo)=>{
                    con.release();
                    if(err) throw err;
                    
                    res.render('change-user-password',{
                        title : 'Change User Password',
                        error : req.query.error,
                        success : req.query.success,
                        user : req.session.user,
                        isTable : false,
                        userInfo : userInfo[0]
                    });
                });
            });
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}

const changeUserPassword = async (req,res) =>{
    if(req.session.user){
        if(req.session.user.isAdmin || req.session.user.isSuperAdmin){
            const {
                userId,
                password,
                confirmPassword,
                email
            } = req.body;

            //check if password and confirm password match
            if(password === confirmPassword){
                const hashPassword = await bcrypt.hash(password,10);
                //get database connection
                pool.getConnection((err,con)=>{
                    if(err) throw err;
                    //update user password
                    con.query(userQuery.changePassword,[hashPassword,userId],(err,result)=>{
                        con.release();
                        if(err){
                            error = 'Enable to change user password. Please contact the admin for further assistance.';
                            urlMessage = encodeURIComponent(error);
                            res.redirect(`/auth/change-user-password-form/${userId}?error=${urlMessage}`);
                        }
                        else{
                            success = 'User password has been updated....';
                            urlMessage = encodeURIComponent(success);
                            res.redirect(`/auth/change-user-password-form/${userId}?success=${urlMessage}`);
                        }
                    });
                });
            }
            else{
                error = "Password and confirm password does not match...";
                urlMessage = encodeURIComponent(error);
                res.redirect(`/auth/change-user-password-form/${userId}?error=${urlMessage}`);
            }
        }
        else res.redirect('/auth/forbidden');
    }
    else res.redirect('/auth/session-expired');
}


module.exports = { 
    create,
    loginForm,
    dashboard,
    login,
    logout,
    all,
    createForm,
    remove,
    editUserForm,
    editUser,
    view,
    changePasswordForm,
    changePassword,
    updateProfileForm,
    updateProfile,
    apiCreate,
    changeUserPasswordForm,
    changeUserPassword
};