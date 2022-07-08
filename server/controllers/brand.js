const mysql = require('mysql');
const {pool} = require('../../database/connect');
const brandQuery = require('../../database/query/brand');
let success;
let error;
let urlMessage;

const all = (req,res) => {
    if(req.session.user){
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(brandQuery.all,(err,brands)=>{
                con.release();
                if(err) throw err;

                res.render('all-brands', {
                    title : 'All Brands',
                    user : req.session.user,
                    isTable : true,
                    brands : brands,
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const createForm = (req,res) =>{
    if(req.session.user){
        res.render('create-brand',{
            title : 'Create Brand',
            user : req.session.user,
            isTable : false,
            success : req.query.success,
            error : req.query.error
        });
    }
    else res.redirect('/auth/session-expired');
}

const create =  (req,res) => {
    if(req.session.user){
        const name = req.body.name.trim();
        const createdBy = req.session.user.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //check if name already exist
            con.query(brandQuery.isNameExist,[name],(err,checkName)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkName[0].counts === 0){
                        con.query(brandQuery.create,[name,createdBy],(err,result)=>{
                            con.release();
                            if(err){
                                error = `Enable to create brand. Please contact the admin for further assistance.`;
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/create-brand-form?error=${urlMessage}`);
                            }
                            else{
                                success = 'Brand has been created..';
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/create-brand-form?success=${urlMessage}`);
                            }
                        });
                    }
                    else{
                        con.release();
                        error = `Brand name ${name} already exist...`;
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/create-brand-form?error=${urlMessage}`);
                    }
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const editForm = (req,res)=>{
    if(req.session.user){
        const id = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(brandQuery.getById,[id],(err,brand)=>{
                con.release();
                if(err) throw err;

                res.render('edit-brand',{
                    title : 'Edit Brand',
                    user : req.session.user,
                    isTable : false,
                    brand : brand[0],
                    success : req.query.success,
                    error : req.query.error
                });
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const edit = (req,res) => {
    if(req.session.user){
        const {
            brandId,
            name
        } = req.body;
        const updatedBy = req.session.user.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            //check if name already exist
            con.query(brandQuery.isNameExistOnUpdate,[brandId,name.trim()],(err,checkName)=>{
                if(err){
                    con.release();
                    throw err;
                }
                else{
                    if(checkName[0].counts === 0){
                        con.query(brandQuery.update,[name,updatedBy,brandId],(err,result)=>{
                            con.release();
                            if(err){
                                error = `Enable to update brand. Please contact the admin for further assistance.`;
                                urlMessage = encodeURIComponent(error);
                                res.redirect(`/auth/edit-brand-form/${brandId}?error=${urlMessage}`);
                            }
                            else{
                                success = `Brand has been updated..`;
                                urlMessage = encodeURIComponent(success);
                                res.redirect(`/auth/edit-brand-form/${brandId}?success=${urlMessage}`);
                            }
                        });
                    }
                    else{
                        con.release();
                        error = `Brand name ${name} already exist...`;
                        urlMessage = encodeURIComponent(error);
                        res.redirect(`/auth/edit-brand-form/${brandId}?error=${urlMessage}`);
                    }
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const remove = (req,res) =>{
    if(req.session.user){
        const id = req.params.id;

        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(brandQuery.remove,[id],(err,result)=>{
                con.release();
                if(err){
                    error = 'Enable to delete brand. Please contact the admin for further assistance.';
                    urlMessage = encodeURIComponent(error);
                    res.redirect(`/auth/all-brands?error=${urlMessage}`);
                }
                else{
                    success = 'Brand has been deleted..';
                    urlMessage = encodeURIComponent(success);
                    res.redirect(`/auth/all-brands?success=${urlMessage}`);
                }
            });
        });
    }
    else res.redirect('/auth/session-expired');
}

const view = (req,res) => {
    if(req.session.user){
        const id = req.params.id;
        //get database connection
        pool.getConnection((err,con)=>{
            if(err) throw err;

            con.query(brandQuery.view,[id],(err,brand)=>{
                con.release();
                if(err) throw err;

                res.render('view-brand',{
                    title : 'View Brand',
                    user : req.session.user,
                    isTable : false,
                    result : brand[0]
                });
            });
        });
    }
    else res.redirect('/auth/session-expired')
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