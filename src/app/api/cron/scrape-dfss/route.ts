import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from 'next-sanity';
import crypto from 'crypto';
import { projectId, dataset, apiVersion } from '@/src/sanity/client';

export const dynamic = 'force-dynamic';

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  // This requires SANITY_API_TOKEN to be set in environment with write access
  token: process.env.SANITY_API_TOKEN,
});

export async function GET(request: Request) {
  try {
    const response = await fetch('https://dfs.nic.in/vacancy.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch DFSS page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const vacancies: any[] = [];

    // DFSS vacancy table structure parsing
    $('table tbody tr').each((i, el) => {
      // Skip header row
      if (i === 0) return;

      const cols = $(el).find('td');
      if (cols.length >= 2) {
        // Assume Title is col 1 or 2, Date is another col, Link is inside a
        const titleText = $(cols[0]).text().trim() || $(cols[1]).text().trim();
        const dateText = $(cols[1]).text().trim() || $(cols[2])?.text().trim();
        const linkHref = $(el).find('a').attr('href');

        if (titleText && titleText.length > 5 && !titleText.toLowerCase().includes('s.no')) {
            let fullUrl = linkHref || '';
            if (fullUrl && !fullUrl.startsWith('http')) {
                fullUrl = fullUrl.startsWith('/') 
                    ? `https://dfs.nic.in${fullUrl}`
                    : `https://dfs.nic.in/${fullUrl}`;
            }

            const hash = crypto.createHash('md5').update(`${titleText}-${fullUrl}`).digest('hex');

            vacancies.push({
                title: titleText,
                date: dateText,
                url: fullUrl,
                fingerprint: hash
            });
        }
      }
    });

    // Fallback list parsing if table is empty
    if (vacancies.length === 0) {
      $('ul li a').each((i, el) => {
        const text = $(el).text().trim();
        const linkHref = $(el).attr('href');
        
        if (text && (text.toLowerCase().includes('vacancy') || text.toLowerCase().includes('recruitment') || text.toLowerCase().includes('post'))) {
            let fullUrl = linkHref || '';
            if (fullUrl && !fullUrl.startsWith('http')) {
                fullUrl = fullUrl.startsWith('/') 
                    ? `https://dfs.nic.in${fullUrl}`
                    : `https://dfs.nic.in/${fullUrl}`;
            }
            const hash = crypto.createHash('md5').update(`${text}-${fullUrl}`).digest('hex');
            vacancies.push({
                title: text,
                date: new Date().toLocaleDateString(), 
                url: fullUrl,
                fingerprint: hash
            });
        }
      });
    }

    let addedCount = 0;
    
    // Check existing to prevent duplicates
    if (vacancies.length > 0 && process.env.SANITY_API_TOKEN) {
        const existingDocs = await writeClient.fetch(`*[_type == "dfssVacancy"]{ fingerprint }`);
        const existingFingerprints = new Set(existingDocs.map((doc: any) => doc.fingerprint));

        for (const v of vacancies) {
            if (!existingFingerprints.has(v.fingerprint)) {
                await writeClient.create({
                    _type: 'dfssVacancy',
                    title: v.title,
                    date: v.date,
                    notificationUrl: v.url,
                    sourceUrl: 'https://dfs.nic.in/vacancy.html',
                    scrapedAt: new Date().toISOString(),
                    fingerprint: v.fingerprint
                });
                addedCount++;
            }
        }
    } else if (!process.env.SANITY_API_TOKEN) {
      console.warn("SANITY_API_TOKEN not found, skipping writing to Sanity.");
    }

    return NextResponse.json({ success: true, totalFound: vacancies.length, newlyAdded: addedCount, vacancies });
  } catch (error: any) {
    console.error('DFSS Scraper error:', error);
    // Graceful failure - keep existing records intact
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
