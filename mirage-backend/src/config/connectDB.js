import pg from "pg";
const { Client } = pg;

const connectDB = async () => {
  const dbName = "mirage";
  const config = {
    user: "postgres",
    password: "asd",
    host: "localhost",
    port: 5432,
    database: "template1", // connect to default DB first
  };

  const client = new Client(config);

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

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
