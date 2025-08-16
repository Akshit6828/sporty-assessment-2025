import { useEffect, useState } from "react";
import LeagueCard from "../../components/global/league-card/league-card";
import { fetchAllLeagues } from "../../services/main-service";
import "./landing-page.scss";
import Search from "../../components/global/search/search";
import Dropdown from "../../components/global/dropdown/dropdown";
import { useNavigate } from "react-router-dom";
import NoData from "../../components/global/no-data/no-data";
interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export default function LandingPage() {
  const [allLeagues, setAllLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState({
    label: "",
    value: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getAllLeagues();
  }, []);

  const getAllLeagues = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllLeagues();
      setAllLeagues(data.leagues || []);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      setIsLoading(false);
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

  const onLeagueCardClick = (league: any) => {
    navigate(`/view-league/${league.idLeague}`, {
      state: {
        name: league.strLeague,
      },
    });
  };

  return (
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
        {isLoading && (
          <div className="loading-container">
            <img
              className="loader-icon"
              src="assets/icons/loader-icon.svg"
              width={"64px"}
              height={"64px"}
            />
          </div>
        )}
        {!isLoading &&
          (allLeagues.length > 0 ? (
            allLeagues?.map((league: any) => {
              return (
                <LeagueCard
                  key={league.idLeague}
                  league={{
                    idLeague: league.idLeague,
                    strLeague: league.strLeague,
                    strSport: league.strSport,
                    strLeagueAlternate: league.strLeagueAlternate,
                    onCardClick: onLeagueCardClick,
                  }}
                />
              );
            })
          ) : (
            <NoData />
          ))}
      </div>
    </div>
  );
}
