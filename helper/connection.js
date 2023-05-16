import NodeCouchdb from "node-couchdb";

const dbConnect = () => {
  return new NodeCouchdb({
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    protocol: process.env.COUCHDB_PROTOCOL,
    auth: {
      user: process.env.COUCHDB_USER,
      pass: process.env.COUCHDB_PASS,
    },
  });
};

export default dbConnect;
