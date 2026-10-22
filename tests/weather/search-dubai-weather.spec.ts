// spec: specs/weather-search.plan.md
// seed: tests/seed.spec.ts

import { test } from '@playwright/test';
import { WeatherHomePage } from '../pages/weather-home-page';
import { WeatherResultsPage } from '../pages/weather-results-page';

const weatherSearchCases = [
  { city: 'Dubai' },
  { city: 'London' },
  { city: 'Tokyo' },
  { city: 'Paris' },
  { city: 'Singapore' },
  { city: 'New York' },
];

test.describe('Searching for Weather in Dubai', () => {
  for (const { city } of weatherSearchCases) {
    test(`Search ${city} and verify a two-day evening temperature`, async ({ page }) => {
      const homePage = new WeatherHomePage(page);
      const resultsPage = new WeatherResultsPage(page);

      // 1. Open OpenWeatherMap homepage and verify the Search City field is available.
      await homePage.open();
      await homePage.expectLoaded();

      // 2. Enter the data-driven city query and verify its suggestion appears.
      await homePage.searchForCity(city);
      await homePage.expectCitySuggestion(city);

      // 3. Select the matching city suggestion.
      await homePage.selectCity(city);

      // 4. Verify the selected city's results page and loaded forecast.
      await resultsPage.expectCityResults(city);

      // 5. Select the forecast day two days after today and verify its date and hourly forecast.
      await resultsPage.selectForecastDay(2);
      await resultsPage.expectForecastDaySelected(2);

      // 6. Verify an hourly temperature is displayed after 8 PM on the selected forecast date.
      await resultsPage.expectEveningTemperatureAfterEightPm();
    });
  }
});
