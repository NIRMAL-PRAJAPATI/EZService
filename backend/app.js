express = require('express');
app = express();

app.use(express.json());

// Routes
app.use("/",require("./routes/customerInfoRoutes"));

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
});