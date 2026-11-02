import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { defaultPages } from '../../../lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPrev = searchParams.get('prev') === '1';
    const targetFile = isPrev ? 'data/book_prev.json' : 'data/book_main.json';
    try {
      const { blobs } = await list({ prefix: targetFile });
      const target = blobs.find(b => b.pathname === targetFile) || blobs[0];
      if (target) {
        const res = await fetch(`${target.url}?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
            return NextResponse.json(data);
          }
        }
      }
    } catch (e: any) {
      console.warn('Vercel Blob GET warning (falling back to built-in perfected book):', e?.message);
    }
  } catch (err: any) {
    console.error('API GET /api/book error:', err);
  }

  // Luôn trả về 134 trang chuẩn của cuốn sách
  return NextResponse.json({
    pages: defaultPages(),
    bgMusic: {
      url: 'https://www.youtube.com/watch?v=S_CHQol_DQw',
      videoId: 'S_CHQol_DQw',
      title: 'Mong Ước Kỷ Niệm Xưa · Xuân Phương'
    },
    updated: 1793550000000
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pages, bgMusic } = body;
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'Dữ liệu trang sách không hợp lệ' }, { status: 400 });
    }

    let blobUrl = null;

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
    } catch (e: any) {
      console.warn('Backup error (non-fatal):', e?.message);
    }

    // Ghi dữ liệu mới vào data/book_main.json trên Vercel Blob (nếu store khả dụng)
    try {
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
      blobUrl = blob.url;
    } catch (e: any) {
      console.warn('Vercel Blob put warning (client state saved):', e?.message);
    }

    return NextResponse.json({ success: true, url: blobUrl, updated: Date.now() });
  } catch (err: any) {
    console.error('API POST /api/book error:', err);
    return NextResponse.json({ error: err?.message || 'Lỗi lưu trữ máy chủ' }, { status: 500 });
  }
}
