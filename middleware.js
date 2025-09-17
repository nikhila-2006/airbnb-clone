module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You mush be logged in to create listing!");
        return res.redirect('/login');
    }
    next();
}