[Link to app](https://airgreets-dev.herokuapp.com/#/client/20024)

# Stack

- Mongo/Mongoose
- Express 
- node >8
- Bootstrap v4 
- React
- Redux 
- Nodemailer 
- pug (templating for emails)
- pdfMake

# Run Project, 

- Add this to your bash profile and double check the path to the project matches and you have `npm install -g ttab` and have installed mongodb.

    `alias receipts_generator='cd ~/Desktop/Projects/airgreets-tool'`
    `alias receipts_generator_mongo='cd ~/Desktop/Projects/airgreets-tool && mongod'`
    `alias receipts_generator_server='cd ~/Desktop/Projects/airgreets-tool/server && nodemon server.js`
    `alias receipts_generator_client='cd ~/Desktop/Projects/airgreets-tool && npm start'`
    `alias receipts_generator_start='ttab receipts_generator_mongo && ttab receipts_generator_server && ttab receipts_generator_client'`


- `npm install` in root 
- `npm install` in ./server
- `receipts_generator_start`

# Back Ground.
Airbnb management company invoice generating tool. A user can upload transactions invoices, payslips or corrections that have occured that month. Each transaction is associated with a customer. A customer may have several transactions in a month. Invoices represent a request of payment for Airgreets from the client for management.  A payout represents airgreets paying out to the client revenues made for renting out the clients property. Corrections 
can be refunds to guests or deductions to payouts for any reason. 

Home page should be an overview of the clients and the total sum of their   invoices and corrections or their payouts and corrections. 
- One or a multiple clients should be able to be selected.
- pdf created 
- email generated.
- Each client should be able to be clicked on to reveal the record of their transactions and the clients profile. 
- There should be a drop down menu to select months and years of previous records.  
- There should also be a lock button to ensure once locked all transactions for that month are no longer editable. 
- Once the user is happy with the accounts for that month they can then lock the month. 
- At this point the invoice number for each client should be incremented by one. 
- Upload button to upload spreadsheets with transactions 
- Add button to add new clients.

Client Page, provides a profile of the client and a record of transactions. 
- These should all be editable until locked.  
- You should also be able to add a  transaction. 
- Totals for transactions are calculated at the bottom of the page and auto  update with editing. 


# Methodolgy.

Basic login using json webtokens to remember users.  Signup choose password and your automtically in. 

Upload spreadsheets uses 'xlsx' library, send a file blob from the client side once uploaded use the library to read the file and convert to JSON. Each line of the JSON represents a transaction which is associated with a client. 

Clients have an existing client number which is used as their id.  
Transactions are all given a UUID and a created timestamp they are also given a clientId. 

Check to see if client already exists if it does, adds a transaction id to the client's list of transactions or creates a new client and adds the transaction id to the clients list. 

Home pages view uses a get request that queries the database from 1st Month to the 1st of the next Month, for the selected Month, using the created field, to get the clients and their transactions. (problem; what if a client is created  3 months before? this should get all transactions by date but then return the clients based on the transactions returned not the clients). 

When locking the month a flag is added to every transaction created during that month and when these are loaded into the homepage these always change the lock icon to locked. 

Emails are setup to use a gmail account that has had its security lowered to allow nodemailer to send emails from the account. email and passwords are kept as environment variables.  

# Possible Improvements.

- Language file, one file where all strings are held and a functions is used with an argument that key that fetches the required string. 
- Date only formatted in presentation components and all dates saved as milliseconds. 
- Test cases for all endpoints and server side code.
- Remove create-react-scripts configure webpack correctly.   









