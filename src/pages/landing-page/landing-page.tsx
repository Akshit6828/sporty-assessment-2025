import { useEffect, useState } from "react";
import LeagueCard from "../../components/global/league-card/league-card";
import { fetchAllLeagues } from "../../services/main-service";
import "./landing-page.scss";
import Search from "../../components/global/search/search";
import Dropdown from "../../components/global/dropdown/dropdown";
interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export default function LandingPage() {
  const [allLeagues, setAllLeagues] = useState<League[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    getAllLeagues();
  }, []);

  const getAllLeagues = async () => {
    try {
      const data = await fetchAllLeagues();
      setAllLeagues(data.leagues || []);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    }
  };

  const onSearchChange = (searchText: string) => {
    setSearchText(searchText);
    if (searchText.length > 0) {
      const filteredLeagues = allLeagues.filter((league) =>
        league.strLeague.toLowerCase().includes(searchText.toLowerCase())
      );
      setAllLeagues(filteredLeagues);
    } else {
      getAllLeagues();
    }
  };

  const onDropdownSelected = (selected: any) => {
    setSelectedSport(selected);
  };

  return (
    <div>
      <div className="landing-page">
        <div className="landing-page-header">
          <Search
            value={searchText}
            onChange={onSearchChange}
            placeholder="Search Leagues.."
            width="60%"
          />
          <Dropdown
            width="35%"
            options={[
              { label: "All", value: "All" },
              {
                label: "Football",
                value: "Football",
              },
              {
                label: "Basketball",
                value: "Basketball",
              },
            ]}
            onChange={onDropdownSelected}
            placeholder="Select Sport"
            value={selectedSport}
          />
        </div>
        <div className="all-leagues-container">
          {allLeagues.length > 0 &&
            allLeagues.map((league: any) => {
              return (
                <LeagueCard
                  key={league.idLeague}
                  league={{
                    idLeague: league.idLeague,
                    strLeague: league.strLeague,
                    strSport: league.strSport,
                    strLeagueAlternate: league.strLeagueAlternate,
                    badgeUrl:
                      "https://www.thesportsdb.com/images/media/league/badge/xyz.png",
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
