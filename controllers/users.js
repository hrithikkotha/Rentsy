const User = require("../models/user.js");

module.exports.renderSignUpForm=(req, res) => {
    res.render("users/signup.ejs")
};

module.exports.signUp=async (req, res) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }

            req.flash("success","Welcome to Rentsy");
            res.redirect("/listings");
        })
        
    } catch (e) {

        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.logIn=async (req, res) => {
    req.flash("success","Welcome to Rentsy")
    if(res.locals.redirectUrl)
    {
    return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
};

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
        next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};