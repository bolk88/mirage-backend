import pg from "pg";
const { Client } = pg;

const connectDB = async () => {
  const dbName = "mirage_store"; // ✅ Replace with your actual DB name
  const config = {
    user: "your_user",       // ✅ Replace with your DB username
    password: "your_password", // ✅ Replace with your DB password
    host: "localhost",
    port: 5432,
    database: "postgres",    // Connect to the default database first
  };

  const client = new Client(config);

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }
  } catch (error) {
    console.error("❌ Error checking or creating database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

export default connectDB;
