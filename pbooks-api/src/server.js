import "dotenv/config"; // Charge les variables d'environnement depuis un fichier .env
import cors from "cors"; // Middleware pour gérer les politiques CORS
import express from "express"; // Framework pour créer le serveur HTTP
import cookieParser from "cookie-parser"; // Middleware pour parser les cookies
import path from "path"; // Module pour gérer les chemins de fichiers

import router from "./router/index.routes.js" // Importation des routes principales

const PORT = process.env.PORT || 9000; // Port sur lequel le serveur écoute (par défaut : 9000)
const HOST = process.env.DOMAIN || "localhost"; // Domaine ou adresse IP du serveur (par défaut : localhost)
const base_url = "/api/v1"; // Préfixe de base pour toutes les routes de l'API

const app = express(); // Initialise une application Express

//============================== MIDDLEWARES ===================================//

// Configuration de CORS pour autoriser les requêtes provenant du client
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept", "Authorization", "Cookie"],
        exposedHeaders: ["set-cookie"],
    })
);

app.use(cookieParser()); // Parse les cookies des requêtes entrantes
app.use(express.json()); // Parse les corps des requêtes au format JSON
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques pour les médias
app.use(
    "/medias",
    express.static(path.join(process.cwd(), "public", "uploads", "medias"))
);

// Servir les fichiers statiques pour les avatars
app.use(
    "/avatars",
    express.static(path.join(process.cwd(), "public", "uploads", "avatars"))
);

//============================== ROUTES ========================================//

// Route de base pour vérifier si l'API est en cours d'exécution
app.get("/", (_req, res) => {
    res.json({ msg: "API is running" }); // Retourne un message de confirmation
});

// Utilisation des routes principales avec le préfixe défini
app.use(base_url, router);

//============================== GESTION DES ERREURS ===========================//

// Middleware pour gérer les erreurs globales
app.use((_err, _req, res, _next) => {
    res.status(500).json({
        msg: "Une erreur s'est produite. Veuillez réessayer plus tard.", // Message d'erreur générique
    });
    return;
});

//============================== LANCEMENT DU SERVEUR ==========================//

// Démarre le serveur et écoute sur le port spécifié
app.listen(PORT, () => console.log(`running at http://${HOST}:${PORT}`));