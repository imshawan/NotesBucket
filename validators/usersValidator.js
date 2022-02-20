const fields = ['otp', 'email', 'firstname', 'lastname', 'username' ]

function validateEmail (email) {
    if (email.length < 12) return false
    filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(email)
  }

exports.signUpValidator = (req, res, next) => {
    let missingFields = []
    fields.forEach((elem) => {
        if (!req.body[elem]) {
            missingFields.push(elem)
        }
    })

    if (missingFields !== [] && missingFields.length) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Required file parameters were missing from this API call: ' + missingFields.join(', ') })
    }

    else if (!validateEmail(req.body.email)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: "Not an valid email, please try again with a different one"})
    }

    else if (!req.body.acceptedTerms) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: "Cannot not proceed without confirming terms and policies"})
    }

    else if (req.body.firstname.length < 3 || req.body.lastname.length < 3) { 
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: "firstname and lastname must be atleast 3 characters long"})
    }
    else if (req.body.username.length < 4) { 
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: "username must be atleast 4 characters long"})
    }
    else {
        next()
    }

}