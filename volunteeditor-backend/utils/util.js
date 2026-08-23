const fs = require('fs');

function readJson(filePath) {
    try {
        if (!fs.existsSync(filePath)) return {};
        const content = fs.readFileSync(filePath, 'utf8');
        return content ? JSON.parse(content) : {};
    } catch (err) {
        console.error(`Fehler beim Lesen von ${filePath}:`, err);
        return {};
    }
}

function writeJson(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`Fehler beim Schreiben von ${filePath}:`, err);
        return false;
    }
}

module.exports = { readJson, writeJson };
