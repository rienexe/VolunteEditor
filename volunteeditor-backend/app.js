const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const organisationRouter = require('./routes/organisations');
const organisationProfileRouter = require('./routes/organisation-profiles');
const taskRouter = require('./routes/tasks');
const taskSchemaRouter = require('./routes/task-schemas');
const workflowRouter = require('./routes/workflows');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/organisations', organisationRouter);
app.use('/api/organisations/profiles', organisationProfileRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/tasks/schemas', taskSchemaRouter);
app.use('/api/workflows', workflowRouter);
app.use('/api/auth', authRouter);

const UPLOAD_PATHS = {
    logo: path.join(__dirname, 'public/images/uploads/logos'),
    general: path.join(__dirname, 'public/images/uploads/general')
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let type = req.params.type ?? 'general';

        const dir = UPLOAD_PATHS[type];

        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

const handler = (req, res) => {

    let { type } = req.params;
    if (!type || !UPLOAD_PATHS[type]) {

        type = 'general';
    }
    const subfolder = type === 'logo' ? 'logos' : 'general';

    const urlPath = `/images/uploads/${subfolder}/${req.file.filename}`;

    res.status(200).json({
        success: 1,
        file: {
            url: `${req.protocol}://${req.get('host')}${urlPath}`
        }
    });

};

app.post('/upload', upload.single('image'), handler);
app.post('/upload/:type', upload.single('image'), handler);

app.get('/fetchUrl', (req, res) => {
    const { url } = req.query;

    if (!url) return res.json({ success: 0 });

    let domain;
    try {
        const parsedUrl = new URL(url);
        domain = parsedUrl.hostname;
    } catch (e) {
        domain = url;
    }

    res.json({
        success: 1,
        meta: {
            title: domain,
            description: `Vorschau für ${domain}`,
            image: {
                url: ""
            }
        }
    });
});

module.exports = app;
