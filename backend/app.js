require('dotenv').config();
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
app.use("/services", require("./routes/serviceRoutes"));
app.use("/template",require("./routes/categoryTemplateRoutes"))
app.use("/reviews",require("./routes/serviceReviewRoutes"))
app.use("/orders",require("./routes/orderRoutes"))
app.use("/provider",require("./routes/providerInfoRoutes"))

// Utility
app.get("/user/city/get", require("./utilities/userLocation"))
app.use('/otp', require("./routes/otpRoutes"));

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000/");
});