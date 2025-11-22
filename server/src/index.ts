import { server, app } from './server'
import mongoose from 'mongoose';

const PORT = process.env.PORT;

async function startServer() {
    try {

        await mongoose.connect(process.env.MONGO_URI || '')
        console.log('Database connected');

        server.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);

        })

    }
    catch (err) {
        console.error("Failed to start the server", err);
        process.exit(1);
    }
}


startServer();
