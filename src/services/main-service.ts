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
