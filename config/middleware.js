//it fetches everything from request flash and puts it into locals
module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error' : req.flash('error')
    }

    next();
}