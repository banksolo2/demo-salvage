const mysql = require('mysql');
const {pool} = require('../database/connect');
const itemQuery = require('../database/query/item');

const setPages = ()=>{
    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;

        //get reset page
        con.query(itemQuery.resetPage,(err,resetPage)=>{
            if(err){
                con.release();
                throw err;
            }
            else{
                //get items
                con.query(itemQuery.getPages,(err,pages)=>{
                    if(err){
                        con.release();
                        throw err;
                    }
                    else{
                        let pageNo = 1;
                        let count = 0;
                        console.log(pages);
                        for(let page of pages){
                           
                            if(count === 6){
                                pageNo += 1;
                                console.log(pageNo);
                            }
                            con.query(itemQuery.updatePage,[pageNo,page.item_id],(err,result)=>{
                                if(err) throw err;

                            });
                            count += 1;
                        }
                        con.release();
                    }
                });
            }
        });
    });
}



module.exports = {
    setPages
}