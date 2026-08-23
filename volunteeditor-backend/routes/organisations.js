const path = require('path');
const express = require('express');
const { readJson, writeJson} = require("../utils/util");
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/organisations.json');
const TASKS_FILE = path.join(__dirname, '../data/tasks.json');

const buildTaskCountMap = () => {
    const tasks = readJson(TASKS_FILE);
    const map = {};

    Object.values(tasks).forEach(task => {
        const orgId = task.meta?.orgId;
        if (!orgId) return;

        map[orgId] = (map[orgId] || 0) + 1;
    });

    return map;
};



router.post('/:orgId', (req, res) => {
    const { orgId } = req.params;
    const { logo, description } = req.body;

    const data = readJson(DATA_FILE);

    data[orgId] = {
        ...(data[orgId] || {}),
        ...(logo !== undefined && { logo }),
        ...(description !== undefined && { description }),
    };

    const success = writeJson(DATA_FILE, data);

    if (!success) {
        return res.status(500).json({ error: 'Fehler beim Speichern der Organisationsdaten' });
    }

    return res.status(200).json({ success: true });
});



router.get('/', (req, res) => {
    try {
        const { withTaskCount } = req.query;
        const organisations = readJson(DATA_FILE);

        let taskCountMap = {};

        if (withTaskCount === 'true') {
            taskCountMap = buildTaskCountMap();
        }

        const enriched = Object.entries(organisations).map(([orgId, org]) => ({
            id: orgId,
            ...org,
            ...(withTaskCount === 'true' && {
                taskCount: taskCountMap[orgId] || 0
            })
        }));

        res.status(200).json(enriched);
    } catch (err) {
        console.error('Fehler beim Laden:', err);
        res.status(500).json({ error: 'Fehler beim Laden der Organisationen' });
    }
});

router.get('/:identifier', (req, res) => {
    const { identifier } = req.params;
    const { withTaskCount } = req.query;

    const organisations = readJson(DATA_FILE);

    let orgId = null;
    let organisation = null;

    if (organisations[identifier]) {
        orgId = identifier;
        organisation = organisations[identifier];
    } else {
        const entry = Object.entries(organisations).find(
            ([, org]) => org.slug === identifier
        );

        if (entry) {
            [orgId, organisation] = entry;
        }
    }

    if (!organisation) {
        return res.status(404).json({ error: 'Keine Daten für diese Organisation gefunden' });
    }

    if (withTaskCount === 'true') {
        const taskCountMap = buildTaskCountMap();
        return res.status(200).json({
            id: orgId,
            ...organisation,
            taskCount: taskCountMap[orgId] || 0
        });
    }

    return res.status(200).json({
        id: orgId,
        ...organisation
    });
});

module.exports = router;