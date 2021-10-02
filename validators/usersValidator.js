exports.signUpValidator = (req, res, next) => {
    if (!req.body.otp){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'OTP was not provided'})
      }
    else if (!req.body.email){
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, status: "Email cannot be empty"});
    }
    else if (!req.body.firstname) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, status: "Firstname cannot be empty"});
    }
    else if (req.body.lastname) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, status: "Lastname cannot be empty"});
    }
    else { next(); }
}