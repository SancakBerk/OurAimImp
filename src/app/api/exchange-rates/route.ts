import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://finans.truncgil.com/today.json', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { statusCode: response.status, message: 'Failed to fetch exchange rates' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(
      { statusCode: 200, message: 'success', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Exchange rates API error:', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Error fetching exchange rates' },
      { status: 500 }
    );
  }
}
