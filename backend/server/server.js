// ✅ server.js complet avec intégration des routes transaction
const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocs = yaml.load('./swagger.yaml');
const dbConnection = require('./database/connection');

// Chargement des variables d'environnement
dotEnv.config();

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3001;

// Connexion à la base de données
dbConnection();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Déclaration des routes API
app.use('/api/v1/user', userRoutes);
app.use('/api/v1', transactionRoutes);

// Documentation Swagger (accessible uniquement hors production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Route racine
app.get('/', (req, res) => {
  res.send('Hello from my Express server v2!');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});