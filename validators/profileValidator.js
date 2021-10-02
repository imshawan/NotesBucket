exports.validateProfile = (req, res, next) => {
    if (!req.body.gender) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Gender cannot be blank' });
    }
    else if (!req.body.country) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Country cannot be blank' });
    }
    else if (!req.body.dob) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Date Of Birth cannot be blank' });
    }
    else if (!req.body.role) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Role cannot be blank' });
    }
    else { next(); }
}