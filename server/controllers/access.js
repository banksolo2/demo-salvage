
const forbidden = (req,res) =>{
    if(req.session.user){
        res.render('403',{
            title : "Unauthorised Page",
            layout : './layouts/access'
        });
    }
    else res.redirect('/auth/session-expired');
}

module.exports = {forbidden};