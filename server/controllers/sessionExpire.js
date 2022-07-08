let urlMessage = '';
let error = '';
let success = '';


const end = (req, res)=>{
    error = 'User session has expired...';
    urlMessage = encodeURIComponent(error);
    res.redirect(`/auth/login-form?error=${urlMessage}`);
};


module.exports = {end};