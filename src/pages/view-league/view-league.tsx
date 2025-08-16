import { useLocation } from "react-router-dom";

export default function ViewLeague() {
  const location = useLocation();
  const { name } = location.state || {}; // fallback if state is undefined
  return (
    <div>
      <h1>View League Page of {name}</h1>
      <p>This is where you can view details about a specific league.</p>
      {/* Additional content and components for viewing a league can be added here */}
    </div>
  );
}
