import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with commas as thousands separators
 */
export function formatNumber(number) {
  return new Intl.NumberFormat().format(number)
}

/**
 * Gets a list of all languages from countries data
 */
export function getAllLanguages(countries) {
  const languagesSet = new Set()

  countries.forEach(country => {
    if (country.languages) {
      Object.values(country.languages).forEach(lang => {
        languagesSet.add(lang)
      })
    }
  })

  return Array.from(languagesSet).sort()
}

/**
 * Gets a list of all regions from countries data
 */
export function getAllRegions(countries) {
  const regionsSet = new Set()

  // Add "All" as the first option
  regionsSet.add("All")

  countries.forEach(country => {
    if (country.region) {
      regionsSet.add(country.region)
    }
  })

  return Array.from(regionsSet).sort()
}

/**
 * Extracts query parameters from the URL
 */
export function getQueryParams() {
  const params = new URLSearchParams(window.location.search)
  const result = {}

  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}

/**
 * Updates URL with query parameters without causing a page reload
 */
export function updateUrlParams(params) {
  const url = new URL(window.location.href)

  // Clear existing params
  url.search = ""

  // Add new params
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value)
    }
  })

  window.history.pushState({}, "", url)
}
