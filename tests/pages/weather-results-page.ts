import { expect, type Locator, type Page } from '@playwright/test';

export class WeatherResultsPage {
  private readonly pageTitle: Locator;
  private readonly forecastDayCards: Locator;
  private readonly selectedDate: Locator;
  private readonly hourlyForecastHeading: Locator;
  private readonly eveningHourLabels: Locator;
  private readonly celsiusButton: Locator;
  private readonly fahrenheitButton: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('title');
    this.forecastDayCards = page
      .locator('main button')
      .filter({ hasText: /^(Today|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/ });
    this.selectedDate = page.getByText(/^[A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}$/);
    this.hourlyForecastHeading = page.getByText('Hourly forecast');
    this.eveningHourLabels = page.locator('main').getByText(/^(9|10|11) p\.m$/);
    this.celsiusButton = page.getByRole('button', { name: '°C' });
    this.fahrenheitButton = page.getByRole('button', { name: '°F' });
  }

  async expectCityResults(city: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/city\/\d+/);
    await expect(this.page).toHaveTitle('Weather forecast');
    await expect(this.page.getByText(new RegExp(`^${escapeRegExp(city)},\\s*[A-Z]{2}$`)).first()).toBeVisible();
  }

  async selectForecastDay(index: number): Promise<void> {
    await this.forecastDayCards.nth(index).click();
  }

  async expectForecastDaySelected(index: number): Promise<void> {
    const selectedCard = this.forecastDayCards.nth(index);
    await expect(selectedCard).toHaveClass(/bg-orange/);
    await expect(this.selectedDate).toBeVisible();

    const selectedDateText = await this.selectedDate.textContent();
    expect(selectedDateText).toBeTruthy();
    expect(selectedDateText!.split(', ')[0]).toBe((await selectedCard.innerText()).trim().slice(0, 3));
    await expect(this.hourlyForecastHeading).toBeVisible();
  }

  async expectEveningTemperatureAfterEightPm(): Promise<void> {
    await expect(this.eveningHourLabels.first()).toBeVisible();

    const [celsiusClass, fahrenheitClass] = await Promise.all([
      this.celsiusButton.getAttribute('class'),
      this.fahrenheitButton.getAttribute('class'),
    ]);
    expect(/bg-white/.test(celsiusClass ?? '') || /bg-white/.test(fahrenheitClass ?? '')).toBe(true);

    for (const hourLabel of await this.eveningHourLabels.all()) {
      const entryText = (await hourLabel.locator('..').innerText()).replace(/\s+/g, ' ').trim();
      const temperature = entryText.match(/(?:^|\s)(-?\d+(?:\.\d+)?)\s*°(?:\s|$)/);
      if (temperature && Number.isFinite(Number(temperature[1]))) {
        return;
      }
    }

    throw new Error('No numeric temperature was shown for an hourly forecast entry after 8 PM.');
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
