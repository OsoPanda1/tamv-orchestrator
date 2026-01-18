import { useEffect, useState } from "react";

export default function DashboardView() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8080/status")
      .then(res => res.json())
      .then(setStatus);
  }, []);

  if (!status) return <p>Cargando...</p>;

  return (
    <div>
      <h1>TAMV Orchestrator</h1>
      <ul>
        <li>IA: {status.ai.state}</li>
        <li>Economía: {status.economy.balance}</li>
        <li>Blockchain altura: {status.blockchain.height}</li>
      </ul>
    </div>
  );
}
