const BASE_URL = "https://restcountries.com/v3.1"

/**
 * Fetches all countries data
 */
export const getAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`)

    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching all countries:", error)
    throw error
  }
}

/**
 * Fetches countries by name (partial or full name)
 */
export const getCountriesByName = async name => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`)

    if (response.status === 404) {
      // No results found
      return []
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch countries with name: ${name}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching countries by name '${name}':`, error)
    throw error
  }
}

/**
 * Fetches countries by region
 */
export const getCountriesByRegion = async region => {
  try {
    if (region === "All") {
      return getAllCountries()
    }

    const response = await fetch(`${BASE_URL}/region/${region}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch countries in region: ${region}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching countries by region '${region}':`, error)
    throw error
  }
}

/**
 * Fetches country by code (cca3)
 */
export const getCountryByCode = async code => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch country with code: ${code}`)
    }

    const data = await response.json()
    return data[0] // The API returns an array with one country
  } catch (error) {
    console.error(`Error fetching country by code '${code}':`, error)
    throw error
  }
}
