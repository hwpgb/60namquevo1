import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPrev = searchParams.get('prev') === '1';
    const targetFile = isPrev ? 'data/book_prev.json' : 'data/book_main.json';
    const { blobs } = await list({ prefix: targetFile });
    const target = blobs.find(b => b.pathname === targetFile) || blobs[0];
    if (target) {
      const res = await fetch(`${target.url}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    }
  } catch (err: any) {
    console.error('API GET /api/book error:', err);
  }
  return NextResponse.json({ pages: null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pages, bgMusic } = body;
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'Dữ liệu trang sách không hợp lệ' }, { status: 400 });
    }

    // Tự động sao lưu bản hiện tại sang data/book_prev.json trước khi ghi đè bản mới
    try {
      const { blobs } = await list({ prefix: 'data/book_main.json' });
      const current = blobs.find(b => b.pathname === 'data/book_main.json') || blobs[0];
      if (current) {
        const res = await fetch(`${current.url}?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const oldData = await res.text();
          await put('data/book_prev.json', oldData, {
            access: 'public',
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: 'application/json',
          });
        }
      }
    } catch (e) {
      console.warn('Backup error (non-fatal):', e);
    }

    // Ghi dữ liệu mới vào data/book_main.json trên Vercel Blob
    const payload = JSON.stringify({
      pages,
      bgMusic,
      updated: Date.now(),
    });

    const blob = await put('data/book_main.json', payload, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });

    return NextResponse.json({ success: true, url: blob.url, updated: Date.now() });
  } catch (err: any) {
    console.error('API POST /api/book error:', err);
    return NextResponse.json({ error: err?.message || 'Lỗi lưu trữ máy chủ' }, { status: 500 });
  }
}
