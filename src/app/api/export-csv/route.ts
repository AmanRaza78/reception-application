import { exportVisitorsToCSV } from '@/action';
import { NextResponse } from 'next/server';

import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore()
  try {
    const csvResponse = await exportVisitorsToCSV();

    // Create response with CSV content and set headers
    return new NextResponse(csvResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="visitors.csv"',
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return new NextResponse('Failed to export CSV', { status: 500 });
  }
}
