const express = require('express');
const path = require('path');
const router = express.Router();
const { readJson, writeJson } = require("../utils/util");

const DATA_FILE = path.join(__dirname, '../data/tasks.json');



router.post('/update-workflow-slugs', (req, res) => {
    const { updates } = req.body;

    let data = readJson(DATA_FILE);

    for (const [taskSlug, workflowSlug] of Object.entries(updates)) {
        if (!data[taskSlug]) continue;

        data[taskSlug].meta = data[taskSlug].meta || {};
        data[taskSlug].meta.workflowSlug = workflowSlug;
    }

    writeJson(DATA_FILE, data);

    res.json({ success: true });
});

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

        const workflowSlug =
            meta?.workflowSlug ||
            data[slug]?.meta?.workflowSlug ||
            'default';

        const updatedMeta = {
            ...meta,
            workflowSlug
        };

        if (changeSlug) {
            if (data[newSlug]) {
                let counter = 1;
                let uniqueSlug = `${newSlug}-${counter}`;

                while (data[uniqueSlug]) {
                    counter++;
                    uniqueSlug = `${newSlug}-${counter}`;
                }

                data[uniqueSlug] = { ...data[slug], meta: updatedMeta, blockContent };

                delete data[slug];
                slug = uniqueSlug;
            } else {
                data[newSlug] = { ...data[slug], meta: updatedMeta, blockContent };
                delete data[slug];
                slug = newSlug;
            }
        } else {
            if (data[slug]) {
                if (data[slug].meta.orgId !== meta.orgId) {
                    return res.status(403).json({ error: 'Dieser Slug gehört nicht zu dieser Organisation' });
                }
            }
            data[slug] = { ...data[slug], meta: updatedMeta, blockContent };
        }

        writeJson(DATA_FILE, data);

        res.status(200).json({ success: true, slug });
    } catch (err) {
        console.error('Fehler beim Speichern:', err);
        res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
    }
});

router.post('/:slug/volunteers', (req, res) => {
    const { slug } = req.params;
    const { volunteers } = req.body;

    try {
        const data = readJson(DATA_FILE);

        if (!data[slug]) {
            return res.status(404).json({ error: `Task '${slug}' nicht gefunden` });
        }

        const current = data[slug].assignedVolunteers || [];

        const newVolunteers = Array.isArray(volunteers) ? volunteers : [volunteers];

        data[slug].assignedVolunteers = [
            ...new Set([...current, ...newVolunteers])
        ];

        writeJson(DATA_FILE, data);

        res.json({
            success: true,
            volunteers: data[slug].assignedVolunteers
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Hinzufügen der Volunteers' });
    }
});



router.get('/', (req, res) => {
    try {
        const data = readJson(DATA_FILE);

        res.status(200).json(data);
    } catch (err) {
        console.error('Fehler beim Laden:', err);
        res.status(500).json({ error: 'Fehler beim Laden der Aufgabe' });
    }
});

router.get('/:identifier', (req, res) => {
    const { identifier } = req.params;

    try {
        const data = readJson(DATA_FILE);

        if (data[identifier]) {
            return res.status(200).json(data[identifier]);
        }

        const filteredTasks = Object.entries(data).reduce((acc, [slug, task]) => {
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

router.get('/:slug/volunteers', (req, res) => {
    const { slug } = req.params;

    try {
        const data = readJson(DATA_FILE);

        if (!data[slug]) {
            return res.status(404).json({ error: `Task '${slug}' nicht gefunden` });
        }

        const assigned = data[slug].assignedVolunteers || [];

        res.status(200).json(assigned);
    } catch (err) {
        console.error('Fehler beim Lesen:', err);
        res.status(500).json({ error: 'Fehler beim Laden der Volunteers' });
    }
});



router.patch('/:slug/block-content', (req, res) => {
    const { slug } = req.params;
    const { blockContent } = req.body;

    if (!blockContent) {
        return res.status(400).json({ error: 'blockContent ist erforderlich' });
    }

    try {
        const data = readJson(DATA_FILE);

        if (!data[slug]) {
            return res.status(404).json({ error: `Task '${slug}' nicht gefunden` });
        }

        data[slug].blockContent = blockContent;

        writeJson(DATA_FILE, data);

        res.status(200).json({
            success: true,
            message: 'blockContent erfolgreich aktualisiert'
        });

    } catch (err) {
        console.error('Fehler beim Aktualisieren von blockContent:', err);
        res.status(500).json({ error: 'Fehler beim Speichern der Daten' });
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

router.delete('/:slug/volunteers', (req, res) => {
    const { slug } = req.params;
    const { volunteers } = req.body;

    try {
        const data = readJson(DATA_FILE);

        if (!data[slug]) {
            return res.status(404).json({ error: `Task '${slug}' nicht gefunden` });
        }

        const remove = Array.isArray(volunteers) ? volunteers : [volunteers];

        data[slug].assignedVolunteers =
            (data[slug].assignedVolunteers || [])
                .filter(v => !remove.includes(v));

        writeJson(DATA_FILE, data);

        res.json({
            success: true,
            volunteers: data[slug].assignedVolunteers
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fehler beim Entfernen der Volunteers' });
    }
});

module.exports = router;