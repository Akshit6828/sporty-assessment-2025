import "./league-card.scss";

interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  onCardClick: (league: any) => void;
}

interface LeagueCardProps {
  league: League;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  return (
    <div className="league-card" onClick={() => league.onCardClick(league)}>
      <div className="league-details">
        <h3 className="league-name">{league.strLeague}</h3>
        <span className="alt-name">{league.strLeagueAlternate || ""}</span>
      </div>
      <span className="sport">{league.strSport} 🏅</span>
    </div>
  );
}
