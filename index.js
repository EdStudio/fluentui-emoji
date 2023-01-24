const mysql = require('mysql');
const fs = require('fs');

// Créé un dossier path à la racine du projet si il n'existe pas
if (!fs.existsSync('./path')) {
    fs.mkdirSync('./path');
}

// Vérifie si le dossier n'est vide
if (fs.readdirSync('./path').length > 0) {
    // met un message d'erreur
    console.log('Le dossier path n\'est vide');
    // Quitte le script
    process.exit(1);
}

// Créé une connexion à la base de données
const con = mysql.createConnection({
    host: 'localhost',
    user: 'enzo',
    password: 'enzo',
    database: 'edtchat',
});

// Se connecte à la base de données
con.connect(err => {
    if (err) throw err;
    
    console.log('Connecté à la base de données');
    
    // Pour chaque dossier dans le dossier assets
    fs.readdirSync('./assets').forEach(folder => {
        // Vérifie si le dossier contient le dossier 3D
        if (fs.existsSync(`./assets/${folder}/3D`)) {
            // Récupère le nom du fichier 
            const fileName = fs.readdirSync(`./assets/${folder}/3D`)[0];
            //console.log(fileName);

            // lit le fichier assets/${folder}/metadata.json
            fs.readFile(`./assets/${folder}/metadata.json`, (err, data) => {
                if (err) throw err;

                // Parse le fichier
                const metadata = JSON.parse(data);

                console.log(metadata);

                // remplace les caractères spéciaux par des _
                let name = metadata.cldr.replace(/[^a-zA-Z0-9]/g, '_');
                let glyph = metadata.glyph;
                let tags = metadata.keywords.join(';');

                console.log(name);
                console.log(glyph);
                console.log(tags);

                // Créé une requête pour insérer les données dans la base de données
                const sql = `INSERT INTO emoji (name, glyph, tags, path) VALUES ('${name}', '${glyph}', '${tags}', '${folder}/${fileName}')`;

                // Exécute la requête SQL
                con.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log('1 record inserted');
                });
            });
        }
    });
});

