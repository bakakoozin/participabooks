import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import router from "./router/index.routes.js"

const PORT = process.env.PORT || 9000;
const HOST = process.env.DOMAIN || "localhost";
const base_url = "/api/v1";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["content-Type", "Accept"],
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/medias",
    express.static(path.join(process.cwd(), "public", "uploads", "medias"))
);
app.use(
    "/avatars",
    express.static(path.join(process.cwd(), "public", "uploads", "avatars"))
);

app.get("/", (_req, res) => {
    res.json({ msg: "API is running" });
});

app.use(base_url, router);

app.use((_err, _req, res, _next) => {
    res.status(500).json({
        msg: "Une erreur s'est produite. Veuillez réessayer plus tard.",
    });
    return;
});

app.listen(PORT, () => console.log(`running at http://${HOST}:${PORT}`));