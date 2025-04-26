express = require('express');
app = express();
cors = require("cors")
app.use(express.json());
app.use(cors({
    origin: "*"
}))

// Routes
app.use("/customer",require("./routes/customerInfoRoutes"));
app.use("/category",require("./routes/serviceCategoryRoutes"));

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
});