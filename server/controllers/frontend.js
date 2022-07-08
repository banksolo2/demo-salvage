const mysql = require('mysql');
const {pool} = require('../../database/connect');
const itemQuery = require('../../database/query/item');
const itemBackImageQuery = require('../../database/query/itemBackImage');
let message;
let urlMessage;
//How many post you want to show on a page
const resultsPerPage = 6;

/*
const home = (req,res)=>{
    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;

        con.query(itemQuery.frontPage,(err,items)=>{
            if(err){
                con.release();
                throw err;
            }

            const noOfResult = items.length;
            const noOfPages = Math.ceil(noOfResult / resultsPerPage);
            const page = req.query.page ? Number(req.query.page) : 1;
            if(page > noOfPages){
                urlMessage = encodeURIComponent(noOfPages);
                res.redirect(`/?page=${urlMessage}`);
            }
            else if(page < 1){
                urlMessage = encodeURIComponent('1');
                res.redirect(`/?page=${urlMessage}`);
            }

            //Determine the SQL Limit starting number
            const startingLimit = (page - 1) * resultsPerPage;
            con.query(itemQuery.sortPage,[startingLimit,resultsPerPage],(err, result)=>{
                con.release();
                if(err) throw err;

                let iterator = (page - 5) < 1 ? 1 : page - 5;
                let endingLink = (iterator + 9) <= noOfPages ? (iterator + 9) : page + (noOfPages - page);

                if(endingLink < (page + 4)){
                    iterator -= (page + 4) - noOfPages;
                }

                res.render('index',{
                    title : "Home Page",
                    layout : './layouts/frontend',
                    items : result,
                    success : req.query.success,
                    error : req.query.error,
                    page,
                    iterator,
                    endingLink,
                    noOfPages
                });

            });
            
        });
    });
}
*/

const home = (req,res)=>{
    let page = req.query.page;

    //get database connection
    pool.getConnection((err,con)=>{
        if(err) throw err;

        //get number of pages
        con.query(itemQuery.getNoOfPages,(err,noOfPages)=>{
            if(err){
                con.release();
                throw err;
            }
            else{
                if(page === undefined){
                    urlMessage = encodeURIComponent('1');
                    res.redirect(`/?page=${urlMessage}`);
                }
                else if(page > noOfPages[0]){
                    urlMessage = encodeURIComponent(noOfPages[0]);
                    res.redirect(`/?page=${urlMessage}`);
                }

                con.query(itemQuery.sortPage,[page],(err,items)=>{
                    con.release();
                    if(err) throw err;
                    const maxPageNo = (page + 9);

                    res.render('index',{
                        title : "Home Page",
                        layout : './layouts/frontend',
                        pageNo : items[0].page,
                        noOfPages : noOfPages[0],
                        items : items,
                        maxPageNo : maxPageNo
                    });
                });
            }
        });
    });

}


module.exports = {
    home
}