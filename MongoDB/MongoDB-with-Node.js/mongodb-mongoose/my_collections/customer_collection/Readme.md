# Customer collection

## Files

- `addData.js` - adds data to the database. It also fabricates the database file if it doesn’t exist.
- `dbFileCheck.js` - confirms if the database file has been created.
- `query.js` - checks if a database exists and executes a function passed to it.
- `removeData.js` - removes selected data.
- `retrieveData.js` - fetches all data
- `updateData.js` - edits data.

# Check and Test MongoDB Connection

```js
// check and Test Connection
const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => console.log("Connected to MongoDB Atlas"));
```