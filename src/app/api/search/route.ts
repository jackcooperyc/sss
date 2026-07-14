import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const pageToken = searchParams.get('pageToken');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Maps API key is not configured' }, { status: 500 });
  }

  try {
    let allPlaces: Record<string, unknown>[] = [];
    let currentToken = pageToken || undefined;
    
    // We will fetch up to 3 pages (60 results max)
    const MAX_PAGES = 3;
    let pageCount = 0;

    while (pageCount < MAX_PAGES) {
      const requestBody: Record<string, unknown> = {
        textQuery: query,
        pageSize: 20 // Max items per request
      };

      if (currentToken) {
        requestBody.pageToken = currentToken;
      }

      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.editorialSummary,places.addressComponents,nextPageToken',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Places API Error:', response.status, errorText);
        return NextResponse.json({ error: 'Failed to fetch data from Google Places API' }, { status: response.status });
      }

      const data = await response.json();
      const places = data.places || [];
      allPlaces = [...allPlaces, ...places];
      
      currentToken = data.nextPageToken;
      pageCount++;

      if (!currentToken) {
        break; // No more pages available from Google
      }

      // If we have another page to fetch, we MUST wait ~2 seconds before using the token
      // or Google will return an INVALID_ARGUMENT error.
      if (pageCount < MAX_PAGES) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // The NWA Filter - Applied to the complete buffered set
    const filteredPlaces = allPlaces.filter((place) => {
      const uri = place.websiteUri as string | undefined;
      if (!uri) return true; // Missing or null
      
      const lowerUri = uri.toLowerCase();
      return lowerUri.includes('facebook.com') ||
             lowerUri.includes('yelp.com') ||
             lowerUri.includes('instagram.com');
    });

    // Data Normalization
    const normalizedResults = filteredPlaces.map((place) => {
      let city = '';
      let state = '';
      let postalCode = '';
      let streetNumber = '';
      let route = '';

      if (place.addressComponents) {
        for (const component of place.addressComponents as Array<{types: string[], longText: string, shortText: string}>) {
          if (component.types.includes('street_number')) {
            streetNumber = component.longText;
          }
          if (component.types.includes('route')) {
            route = component.longText;
          }
          if (component.types.includes('locality')) {
            city = component.longText;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.shortText;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.longText;
          }
        }
      }

      const streetAddress = [streetNumber, route].filter(Boolean).join(' ').trim();

      return {
        id: place.id,
        name: (place.displayName as { text: string })?.text || 'Unknown Business',
        address: place.formattedAddress,
        streetAddress: streetAddress || undefined,
        phone: place.nationalPhoneNumber || 'No phone provided',
        website: place.websiteUri || null,
        description: (place.editorialSummary as { text: string })?.text || 'No description provided',
        location: {
          city,
          state,
          postalCode
        }
      };
    });

    return NextResponse.json({
      results: normalizedResults,
      hasMore: !!currentToken, // Still return if there's more beyond our 3-page buffer
      nextPageToken: currentToken || null
    });

  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
