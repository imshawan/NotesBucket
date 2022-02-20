# NotesBucket
Welcome to NotesBucket's Backend repository. NotesBucket is an open-source notes/document writing application inspired from various note taking applications. 
[View NotesBucket Frontend](https://github.com/imshawan/notesbucket-client)

## Running it locally
1. Clone this repo and do `npm install`
2. Create a new configuration file i.e. `config.js` at root folder
### config.js
```js
module.exports = {
    'secretKey': 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    //Session expiration time for JWT
    'expiresIn': 86400000, // 24hrs

    //MongoDB Connector
    'mongoUrl' : 'mongodb+srv://somecluster.jufi.mongodb.net/dbName',
    'mongoUser': 'username',
    'mongoPass': 'password',
    'dbname': 'NotesBucketDB', // Optional

    //Mongoose Field Encryption Secret
    'secretString': 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',

    // For emails
    'smtpType': 'sendgrid' // or gmail

    // For gmail use the gmail credentials if 'smtpType' is gmail or leave it empty
    'user': 'example@somemail.com',
    'pass': 'password',

    // For Sendgrid use the sendgrid API key if 'smtpType' is sendgrid or leave it empty
    'sendgridAPI': 'YOUR SENDGRID API KEY HERE',
}
```

3. For storing queries/feedbacks from users, the App uses google-sheets API. For using that you need to create a service account from google developer console. You'll get a json file with credentials after a successful creation of service account.
4. Rename the credentials file to `sheets.json` and move it to the root folder of the App.
5. You can start the server by `npm start`
