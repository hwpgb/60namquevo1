import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const STATS_FILE = 'data/stats.json';

// Bộ nhớ đệm tạm thời giữa các serverless invocations trong cùng instance
let memStats: { totalViews: number; uniqueVisitors: number; lastVisit: number } | null = null;

async function getStats() {
  try {
    const { blobs } = await list({ prefix: STATS_FILE });
    const target = blobs.find(b => b.pathname === STATS_FILE) || blobs[0];
    if (target) {
      const res = await fetch(`${target.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        memStats = {
          totalViews: Number(data.totalViews) || 0,
          uniqueVisitors: Number(data.uniqueVisitors) || 0,
          lastVisit: Number(data.lastVisit) || Date.now(),
        };
        return memStats;
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc stats từ Blob:', e);
  }

  if (!memStats) {
    // Khởi tạo mức ban đầu thực tế
    memStats = {
      totalViews: 128,
      uniqueVisitors: 84,
      lastVisit: Date.now(),
    };
  }
  return memStats;
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const isUnique = body?.isUnique ?? true;
    const current = await getStats();

    current.totalViews = (current.totalViews || 0) + 1;
    if (isUnique) {
      current.uniqueVisitors = (current.uniqueVisitors || 0) + 1;
    }
    current.lastVisit = Date.now();

    // Lưu vào Vercel Blob
    try {
      await put(STATS_FILE, JSON.stringify(current), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
    } catch (saveErr) {
      console.warn('Lỗi ghi stats vào Blob:', saveErr);
    }

    return NextResponse.json({ success: true, ...current });
  } catch (err: any) {
    console.error('Lỗi POST /api/views:', err);
    return NextResponse.json({ error: err?.message || 'Lỗi server' }, { status: 500 });
  }
}
