import express, { Request, Response } from 'express';

require('dotenv').config();
const cors = require('cors')
const db = require('./postgresConfig')

const app = express()

const corsOptions = {
    origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
        if (origin == "http://localhost:3000" || origin == "http://localhost:3001") {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};


app.use(express.json())
app.use(cors(corsOptions))


app.get('/realEstates', (req: Request, res: Response) => {
    db.pool.query(`SELECT * FROM public."RealEstates"`, (err: Error, results: any) => {
        if (err) res.send(err)
        if (results) res.json(results.rows)
    })
})

app.get('/stocks', (req: Request, res: Response) => {
    db.pool.query(`SELECT * FROM public."stocks"`, (err: Error, results: any) => {
        if (err) res.send(err)
        if (results) res.json(results.rows)
    })
})

app.post('/buyItem', async (req, res) => {
    const { text, email } = req.body;

    try {
        // Check if the column exists
        const columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'UserInfo' AND column_name = '${text}'
        );        
        `;

        const isExist = (await db.pool.query(columnExistsQuery)).rows[0].exists;

        if (!isExist) {
            // If the column does not exist, add it to the table with default value 1
            await db.pool.query(`
                ALTER TABLE "UserInfo" ADD COLUMN "${text}" INTEGER DEFAULT 1;
            `);
        } else {
            // If the column exists, increment its value by 1
            await db.pool.query(`
                UPDATE "UserInfo" SET "${text}" = "${text}" + 1 WHERE email = $1;
            `, [email]);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Error processing request:", error);
        res.sendStatus(500);
    }
});




app.listen(process.env.PORT || 3001, () => {
    console.log('connected')
})
