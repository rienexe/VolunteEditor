const express = require('express');
const path = require('path');
const router = express.Router();
const { readJson, writeJson } = require("../utils/util");

const DATA_FILE = path.join(__dirname, '../data/workflows.json');



router.post('/:slug', (req, res) => {
    let { slug } = req.params;
    const { meta, workflow, newSlug, changeSlug } = req.body;

    try {
        let data;

        try {
            data = readJson(DATA_FILE);
        } catch (parseErr) {
            console.error('Fehler beim Parsen:', parseErr);
            data = {};
        }

        if (changeSlug) {
            // Prüfen, ob der neue Slug bereits existiert
            if (data[newSlug]) {
                // Wenn der Slug existiert, zähle die vorhandenen Slugs und erstelle einen neuen mit einem Zähler
                let counter = 1;
                let uniqueSlug = `${newSlug}-${counter}`;

                // Solange der Slug existiert, erhöhe den Zähler und versuche es erneut
                while (data[uniqueSlug]) {
                    counter++;
                    uniqueSlug = `${newSlug}-${counter}`;
                }

                // Die alte Aufgabe wird mit dem neuen Slug aktualisiert
                data[uniqueSlug] = { ...data[slug], meta, workflow };
                delete data[slug]; // Den alten Slug löschen
                slug = uniqueSlug; // Den Slug im Request auf den neuen Wert setzen
            } else {
                // Die alte Aufgabe wird ohne Änderungen an den Slug gespeichert
                data[newSlug] = { ...data[slug], meta, workflow };
                delete data[slug]; // Den alten Slug löschen
                slug = newSlug; // Den Slug im Request auf den neuen Wert setzen
            }
        } else {
            // Wenn changeSlug nicht gesetzt ist, dann nur die bestehende Aufgabe aktualisieren
            if (data[slug]) {
                // Prüfen, ob die orgId übereinstimmt, wenn nötig
                if (data[slug].meta.orgId !== meta.orgId) {
                    return res.status(403).json({ error: 'Dieser Slug gehört nicht zu dieser Organisation' });
                }
            }
            data[slug] = { ...data[slug], meta, workflow };
        }

        // Speichern der geänderten oder neuen Aufgabe
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
        res.status(500).json({ error: 'Fehler beim Laden der Workflows' });
    }
});

router.get('/:identifier', (req, res) => {
    const { identifier } = req.params;

    try {
        const data = readJson(DATA_FILE);

        if (data[identifier]) { // identifier is slug
            return res.status(200).json(data[identifier]);
        }

        const filteredTasks = Object.entries(data).reduce((acc, [slug, task]) => {  // identifier is orgId
            if (task.meta?.orgId === identifier) {
                acc[slug] = task;
            }
            return acc;
        }, {});

        if (Object.keys(filteredTasks).length > 0) {
            return res.status(200).json(filteredTasks);
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