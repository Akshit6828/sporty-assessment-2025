import "./league-card.scss";

interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  badgeUrl?: string; // optional if you have the badge
}

interface LeagueCardProps {
  league: League;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  return (
    <div className="league-card">
      <div className="league-details">
        <h3 className="league-name">{league.strLeague}</h3>
        <span className="alt-name">{league.strLeagueAlternate || ""}</span>
      </div>
      <span className="sport">{league.strSport} 🏅</span>
    </div>
  );
}
