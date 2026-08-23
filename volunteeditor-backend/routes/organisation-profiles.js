const path = require('path');
const express = require('express');
const { readJson, writeJson} = require("../utils/util");
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/organisation-profiles.json');
const ORGANISATIONS_FILE = path.join(__dirname, '../data/organisations.json');



router.post('/:orgId', (req, res) => {
    const { orgId } = req.params;
    const { blockContent } = req.body;

    if (!blockContent || !blockContent.main || !blockContent.sidebar) {
        return res.status(400).json({ error: 'Unvollständige Profildaten' });
    }

    const data = readJson(DATA_FILE);
    data[orgId] = { blockContent };

    const success = writeJson(DATA_FILE, data);

    if (!success) {
        return res.status(500).json({ error: 'Fehler beim Speichern der Profildaten' });
    }

    return res.status(200).json({ success: true, message: 'Profil gespeichert' });
});



router.get('/:identifier', (req, res) => {
    const { identifier } = req.params;

    const profiles = readJson(DATA_FILE);
    const organisations = readJson(ORGANISATIONS_FILE);

    if (profiles[identifier]) {
        return res.status(200).json(profiles[identifier]);
    }

    const matchedEntry = Object.entries(organisations).find(
        ([, org]) => org.slug === identifier
    );

    if (matchedEntry) {
        const [orgId] = matchedEntry;
        const profile = profiles[orgId];
        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(404).json({ error: 'Kein Profil für diese Organisation gefunden' });
});


module.exports = router;
