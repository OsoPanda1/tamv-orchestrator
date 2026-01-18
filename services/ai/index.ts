import Fastify from "fastify";

const app = Fastify();

app.get("/health", async () => {
  return { state: "operational", model: "DM-X4 Quantum" };
});

app.listen({ port: 8000, host: "0.0.0.0" });
