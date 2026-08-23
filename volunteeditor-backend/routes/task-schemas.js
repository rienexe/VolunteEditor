const express = require('express');
const path = require('path');
const router = express.Router();
const { readJson, writeJson } = require("../utils/util");

const DATA_FILE = path.join(__dirname, '../data/task-schemas.json');



router.post('/:slug', (req, res) => {
    let { slug } = req.params;
    const { meta, blockContent, newSlug, changeSlug } = req.body;

    try {
        let data;

        try {
            data = readJson(DATA_FILE);
        } catch (parseErr) {
            console.error('Fehler beim Parsen:', parseErr);
            data = {};
        }

        if (changeSlug) {
            if (data[newSlug]) {
                let counter = 1;
                let uniqueSlug = `${newSlug}-${counter}`;

                while (data[uniqueSlug]) {
                    counter++;
                    uniqueSlug = `${newSlug}-${counter}`;
                }

                data[uniqueSlug] = { ...data[slug], meta, blockContent };
                delete data[slug];
                slug = uniqueSlug;
            } else {
                data[newSlug] = { ...data[slug], meta, blockContent };
                delete data[slug];
                slug = newSlug;
            }
        } else {
            data[slug] = { ...data[slug], meta, blockContent };
        }

        writeJson(DATA_FILE, data);

        res.status(200).json({ success: true, slug });
    } catch (err) {
        console.error('Fehler beim Speichern:', err);
        res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
    }
});



router.get('/', (req, res) => {
    try {
        const data = readJson(DATA_FILE);

        res.status(200).json(data);
    } catch (err) {
        console.error('Fehler beim Laden:', err);
        res.status(500).json({ error: 'Fehler beim Laden des Schemas' });
    }
});

router.get('/:identifier', (req, res) => {
    const { identifier } = req.params;

    try {
        const data = readJson(DATA_FILE);

        if (data[identifier]) {
            return res.status(200).json(data[identifier]);
        }

        const filteredTaskSchemas = Object.entries(data).reduce((acc, [slug, schema]) => {
            if (schema.meta?.orgId === identifier) {
                acc[slug] = schema;
            }
            return acc;
        }, {});

        if (Object.keys(filteredTaskSchemas).length > 0) {
            return res.status(200).json(filteredTaskSchemas);
        }

        return res.status(404).json({ error: `Kein Eintrag für Identifier '${identifier}' gefunden.` });
    } catch (err) {
        console.error(`Fehler beim Verarbeiten von Identifier '${identifier}':`, err);
        res.status(500).json({ error: 'Fehler beim Laden der Daten' });
    }
});



router.delete('/:slug', (req, res) => {
    const { slug } = req.params;

    try {
        const data = readJson(DATA_FILE);

        if (!data[slug]) {
            return res.status(404).json({ error: `Eintrag mit Slug '${slug}' wurde nicht gefunden.` });
        }

        delete data[slug];

        writeJson(DATA_FILE, data);

        res.status(200).json({ success: true, message: `Eintrag wurde gelöscht.` });
    } catch (err) {
        console.error('Fehler beim Löschen:', err);
        res.status(500).json({ error: 'Fehler beim Löschen der Daten' });
    }
});

module.exports = router;