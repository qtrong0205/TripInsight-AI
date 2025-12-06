import app from "./app";
import { env } from "./config/env";

const port = env.port

app.listen(3000, () => {
    console.log("Server đang chạy trên port", port)
})