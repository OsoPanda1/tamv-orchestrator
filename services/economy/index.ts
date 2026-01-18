import Fastify from "fastify";

const app = Fastify();

let balance = 1000; // valor inicial de ejemplo

app.get("/balance", async () => {
  return { balance };
});

app.listen({ port: 8000, host: "0.0.0.0" });
