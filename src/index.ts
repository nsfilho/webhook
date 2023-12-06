import { join } from 'path';
import { stat } from 'fs/promises';
import { spawn } from 'child_process';
import 'dotenv/config';
import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT, TOKEN, WORKSPACE } from './constants';

const logger = debug('core');
const app = express();

const validate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const [, token] = req.headers.authorization?.split(' ') || [];
    if (token !== TOKEN) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    next();
};

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(validate);

app.get('/:name', async (req, res) => {
    if (!/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/.test(req.params.name)) {
        res.status(400).json({ error: 'Invalid name' });
        return;
    }

    const filePath = join(WORKSPACE, req.params.name);

    try {
        const stats = await stat(filePath);
        if (!stats.isFile()) {
            res.status(404).json({ error: 'File not found' });
            return;
        }

        const outputs = {
            stdout: '',
            stderr: '',
        };

        const args = req.query.args
            ? (req.query.args as string).split(' ')
            : [];

        const file = spawn(filePath, args);
        file.stdout.on('data', (data) => {
            outputs.stdout += data.toString();
        });
        file.stderr.on('data', (data) => {
            outputs.stderr += data.toString();
        });

        file.on('close', (code) => {
            res.json({
                code,
                outputs,
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'File not found' });
    }
});

app.listen(PORT, () => {
    logger(`Server is listening on port ${PORT}`);
});
