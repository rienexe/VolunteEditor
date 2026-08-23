const path = require('path');
const express = require('express');
const { readJson } = require("../utils/util");
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json')



router.post('/login', (req, res) => {
    const { email, password, role } = req.body

    try {
        const usersData = readJson(USERS_FILE);

        if (role === 'organisation') {
            for (const org of usersData.organisations) {
                const user = org.users.find(u => u.email === email && u.password === password)
                if (user) {
                    return res.json({ success: true, role: 'organisation', id: org.id, name: user.name })
                }
            }
        } else if (role === 'volunteer') {
            const user = usersData.volunteers.find(u => u.email === email && u.password === password)
            if (user) {
                return res.json({ success: true, role: 'volunteer', id: user.id, name: user.name })
            }
        }

        res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' })
    } catch (error) {
        console.error('Fehler beim Lesen der Nutzerdaten:', error)
        res.status(500).json({ success: false, message: 'Serverfehler' })
    }
})

module.exports = router
