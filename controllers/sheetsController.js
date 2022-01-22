const { google } = require('googleapis');

const Sheets = {}
const sheetId = "16CMwnfxkas4YGqnpacgnLmifI1xv6vrS8TqPRRf8wPk";
const Auth = new google.auth.GoogleAuth({
    keyFile: 'sheets.json',
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

Sheets.get = (req, res, next) => {
    authenticate().then((googleSheet) => {
        googleSheet.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1'
        })
        .then((response) => {
            res.statusCode = response.status;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: response.status === 200, queries: response.data.values});
        })
        .catch((err) => {
            res.statusCode = 400;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: false, message: err.message});
        })
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-type', 'application/json');
        res.json({ success: false, message: err.message});
    })
}

Sheets.create = (req, res, next) => {
    const { name, email, message } = req.body;
    authenticate().then((googleSheet) => {
        googleSheet.sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [name, email, message]
                ]
            }
        })
        .then((response) => {
            let message = response.config ? (response.config.data.values.length !== 0 ? "We've received your response" : null) : null;
            res.statusCode = response.status;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: response.status === 200, message: message});
        })
        .catch((err) => {
            res.statusCode = 400;
            res.setHeader('Content-type', 'application/json');
            res.json({ success: false, message: err.message});
        })
    })
    .catch((err) => {
        res.statusCode = 400;
        res.setHeader('Content-type', 'application/json');
        res.json({ success: false, message: err.message});
    })
}

function authenticate () {
    return new Promise((resolve, reject) => {
        Auth.getClient()
        .then((Client) => {
            const sheets = google.sheets({
                version: 'v4',
                auth: Client
            });
            resolve({ sheets })
        })
        .catch((errors) => {
            reject(errors.message)
        })
    })
}

module.exports = Sheets;