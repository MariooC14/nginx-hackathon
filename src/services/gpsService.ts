interface GeoAPIResponse {
  city: {
    names: {
      en: string;
    };
    name: string;
  };
  country: {
    name: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
}

interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GeoCache {
  [ip: string]: LocationData;
}

let geoCache: GeoCache = {};

async function loadGeoCache() {
  try {
    const response = await fetch('/src/assets/geo-cache.json');
    geoCache = await response.json();
  } catch (error) {
    geoCache = {};
  }
}

async function saveGeoCache() {
  try {
    const response = await fetch('/src/assets/geo-cache.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geoCache),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to save geo cache:', error);
    return false;
  }
}

async function IPtoLocation(ip: string): Promise<LocationData> {
  await loadGeoCache();

  if (geoCache[ip]) {
    console.log(`Cache hit for IP: ${ip}`);
    return geoCache[ip];
  }

  const apiKey = process.env.GEOAPI_KEY;
  const response = await fetch(`https://api.geoapify.com/v1/ipinfo?ip=${ip}&apiKey=${apiKey}`);
  const data: GeoAPIResponse = await response.json();
  const locationData = parseLocationData(data);

  geoCache[ip] = locationData;
  await saveGeoCache();
  console.log(`Cache miss for IP: ${ip}, fetched from API`);

  return locationData;
}

export function parseLocationData(response: GeoAPIResponse): LocationData {
  return {
    city: response.city.names.en,
    country: response.country.name,
    latitude: response.location.latitude,
    longitude: response.location.longitude
  };
}