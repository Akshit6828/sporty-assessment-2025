import { useEffect, useMemo, useState } from "react";
import LeagueCard from "../../components/global/league-card/league-card";
import {
  fetchAllLeagues,
  fetchAllSeasonByLeagueId,
} from "../../services/landing-page-service";
import "./landing-page.scss";
import Search from "../../components/global/search/search";
import Dropdown, {
  type DropdownOption,
} from "../../components/global/dropdown/dropdown";
import NoData from "../../components/global/no-data/no-data";
import ViewSeasonModal from "./view-season-modal/view-season-modal";
import Loader from "../../components/global/loader/loader";
import { useQueryClient } from "@tanstack/react-query";
interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
}

export default function LandingPage() {
  // Data states
  const [allLeagues, setAllLeagues] = useState<League[]>([]);
  const [dropdownData, setDropdownData] = useState<DropdownOption[]>([]);
  const [selectedSport, setSelectedSport] = useState<DropdownOption>({
    label: "",
    value: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [seasonDetails, setSeasonDetails] = useState<any>(null);

  // UI helper states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState<boolean>(true);
  const [showSeasonModal, setShowSeasonModal] = useState<boolean>(false);

  // React query states for caching used only in seasons api to fetch and cache image
  const queryClient = useQueryClient();

  // API Calls
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

  const fetchLeagueSeasonByID = async (league: Record<string, any>) => {
    try {
      setIsLoadingSeasons(true);
      const data = await queryClient.fetchQuery({
        queryKey: ["leagueSeasons", league.idLeague],
        queryFn: () => fetchAllSeasonByLeagueId(league.idLeague),
        staleTime: 5 * 60 * 1000, // 5 min cache valid
      });
      setSeasonDetails({
        ...league,
        ...data.seasons[data.seasons.length - 1],
      });
    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setIsLoadingSeasons(false);
    }
  };

  // Event handlers
  const onSearchChange = (searchText: string) => {
    setSearchText(searchText);
  };

  const onDropdownSelected = (selected: any) => {
    setSelectedSport(selected);
  };
  const onLeagueCardClick = (league: any) => {
    setShowSeasonModal(true);
    // Check if the leagueid is avaible in the cache

    const cachedData: { seasons: any[] } | null | undefined =
      queryClient.getQueryData(["leagueSeasons", league.idLeague]);
    if (cachedData) {
      setSeasonDetails({
        ...league,
        ...cachedData.seasons[cachedData.seasons.length - 1],
      });
      setIsLoadingSeasons(false);
    } else {
      fetchLeagueSeasonByID(league); // Calling API to fetch in case
    }
  };

  // Util Helper functions
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

  const filterLeaguesBySearchAndSport = useMemo(
    () => (league: any) => {
      return (
        league.strLeague.toLowerCase().includes(searchText.toLowerCase()) &&
        league.strSport.toLowerCase() === selectedSport.value
      );
    },
    [searchText, selectedSport.value]
  );

  const filterLeaguesBySearch = useMemo(
    () => (league: any) => {
      return league.strLeague.toLowerCase().includes(searchText.toLowerCase());
    },
    [searchText]
  );

  const filterLeaguesBySport = useMemo(
    () => (league: any) => {
      return league.strSport.toLowerCase() === selectedSport.value;
    },
    [selectedSport.value]
  );

  const filteredLeagues = useMemo(() => {
    if (!searchText && !selectedSport.value) {
      return allLeagues;
    }

    let arr = allLeagues.filter((league) => {
      if (searchText && selectedSport.value) {
        return filterLeaguesBySearchAndSport(league);
      }

      if (searchText) {
        return filterLeaguesBySearch(league);
      }

      if (selectedSport.value) {
        return filterLeaguesBySport(league);
      }
    });
    return arr;
  }, [selectedSport.value, searchText, allLeagues]);

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
          (filteredLeagues.length > 0 ? (
            filteredLeagues?.map((league: any) => {
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
