import { config } from "../utils/config";

export const fetchAllLeagues = async () => {
  const response = await fetch(
    `${config.apiBaseUrl}/api/v1/json/3/all_leagues.php`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch leagues");
  }
  return await response.json();
};

export const fetchAllSeasonByLeagueId = async (id: string) => {
  const response = await fetch(
    `${config.apiBaseUrl}/api/v1/json/3/search_all_seasons.php?badge=1&id=${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch seasons");
  }
  return await response.json();
};
