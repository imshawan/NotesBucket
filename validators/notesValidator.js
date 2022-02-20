const fields = ['title', 'content']

exports.validateNotes = (req, res, next) => {
    let missingFields = []
    if (!req.body) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Request body cannot be blank' });
    }
    fields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field)
        }
    })
    if (missingFields.length) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Required file parameters were missing from this API call: ' + missingFields.join(', ') });
    }
    else { next(); }
}