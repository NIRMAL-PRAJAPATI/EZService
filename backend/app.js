express = require('express');
app = express();
cors = require("cors")

// middlewares
app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use(require("./middlewares/pagination"))

// Routes
app.use("/customer",require("./routes/customerInfoRoutes"));
app.use("/category",require("./routes/serviceCategoryRoutes"));
<<<<<<< HEAD
app.use("/services", require("./routes/serviceRoutes"));
=======
app.use("/template",require("./routes/categoryTemplateRoutes"))
>>>>>>> b0a8057302fef4acbbb604bb5fac0732aa9d6477

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
});