const mysql = require('mysql');
require('dotenv').config();
const {pool} = require('../database/connect');
const roleQuery = require('../database/query/role');
const userRoleQuery = require('../database/query/userRole');


const isRole = (userId,roleCode) =>{
    //get database connection
    var result = '';
    pool.getConnection((err,con)=>{
        if(err) throw err;
        con.query(roleQuery.getBycode,[roleCode],(err,roleInfo)=>{
            if(err){
                con.release();
                throw err;
            }
            con.query(userRoleQuery.checkUserRoleExistCreate,[userId,roleInfo[0].role_id],(err,check)=>{
                con.release();
                if(err) throw err;
                else{
                    result = (check[0].counts === 1);

                    return result;
                }
            });
        });
    });
    
};

module.exports = {isRole};