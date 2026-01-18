import Fastify from "fastify";

const app = Fastify();

let height = 42; // bloque simulado

app.get("/height", async () => {
  return { height };
});

app.listen({ port: 8000, host: "0.0.0.0" });
