import app from "./app";
import { env } from "./config/env";

const port = env.port || 3000

app.listen(port, () => {
    console.log("Server đang chạy trên port", port)
})
