import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUserFromSession } from "~/session.server";
import { getUserFavoriteCities } from "~/models/user.server";
import { Card, CardContent, Typography, Grid } from "@mui/material";

// Fetch weather data for favorite cities
export async function loader({ request }) {
  const user = await getUserFromSession(request);
  if (!user) {
    return json({ error: "User not found" }, { status: 401 });
  }

  const favoriteCities = await getUserFavoriteCities(user.id);
  const apiKey = process.env.WEATHER_API_KEY;

  // Fetch weather data for each favorite city
  const weatherData = await Promise.all(favoriteCities.map(async (city) => {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
    const data = await res.json();
    return {
      city: data.location.name,
      conditionText: data.current.condition.text,
      iconUrl: data.current.condition.icon,  // Icon URL for current weather condition
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      precipitation: data.current.precip_mm,
    };
  }));

  return json({
    username: user.username,
    weatherData,  // Pass the weather data for favorite cities to the component
  });
}

export default function WeatherPage() {
  const data = useLoaderData();

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to the weather app, {data.username}!
      </Typography>

      <Typography variant="h5" align="center" gutterBottom>
        Your Favorite Cities' Weather:
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {data.weatherData.length === 0 ? (
          <Typography>No favorite cities added yet!</Typography>
        ) : (
          data.weatherData.map((cityWeather) => (
            <Grid item xs={12} sm={6} md={4} key={cityWeather.city}>
              <Card style={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cityWeather.city}
                  </Typography>

                  {/* Weather Icon */}
                  <img src={cityWeather.iconUrl} alt="weather condition" style={{ width: '50px', height: '50px' }} />

                  <Typography variant="body1">
                    Condition: {cityWeather.conditionText}
                  </Typography>
                  <Typography variant="body1">
                    Temperature: {cityWeather.temperature}°C
                  </Typography>
                  <Typography variant="body1">
                    Humidity: {cityWeather.humidity}%
                  </Typography>
                  <Typography variant="body1">
                    Precipitation: {cityWeather.precipitation} mm
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
