# OpenWeatherMap Dubai Weather Search

## Application Overview

Verify the OpenWeatherMap city search flow for Dubai, UAE and confirm an hourly evening temperature is displayed two calendar days after today. Start from a fresh browser context at https://openweathermap.org/. Implement generated tests with Page Object Model classes for the homepage/search and weather results, and drive the scenario from a data table (the required initial row is Dubai); derive the forecast card from its relative offset rather than using fixed weekday names or dates. Weather values and current dates are dynamic, so assert presence and valid formatting rather than a specific temperature.

## Test Scenarios

### 1. Searching for Weather in Dubai

**Seed:** `tests\seed.spec.ts`

#### 1.1. Search Dubai and verify a two-day evening temperature

**File:** `tests\weather\search-dubai-weather.spec.ts`

**Steps:**
  1. Open https://openweathermap.org/ in a fresh browser context.
    - expect: The OpenWeatherMap homepage loads and the Search City field is available.
  2. Using the Page Object Model homepage object, enter the data-driven city query “Dubai” in the Search City field.
    - expect: The city search suggestions appear for the query.
  3. From the suggestions, select the Dubai, UAE result (the Dubai, Dubai suggestion with coordinates near 25.27, 55.29), not other cities named Dubai.
    - expect: The browser navigates to a weather results route for the selected city.
  4. Using the results page object, verify the results page identifies the location as Dubai, AE and has loaded its forecast.
    - expect: The URL is a city results route (for example, /city/<id>).
    - expect: The page title is “Weather forecast” and the displayed city is Dubai, AE.
  5. From the forecast day cards, select the card at index 2 when counting today as index 0; use the day/date labels rather than assuming a fixed weekday or calendar date.
    - expect: The selected forecast date is two calendar days after today.
    - expect: The hourly forecast updates to the selected date.
  6. Inspect the selected date’s hourly forecast and find at least one entry whose local time is after 8:00 PM (for example, 9 p.m. or later). Verify its temperature is present as a numeric value with a temperature unit; accept either °C or °F and do not assert a fixed value.
    - expect: At least one hourly entry after 8:00 PM is displayed for the selected date.
    - expect: That entry has a non-empty, numeric temperature and a °C or °F unit.
    - expect: Fail the scenario if the selected date has no hourly entry after 8:00 PM or its temperature is missing, non-numeric, or a placeholder.
