exports.signUpValidator = (req, res, next) => {
    if (!req.body.otp){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'OTP was not provided'})
      }
    else if (!req.body.email){
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, message: "Email cannot be empty"});
    }
    else if (!req.body.firstname) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, message: "Firstname cannot be empty"});
    }
    else if (!req.body.lastname) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, message: "Lastname cannot be empty"});
    }
    else if (!req.body.acceptedTerms) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.json({success: false, message: "User must accept the Privacy Policy and the Terms and conditions"});
    }
    else { next(); }
}