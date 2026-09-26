import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

const listen = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
});
