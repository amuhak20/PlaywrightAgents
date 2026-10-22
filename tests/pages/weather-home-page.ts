import { expect, type Locator, type Page } from '@playwright/test';

export class WeatherHomePage {
  private readonly searchCity: Locator;

  constructor(private readonly page: Page) {
    this.searchCity = page.getByRole('textbox', { name: 'Search City' });
  }

  async open(): Promise<void> {
    await this.page.goto('https://openweathermap.org/');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/OpenWeather/);
    await expect(this.searchCity).toBeVisible();
  }

  async searchForCity(city: string): Promise<void> {
    await this.searchCity.fill(city);
  }

  private suggestionFor(city: string): Locator {
    return this.page
      .getByRole('button', { name: new RegExp(escapeRegExp(city), 'i') })
      .first();
  }

  async expectCitySuggestion(city: string): Promise<void> {
    await expect(this.suggestionFor(city)).toBeVisible();
  }

  async selectCity(city: string): Promise<void> {
    await this.suggestionFor(city).click();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
