export const RANK_RANGE_OPTIONS = ["All Ranks", "Top 5", "Top 10", "Top 15", "Unranked"];

export const NATIONALITY_OPTIONS = [
  "All Nationalities",
  "Ireland",
  "USA",
  "Russia",
  "Nigeria",
  "Cameroon",
  "Brazil"
];

interface CountryApiResponseItem {
  name: string;
}

export async function getCountryNames() {
  try {
    const response = await fetch("https://restcountries.com/v2/all?fields=name");

    if (!response.ok) {
      return [];
    }

    const countries = (await response.json()) as CountryApiResponseItem[];

    return countries
      .map((country) => country.name)
      .sort((first, second) => first.localeCompare(second));
  } catch {
    return [];
  }
}
