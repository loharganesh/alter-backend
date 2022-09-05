const sharp = require('sharp');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const morgan = require('morgan');
const { removeExtension } = require('./helpers/string');

const app = express();

const upload = multer();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
);

app.use(
    cors({
        origin: 'https://63161951ffd9447c03961d4e--resplendent-cannoli-2f15b4.netlify.app/',
    })
);

app.get('/', (req, res) => {
    res.status(200).send('Ok');
});
// Default Route
app.post('/', upload.array('files'), async (req, res) => {
    try {
        const { files } = req;

        const convertedToWebpFiles = [];

        for (let i = 0; i < files.length; i++) {
            const result = await sharp(files[i].buffer).webp().toBuffer();
            const base64Image = result.toString('base64');
            convertedToWebpFiles.push({
                name: removeExtension(files[i].originalname),
                base64Image,
            });
        }

        return res.status(200).send(JSON.stringify(convertedToWebpFiles));
    } catch (e) {
        return res.status(500).send('Internal Server Error');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server Started');
});
