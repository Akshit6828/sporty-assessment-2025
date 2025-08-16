import { useEffect, useState } from "react";
import LeagueCard from "../../components/global/league-card/league-card";
import {
  fetchAllLeagues,
  fetchAllSeasonByLeagueId,
} from "../../services/main-service";
import "./landing-page.scss";
import Search from "../../components/global/search/search";
import Dropdown, {
  type DropdownOption,
} from "../../components/global/dropdown/dropdown";
import NoData from "../../components/global/no-data/no-data";
import ViewSeasonModal from "./view-season-modal/view-season-modal";
import Loader from "../../components/global/loader/loader";
import { tr } from "framer-motion/client";
interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export default function LandingPage() {
  const [allLeagues, setAllLeagues] = useState<League[]>([]);
  const [dropdownData, setDropdownData] = useState<DropdownOption[]>([]);
  const [selectedSport, setSelectedSport] = useState<DropdownOption>({
    label: "",
    value: "",
  });
  const [searchText, setSearchText] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState<boolean>(true);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);

  const [showSeasonModal, setShowSeasonModal] = useState<boolean>(false);

  useEffect(() => {
    getAllLeagues();
  }, []);

  const getAllLeagues = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllLeagues();

      setAllLeagues(data.leagues || []);
      setDropdownData(getUniqueSports(data.leagues));
    } catch (error) {
      console.error("Error fetching leagues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueSports = (allLeagues: any): DropdownOption[] => {
    let sportsSet = new Set();

    allLeagues.forEach((league: any) => {
      sportsSet.add(league.strSport);
    });

    return [...sportsSet].map((item: any) => {
      return {
        label: item,
        value: item.toLowerCase(),
      };
    });
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

  const onLeagueCardClick = async (league: any) => {
    setShowSeasonModal(true);
    try {
      setIsLoadingSeasons(true);

      const res = await fetchAllSeasonByLeagueId(league?.idLeague);

      setSeasonDetails({
        ...league,
        ...res?.seasons?.[res.seasons.length - 1],
      });
    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setIsLoadingSeasons(false);
    }
  };

  console.log({
    seasonDetails,
  });

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
          options={dropdownData}
          onChange={onDropdownSelected}
          placeholder="Select Sport"
          value={selectedSport}
        />
      </div>
      <div className="all-leagues-container">
        {isLoading && <Loader />}
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
      {showSeasonModal && (
        <ViewSeasonModal
          seasonImg={seasonDetails?.strBadge}
          seasonName={seasonDetails?.strSeason}
          leagueName={seasonDetails?.strLeague}
          leagueAlternateName={seasonDetails?.strLeagueAlternate}
          sportName={seasonDetails?.strSport}
          isLoading={isLoadingSeasons}
          showModal={showSeasonModal}
          setShowModal={setShowSeasonModal}
        />
      )}
    </div>
  );
}
