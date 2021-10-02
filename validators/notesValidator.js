exports.validateNotes = (req, res, next) => {
    if (!req.body) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Request body cannot be blank' });
    }
    else if (!req.body.title) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Title cannot be blank' });
    }
    else if (!req.body.content) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: 'Content cannot be blank' });
    }
    else { next(); }
}