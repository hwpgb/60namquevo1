import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{const s=process.env.NEXT_PUBLIC_SITE_URL||'https://60namquevo1.vercel.app';return{rules:{userAgent:'*',allow:'/'},sitemap:s+'/sitemap.xml'}}
