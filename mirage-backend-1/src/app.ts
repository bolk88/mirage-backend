import express from 'express';
import { json } from 'body-parser';
import { setUserRoutes } from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
setUserRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});