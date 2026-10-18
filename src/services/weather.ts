// Open-Meteo is free, keyless and does not require attribution agreement.
// Docs: https://open-meteo.com/en/docs

export type Current = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
};

export type DayForecast = {
  date: string;
  tMax: number;
  tMin: number;
  rainProb: number;
  weatherCode: number;
};

export type WeatherData = {
  current: Current;
  forecast: DayForecast[];
  source: string;
  retrievedAt: string;
};

const BASE = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `${BASE}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
    `&timezone=auto&forecast_days=7`;

  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);

  const data = await res.json();
  const c = data.current ?? {};
  const d = data.daily ?? {};

  const forecast: DayForecast[] = (d.time ?? []).map((t: string, i: number) => ({
    date: t,
    tMax: Number(d.temperature_2m_max?.[i] ?? 0),
    tMin: Number(d.temperature_2m_min?.[i] ?? 0),
    rainProb: Number(d.precipitation_probability_max?.[i] ?? 0),
    weatherCode: Number(d.weather_code?.[i] ?? 0),
  }));

  return {
    current: {
      temperature: Number(c.temperature_2m ?? 0),
      humidity: Number(c.relative_humidity_2m ?? 0),
      windSpeed: Number(c.wind_speed_10m ?? 0),
      weatherCode: Number(c.weather_code ?? 0),
      time: String(c.time ?? ''),
    },
    forecast,
    source: 'Open-Meteo',
    retrievedAt: new Date().toISOString(),
  };
}

// WMO weather codes → short English + emoji; the icon alone communicates condition.
export function describe(code: number): { label: string; label_as: string; emoji: string } {
  const m = (en: string, as: string, emoji: string) => ({ label: en, label_as: as, emoji });
  if (code === 0) return m('Clear', 'পৰিষ্কাৰ', '☀️');
  if (code <= 2)  return m('Partly cloudy', 'আংশিক মেঘলা', '🌤️');
  if (code === 3) return m('Overcast',  'মেঘলা', '☁️');
  if (code <= 48) return m('Foggy',     'কুঁৱলী', '🌫️');
  if (code <= 57) return m('Drizzle',   'হেন্দলি বৰষুণ', '🌦️');
  if (code <= 67) return m('Rain',      'বৰষুণ', '🌧️');
  if (code <= 77) return m('Snow',      'তুষাৰ', '🌨️');
  if (code <= 82) return m('Showers',   'বৰ্ষণ', '🌧️');
  if (code <= 86) return m('Snow showers', 'তুষাৰ বৰ্ষণ', '🌨️');
  if (code <= 99) return m('Thunderstorm','বজ্ৰপাত', '⛈️');
  return m('—', '—', '🌡️');
}
