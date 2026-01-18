import Fastify from "fastify";

const app = Fastify();

app.get("/status", async () => {
  return {
    ai: await fetch("http://ai:8000/health").then(r => r.json()),
    economy: await fetch("http://economy:8000/balance").then(r => r.json()),
    blockchain: await fetch("http://blockchain:8000/height").then(r => r.json()),
  };
});

app.listen({ port: 8080, host: "0.0.0.0" });
