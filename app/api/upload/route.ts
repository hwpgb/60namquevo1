import {handleUpload,type HandleUploadBody} from '@vercel/blob/client';
import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';

async function emailOf(idToken:string):Promise<string>{
  if(!idToken)return '';
  try{
    const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+process.env.NEXT_PUBLIC_FIREBASE_API_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})});
    const d:any=await r.json();
    return String((d&&d.users&&d.users[0]&&d.users[0].email)||'').toLowerCase();
  }catch(e){return ''}
}

export async function POST(request:Request){
  const body=(await request.json()) as HandleUploadBody;
  try{
    const json=await handleUpload({
      body,
      request,
      onBeforeGenerateToken:async(pathname:string,clientPayload:string|null)=>{
        const email=await emailOf(clientPayload||'');
        const editors=(process.env.NEXT_PUBLIC_EDITOR_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
        if(!email||!editors.includes(email))throw new Error('Tài khoản không có quyền tải lên');
        return {allowedContentTypes:['video/*','image/*'],maximumSizeInBytes:500*1024*1024,addRandomSuffix:true};
      },
      onUploadCompleted:async()=>{},
    });
    return NextResponse.json(json);
  }catch(e:any){
    return NextResponse.json({error:e&&e.message?e.message:'Lỗi tải lên'},{status:400});
  }
}
