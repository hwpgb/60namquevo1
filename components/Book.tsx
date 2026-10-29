'use client';
import React,{useEffect,useRef,useState} from 'react';
import {onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {doc,getDoc,setDoc} from 'firebase/firestore';
import {upload} from '@vercel/blob/client';
import {KIND_LABEL,Kind,Page,Slot,defaultPages,mkPh,mkTx,mkVd,mkVd1,mkSection} from '../lib/data';
import {auth,db} from '../lib/firebase';
import Fireflies from './Fireflies';
import GateBg from './GateBg';

const EDITORS=(process.env.NEXT_PUBLIC_EDITOR_EMAILS||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
const FRAME='https://i.postimg.cc/FHy6s9ZS/Phac-hoa-cong-truong-Que-Vo-So-1.png';
const LOGO='/logo-60nam.png';
const FRAME_STYLE:React.CSSProperties={position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`url(${FRAME})`,backgroundRepeat:'no-repeat',backgroundPosition:'center bottom',backgroundSize:'max(100vw,120vh) auto',mixBlendMode:'multiply',opacity:.85};
const EASE='cubic-bezier(.65,0,.2,1)';
const CSS=`
#logo60{position:fixed;z-index:60;border-radius:50%;background:radial-gradient(circle at 50% 30%,#fffdf5,#f2e7c9);box-shadow:0 0 0 3px #c9a45c,0 10px 28px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;will-change:left,top,width,height;transition:left 1.4s ${EASE},top 1.4s ${EASE},width 1.4s ${EASE},height 1.4s ${EASE},opacity .6s ease,box-shadow .5s ease;aspect-ratio:1/1}
#logo60.corner{cursor:pointer}
#logo60.corner:hover{box-shadow:0 0 0 3px #e6c277,0 12px 30px rgba(0,0,0,.45)}
#logo60 img{width:68%;height:68%;object-fit:contain;display:block;pointer-events:none;user-select:none;aspect-ratio:1/1}
#logo60 .lgtxt{font-family:Georgia,serif;color:#8a5a1a;font-weight:700;font-size:1.4em}
.endp .endlogo{width:calc(var(--ls) * 1.15);height:calc(var(--ls) * 1.15);flex:none;aspect-ratio:1/1;border-radius:50%}
.back-crest{flex:none !important;width:min(calc(var(--ls) * 0.85), 130px) !important;height:min(calc(var(--ls) * 0.85), 130px) !important;aspect-ratio:1/1 !important;border-radius:50% !important;background:radial-gradient(circle at 50% 30%,#fffdf5,#f2e7c9) !important;box-shadow:0 0 0 2.5px #c9a45c, 0 8px 20px rgba(0,0,0,.35) !important;display:flex !important;align-items:center !important;justify-content:center !important;margin-bottom:5% !important;overflow:hidden !important}
.back-crest img{width:70% !important;height:70% !important;aspect-ratio:1/1 !important;object-fit:contain !important;display:block !important}
.endp .endmsg{display:block;font-size:clamp(15px,calc(var(--w) * 0.05),26px);font-weight:600;font-style:normal;line-height:1.35;opacity:0;transform:translateY(14px);transition:opacity 1.2s ease 1.9s,transform 1.2s ease 1.9s}
.endp .endmsg.on{opacity:1;transform:none}
html.narrow .endp .endmsg{font-size:18px}
.vbigwrap{width:100%;margin:auto 0}
.vbigbox{position:relative;width:100%;aspect-ratio:16/9;border-radius:6px;background:#2a1d10 center/cover no-repeat;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.vbigbox .vbigplay{width:64px;height:64px;border-radius:50%;background:rgba(255,250,235,.9);color:#5a3a12;display:flex;align-items:center;justify-content:center;font-size:24px;padding-left:4px;box-shadow:0 4px 14px rgba(0,0,0,.4)}
.vbigbox .vbigplay.add{width:auto;height:auto;border-radius:20px;padding:10px 18px;font-size:15px}
.vbigcap{margin-top:12px;text-align:center;font-size:15px;opacity:.85;min-height:1.4em}
.rotbtn{position:absolute;top:6px;right:6px;z-index:5;width:34px;height:34px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;font-size:19px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}
.rotbtn:hover{background:rgba(0,0,0,.85)}
.rotbtn.delbtn{right:auto;left:6px;background:rgba(150,35,35,.85);font-size:16px}
.rotbtn.delbtn:hover{background:rgba(170,30,30,1)}
.grid{min-height:0;grid-auto-rows:minmax(0,1fr);align-content:stretch}
.open h2,.tx h2{text-shadow:0 1px 2px rgba(255,255,255,.6),0 2px 8px rgba(143,95,28,.15)}
.slot{position:relative;background:#fffdf5;padding:7px 7px 8px;border-radius:4px;border:1px solid rgba(195,155,90,.38);box-shadow:0 6px 18px rgba(50,30,10,.35),0 1px 3px rgba(0,0,0,.12);display:flex;flex-direction:column;transform:rotate(var(--frot, 0deg));transition:transform .25s ease,box-shadow .3s ease}
.slot:hover{transform:rotate(var(--frot, 0deg)) scale(1.04);box-shadow:0 12px 28px rgba(50,30,10,.5);z-index:5}
.slot::before{content:'';position:absolute;top:-8px;left:50%;width:40%;height:15px;transform:translateX(-50%) rotate(-2deg);background:rgba(215,175,95,.65);box-shadow:0 1px 3px rgba(0,0,0,.15);z-index:2;pointer-events:none}
.root.editing .slot{touch-action:none}
.root.editing .slot:hover{outline:1.5px dashed rgba(143,95,28,.7);outline-offset:3px}
.grid.n1{grid-template-columns:1fr;place-items:center;max-width:96%;margin:auto;display:flex;align-items:center;justify-content:center}
.grid.n1 .cell{width:100%;max-width:540px}
.grid.n1 .slot{width:100%;max-height:68vh}
.grid.n1 .slot .ph{aspect-ratio:var(--ar, 16/11);min-height:220px}
.grid.n2.stack{grid-template-columns:1fr;gap:4%;max-width:94%;margin:auto}
.grid.n2.stack .cell{width:100%}
.grid.n2.stack .slot{width:100%}
.grid.n2.stack .slot .ph{aspect-ratio:var(--ar, 16/10);min-height:130px}
.grid.n2:not(.stack){grid-template-columns:1fr 1fr;gap:4%}
.grid.n2:not(.stack) .slot .ph{aspect-ratio:var(--ar, 4/3)}
.grid.n3{grid-template-columns:1fr 1fr;gap:3.5%}
.grid.n3 .cell:last-child{grid-column:1/-1;width:100%}
.grid.n3 .cell:last-child .slot .ph{aspect-ratio:var(--ar, 16/9);min-height:120px}
.grid.n3 .cell:not(:last-child) .slot .ph{aspect-ratio:var(--ar, 4/3)}
.grid.g3{grid-template-columns:repeat(3,1fr);gap:2.5%}
.grid .cell.wide{grid-column:1/-1;width:100%}
.grid .cell.wide .slot .ph{aspect-ratio:var(--ar, 16/9)}
.cell{width:100%;height:100%;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center}
.grid .slot{width:100%;height:100%;min-height:80px;display:flex;flex-direction:column}
.grid .slot .ph{flex:1 1 auto;width:100%;min-height:70px;aspect-ratio:var(--ar, 4/3);position:relative;background:#d8c392 center/cover no-repeat;display:grid;place-items:center;border-radius:2px;border:1px solid rgba(165,138,82,.45);overflow:hidden}
.grid .slot.pr .ph{aspect-ratio:var(--ar, 3/4)}
.slot.tape-l::before{left:28%;transform:translateX(-50%) rotate(-4deg);background:rgba(220,180,105,.7)}
.slot.tape-r::before{left:72%;transform:translateX(-50%) rotate(3.5deg);background:rgba(210,165,90,.65)}
.slot.tape-corner::before{top:2px;left:2px;width:34px;height:12px;transform:rotate(-42deg);background:rgba(215,175,95,.72)}
.watermark{position:absolute;pointer-events:none;user-select:none;transition:opacity .3s}
.watermark.doodle-score{width:min(115px,30%);height:auto;bottom:14px;z-index:2}
.watermark.doodle-books{width:min(135px,35%);height:auto;bottom:12px;z-index:2}
.watermark.doodle-plane{width:min(130px,33%);height:auto;bottom:16px;z-index:2}
.watermark.doodle-stationery{width:min(125px,32%);height:auto;bottom:12px;z-index:2}
.watermark.doodle-ruler{width:min(120px,30%);height:auto;bottom:12px;z-index:2}
.watermark.doodle-l{left:16px;right:auto}
.watermark.doodle-r{right:16px;left:auto}
.slot.pr .ph{aspect-ratio:var(--ar, 3/4)}
.slot figcaption{color:#3a240f;font:600 clamp(11.5px,calc(var(--w) * 0.034),17px)/1.25 'Dancing Script','Caveat',cursive;padding:4px 2px 2px;min-height:22px;text-align:center;letter-spacing:.02em;flex:none}
.grid.g3 figcaption{font-size:clamp(10.5px,calc(var(--w) * 0.028),14px);min-height:18px}
.slbar{position:absolute;top:3px;left:3px;right:3px;z-index:6;display:flex;gap:2.5px;flex-direction:column;pointer-events:auto}
.slbar .g{display:flex;gap:2.5px;flex-wrap:wrap;align-items:center;justify-content:center}
.slbar button{min-width:22px;height:22px;padding:0 5px;border-radius:11px;border:0;background:rgba(0,0,0,.75);color:#fff;font-size:10.5px;font-weight:600;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.slbar button:hover{background:rgba(0,0,0,.95)}
.slbar button.dl{background:rgba(160,35,35,.88)}
.slbar button.drgbtn{background:rgba(143,95,28,.92);cursor:grab}
.slbar button.drgbtn:active{cursor:grabbing;background:#8f5f1c}
.rsz{position:absolute;z-index:7;border-radius:50%;background:rgba(40,25,8,.92);color:#f6e7bd;display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;box-shadow:0 2px 6px rgba(0,0,0,.45);border:1px solid rgba(246,231,189,.5)}
.rsz.rsz-se{right:-9px;bottom:-9px;width:24px;height:24px;font-size:13px;cursor:nwse-resize}
.rsz.rsz-e{right:-9px;top:50%;transform:translateY(-50%);width:22px;height:22px;font-size:11px;cursor:ew-resize}
.rsz.rsz-s{bottom:-9px;left:50%;transform:translateX(-50%);width:22px;height:22px;font-size:11px;cursor:ns-resize}
.rsz:active{background:#8f5f1c}
.drg{position:absolute;left:-9px;bottom:-9px;z-index:7;width:24px;height:24px;border-radius:50%;background:rgba(40,25,8,.92);color:#f6e7bd;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:grab;touch-action:none;user-select:none;box-shadow:0 2px 6px rgba(0,0,0,.45);border:1px solid rgba(246,231,189,.5)}
.drg:active{cursor:grabbing;background:#8f5f1c}
.rot-handle{position:absolute;right:-9px;top:-9px;z-index:7;width:24px;height:24px;border-radius:50%;background:rgba(40,25,8,.92);color:#f6e7bd;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:crosshair;touch-action:none;user-select:none;box-shadow:0 2px 6px rgba(0,0,0,.45);border:1px solid rgba(246,231,189,.5)}
.rot-handle:active{cursor:grabbing;background:#8f5f1c}
.slbar button.drgbtn{background:rgba(143,95,28,.88);cursor:grab}
.slbar button.drgbtn:active{cursor:grabbing;background:#8f5f1c}
.pgcog{all:unset;position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:9;cursor:pointer;font-size:12px;padding:4px 12px;border-radius:999px;background:rgba(40,25,8,.8);color:#f6e7bd;white-space:nowrap}
.pgmenu{position:absolute;top:34px;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;gap:3px;padding:8px;border-radius:14px;background:rgba(40,25,8,.94);min-width:200px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.pgmenu button{all:unset;cursor:pointer;font-size:12.5px;padding:7px 10px;border-radius:8px;color:#f6e7bd;white-space:nowrap}
.pgmenu button:hover{background:rgba(255,255,255,.12)}
.pgmenu button.dl{color:#ffb4a8}
.pnote{margin-top:auto;padding-top:10px;border-top:1px dashed rgba(143,95,28,.45);font:italic 500 clamp(13px,calc(var(--w) * 0.034),16px)/1.6 'Lora',serif;color:#4b3820;white-space:pre-wrap;max-height:28%;overflow:hidden;flex:none}
html.narrow .pnote{font-size:13.5px}
.face.drop-target-active{box-shadow:inset 0 0 0 3px var(--gold),inset 0 0 25px rgba(212,175,55,.25) !important;outline:2.5px dashed var(--gold) !important;outline-offset:-8px !important;background-color:rgba(212,175,55,.05) !important}
.slot.slot-drop-target{outline:3px solid #27ae60 !important;outline-offset:4px !important;transform:scale(1.04) !important}
.root.editing .slot[draggable=true]{cursor:grab}
.root.editing .slot.dragging-slot{opacity:0.4;transform:scale(0.95)}
.slbar .move-group{border-top:1px solid rgba(255,255,255,.2);margin-top:3px;padding-top:3px;display:flex;gap:3px;justify-content:center}
.slbar .move-group button{font-size:11px;padding:3px 6px;font-weight:600;color:#f7ecd2;background:rgba(143,95,28,.45);border-radius:4px}
.slbar .move-group button:hover{background:rgba(143,95,28,.85);color:#fff}
.root:not(.editing) .slot figcaption:empty,.root:not(.editing) .pnote:empty,.root:not(.editing) .tx h2:empty,.root:not(.editing) .open h2:empty{display:none}
.root.editing .pnote:empty:before,.root.editing .tx h2:empty:before,.root.editing .open h2:empty:before{content:attr(data-ph);opacity:.45;font-style:italic;font-weight:400}
#tb2{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:45;display:flex;gap:6px;padding:6px 8px;border-radius:999px;flex-wrap:wrap;justify-content:center;max-width:94vw}
#tb2 .btn{width:auto;display:inline-flex;margin:0;font-size:12px;padding:6px 10px;white-space:nowrap}
#tb2 .btn:disabled{opacity:.4;cursor:default}
html.narrow #dock button{min-height:44px}
html.narrow .ph{cursor:pointer}
.empty-page-add-slot{margin:auto;padding:14px 22px;border:2px dashed rgba(143,95,28,.45);border-radius:12px;background:rgba(255,253,245,.75);color:var(--gold);font-size:13.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 12px rgba(50,30,10,.08);transition:all .25s}
.empty-page-add-slot:hover{background:rgba(255,253,245,.98);border-color:var(--gold);transform:scale(1.03)}
`;
type LB={src:string;cap:string;v?:string;rot?:number};
type Item={p:Page;i:number};
const ROMAN=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'];
const roman=(n:number)=>ROMAN[n]||String(n);
const noteOf=(p:Page):string|undefined=>(p as any).note;
const zoomOf=(s:Slot):number=>(s as any).zoom||1;
const swOf=(s:Slot):number=>(s as any).sw||1;
const shOf=(s:Slot):number=>(s as any).sh||1;
const dxOf=(s:Slot):number=>(s as any).dx||0;
const dyOf=(s:Slot):number=>(s as any).dy||0;
const FROTS=[-2.6,2.2,-1.8,3.1,-2.2,1.6,-3,2.4,-1.4,2.8,-2,1.5];
const frotOf=(s:Slot,k:number,pi:number=0):number=>typeof (s as any).frot==='number'?(s as any).frot:FROTS[(pi*3+k)%FROTS.length];
const clampSz=(v:number)=>Math.max(.3,Math.min(2.5,Math.round(v*100)/100));

const authMsg=(c:string)=>c==='auth/invalid-credential'||c==='auth/wrong-password'||c==='auth/user-not-found'||c==='auth/invalid-login-credentials'?'Sai email hoặc mật khẩu, hoặc tài khoản chưa được tạo trong Firebase (Authentication › Users)':c==='auth/operation-not-allowed'?'Chưa bật đăng nhập Email/Password trong Firebase (Authentication › Sign-in method)':c==='auth/invalid-email'?'Email không đúng định dạng':c==='auth/too-many-requests'?'Thử sai quá nhiều lần, đợi vài phút rồi thử lại':c==='auth/network-request-failed'?'Lỗi mạng, kiểm tra kết nối':c==='auth/api-key-not-valid'||c==='auth/invalid-api-key'?'API key Firebase không hợp lệ':'Lỗi đăng nhập ('+(c||'không rõ')+')';

// Sách luôn phải có số trang chẵn: nếu lẻ thì thêm/bớt một trang trắng ngay trước trang cuối
const norm=(arr:Page[]):Page[]=>{
  if(arr.length%2===0)return arr;
  const e=arr.length-1;
  // Tìm và cắt bỏ trang đệm trống (nếu có) thay vì tự ý chèn thêm trang zombie
  for(let k=e-1;k>=1;k--){
    const pg=arr[k];
    const isEmptyPh=pg.t==='ph'&&(!pg.s||pg.s.length===0||pg.s.every(s=>!s.src));
    const isEmptyQ=pg.t==='q'&&(!pg.txt||pg.txt.trim()==='');
    if(isEmptyPh||isEmptyQ){
      return [...arr.slice(0,k),...arr.slice(k+1)];
    }
  }
  return [...arr.slice(0,e),{t:'ph',s:[]} as Page,arr[e]];
};

const DEFAULT_TEXT_MAP:Record<number,{txt?:string;by?:string}>={
  1:{txt:'“Nơi đây, mỗi viên gạch đều thuộc về một ký ức.”',by:'THẦY TRÒ QUẾ VÕ SỐ 1'},
  4:{txt:'Đây là giai đoạn nhà trường tiếp tục mở rộng hoạt động dạy học, số lượng học sinh ngày càng tăng. Các thế hệ cán bộ, giáo viên và học sinh cùng góp sức xây dựng truyền thống hiếu học, đoàn kết và vượt khó.'},
  6:{txt:'Ngày 13/11/2016, trường tổ chức lễ kỷ niệm 50 năm thành lập. Quy mô nhà trường đã phát triển từ 4 lớp, 152 học sinh lên 45 lớp với gần 2.000 học sinh. Năm học 2015–2016, trường được Bộ Giáo dục và Đào tạo tặng Cờ đơn vị dẫn đầu phong trào thi đua.'},
  8:{txt:'Nhà trường đẩy mạnh đổi mới phương pháp dạy học và ứng dụng công nghệ; năm học 2025–2026 tham gia triển khai chương trình học Toán thích ứng ứng dụng trí tuệ nhân tạo (AI), dẫn đầu tỉnh về tỷ lệ học sinh học tập trên nền tảng số. Học sinh nhà trường dẫn đầu toàn quốc về số lượng tham gia chiến dịch trực tuyến “Tiếp sức mùa thi 2026”.'},
  15:{txt:'“Những năm tháng bom đạn sơ tán, lớp học dựng bằng tre nứa giữa lòng dân; ngọn đèn dầu soi sáng từng trang sách, thắp lên ngọn lửa hiếu học Quế Võ.”',by:'KÝ ỨC NHỮNG NGÀY ĐẦU (1966 – 1975)'},
  19:{txt:'“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”',by:'GIỮ LỬA QUA NĂM THÁNG'},
  21:{txt:'“Tuổi mười tám rực rỡ như hoa phượng đầu hạ. Chúng tôi rời trường mang theo lời thầy dặn, đi muôn phương dựng xây đất nước.”',by:'KHÓA 1982 — 1985 (K18)'},
  25:{txt:'“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”',by:'NIÊN KHÓA 1993 — 1994 (K27)'},
  29:{txt:'“Dẫu thời gian có trôi đi như bóng câu qua cửa sổ, tiếng trống trường ngày khai giảng năm ấy vẫn vang vọng mãi trong tim.”',by:'HOÀI NIỆM MỘT THỜI ÁO TRẮNG'},
  41:{txt:'“Có một nghề bụi phấn bám đầy tay, người ta bảo đó là nghề cao quý nhất. Tri ân những người đưa đò thầm lặng đã chở bao thế hệ qua sông.”',by:'TRI ÂN THẦY CÔ QUẾ VÕ 1'},
  47:{txt:'“Những dòng lưu bút viết vội ngày chia tay, cái ôm thật chặt trước cổng trường. Tạm biệt nhé, thanh xuân tươi đẹp nhất của chúng mình!”',by:'LƯU BÚT TUỔI HỌC TRÒ'},
  51:{txt:'“Thời gian có thể làm phai mờ màu mực, nhưng không thể xóa nhòa tiếng cười giòn tan nơi góc lớp thân thương.”',by:'THANH XUÂN DƯỚI MÁI TRƯỜNG'},
  69:{txt:'“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”',by:'TIẾP BƯỚC TRUYỀN THỐNG'},
  73:{txt:'“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”',by:'50 NĂM MỘT CHẶNG ĐƯỜNG (1966 — 2016)'},
  118:{txt:'“Sáu mươi năm — một chặng đường vinh quang. Dù ở bất cứ nơi đâu, chỉ cần ngoảnh lại, Quế Võ số 1 vẫn luôn là ngôi nhà chan chứa tình thương đón ta trở về.”',by:'HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1'}
};

const getQuoteFallback=(p:Page,idx:number,allPages:Page[]=[]):{txt:string;by:string}=>{
  if(DEFAULT_TEXT_MAP[idx]?.txt&&p.t==='q'){
    return {txt:DEFAULT_TEXT_MAP[idx]!.txt!,by:DEFAULT_TEXT_MAP[idx]?.by||'THẦY TRÒ QUẾ VÕ SỐ 1'};
  }
  const nextP=allPages[idx+1];
  const nextTitle=(nextP?.title||'').toLowerCase();
  if(nextTitle.includes('lược sử')||idx===1){
    return {txt:'“Nơi đây, mỗi viên gạch đều thuộc về một ký ức.”',by:'THẦY TRÒ QUẾ VÕ SỐ 1'};
  }
  if(nextTitle.includes('8a')||nextTitle.includes('1972')||nextTitle.includes('những viên gạch')){
    return {txt:'“Những năm tháng bom đạn sơ tán, lớp học dựng bằng tre nứa giữa lòng dân; ngọn đèn dầu soi sáng từng trang sách, thắp lên ngọn lửa hiếu học Quế Võ.”',by:'KÝ ỨC NHỮNG NGÀY ĐẦU (1966 – 1975)'};
  }
  if(nextTitle.includes('gian khó')||nextTitle.includes('giữ lửa')){
    return {txt:'“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”',by:'GIỮ LỬA QUA NĂM THÁNG'};
  }
  if(nextTitle.includes('1984')||nextTitle.includes('1985')||nextTitle.includes('k18')){
    return {txt:'“Tuổi mười tám rực rỡ như hoa phượng đầu hạ. Chúng tôi rời trường mang theo lời thầy dặn, đi muôn phương dựng xây đất nước.”',by:'KHÓA 1982 — 1985 (K18)'};
  }
  if(nextTitle.includes('1993')||nextTitle.includes('1994')||nextTitle.includes('k27')){
    return {txt:'“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”',by:'NIÊN KHÓA 1993 — 1994 (K27)'};
  }
  if(nextTitle.includes('1996')||nextTitle.includes('phượng')||nextTitle.includes('k29')){
    return {txt:'“Dẫu thời gian có trôi đi như bóng câu qua cửa sổ, tiếng trống trường ngày khai giảng năm ấy vẫn vang vọng mãi trong tim.”',by:'HOÀI NIỆM MỘT THỜI ÁO TRẮNG'};
  }
  if(nextTitle.includes('thầy cô')||nextTitle.includes('nhà trường')){
    return {txt:'“Có một nghề bụi phấn bám đầy tay, người ta bảo đó là nghề cao quý nhất. Tri ân những người đưa đò thầm lặng đã chở bao thế hệ qua sông.”',by:'TRI ÂN THẦY CÔ QUẾ VÕ 1'};
  }
  if(nextTitle.includes('12a7')||nextTitle.includes('lưu bút')){
    return {txt:'“Những dòng lưu bút viết vội ngày chia tay, cái ôm thật chặt trước cổng trường. Tạm biệt nhé, thanh xuân tươi đẹp nhất của chúng mình!”',by:'LƯU BÚT TUỔI HỌC TRÒ'};
  }
  if(nextTitle.includes('12a1')||nextTitle.includes('thanh xuân')){
    return {txt:'“Thời gian có thể làm phai mờ màu mực, nhưng không thể xóa nhòa tiếng cười giòn tan nơi góc lớp thân thương.”',by:'THANH XUÂN DƯỚI MÁI TRƯỜNG'};
  }
  if(nextTitle.includes('2009')||nextTitle.includes('2011')||nextTitle.includes('tiếp bước')){
    return {txt:'“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”',by:'TIẾP BƯỚC TRUYỀN THỐNG'};
  }
  if(nextTitle.includes('50 năm')||nextTitle.includes('kỷ niệm 50')){
    return {txt:'“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”',by:'50 NĂM MỘT CHẶNG ĐƯỜNG (1966 — 2016)'};
  }
  return {txt:'“Sáu mươi năm — một chặng đường vinh quang. Dù ở bất cứ nơi đâu, chỉ cần ngoảnh lại, Quế Võ số 1 vẫn luôn là ngôi nhà chan chứa tình thương đón ta trở về.”',by:'HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1'};
};

const HISTORY_FALLBACKS:Record<string,string>={
  'Những ngày đầu thành lập (1965–1970)':'Khóa học đầu tiên của trường được khai giảng vào tháng 10/1965. Đến năm 1966, Trường cấp 3 Quế Võ chính thức được thành lập, đặt nền móng cho giáo dục trung học phổ thông của địa phương. Năm học đầu tiên, trường có 4 lớp với 152 học sinh. Mùa hè năm 1970, trường chuyển địa điểm sang một thôn khác trong tỉnh Bắc Ninh; trong điều kiện đất nước còn nhiều khó khăn, thầy và trò vẫn duy trì dạy và học, từng bước xây dựng nền nếp.',
  'Từng bước phát triển (1981–1988)':'Đây là giai đoạn nhà trường tiếp tục mở rộng hoạt động dạy học, số lượng học sinh ngày càng tăng. Các thế hệ cán bộ, giáo viên và học sinh cùng góp sức xây dựng truyền thống hiếu học, đoàn kết và vượt khó.',
  'Đổi tên, khẳng định vị thế (1991–2000)':'Năm 1991, Trường cấp 3 Quế Võ được đổi tên thành Trường THPT Quế Võ, đánh dấu một mốc mới trong quá trình phát triển. Đến năm học 1999–2000, nhà trường chính thức mang tên Trường THPT Quế Võ số 1, tiếp tục khẳng định vị thế trong hệ thống giáo dục tỉnh Bắc Ninh, chú trọng nâng cao chất lượng dạy học và bồi dưỡng học sinh giỏi.',
  '50 năm một chặng đường (2016)':'Ngày 13/11/2016, trường tổ chức lễ kỷ niệm 50 năm thành lập. Quy mô nhà trường đã phát triển từ 4 lớp, 152 học sinh lên 45 lớp với gần 2.000 học sinh. Năm học 2015–2016, trường được Bộ Giáo dục và Đào tạo tặng Cờ đơn vị dẫn đầu phong trào thi đua.',
  'Danh hiệu và thành tích':'Huân chương Lao động hạng Ba (năm học 2003–2004), Cờ thi đua của Thủ tướng Chính phủ cùng nhiều Bằng khen của Bộ Giáo dục và Đào tạo, UBND tỉnh Bắc Ninh. Năm học 2023–2024: 78 giải học sinh giỏi cấp tỉnh (6 Nhất, 28 Nhì, 17 Ba, 27 Khuyến khích), 631/631 thí sinh đỗ tốt nghiệp THPT. Năm học 2024–2025: 7 giải Nhất, trường đón 775 học sinh lớp 10, tổng số học sinh vượt 2.000 em.',
  'Đổi mới và chuyển đổi số (2020–2026)':'Nhà trường đẩy mạnh đổi mới phương pháp dạy học và ứng dụng công nghệ; năm học 2025–2026 tham gia triển khai chương trình học Toán thích ứng ứng dụng trí tuệ nhân tạo (AI), dẫn đầu tỉnh về tỷ lệ học sinh học tập trên nền tảng số. Học sinh nhà trường dẫn đầu toàn quốc về số lượng tham gia chiến dịch trực tuyến “Tiếp sức mùa thi 2026”.',
  'Hôm nay và mai sau':'Trải qua 60 năm xây dựng và phát triển, Trường THPT Quế Võ số 1 đã viết nên một chặng đường đáng tự hào của giáo dục Bắc Ninh. Thành quả hôm nay là kết tinh nỗ lực của nhiều thế hệ cán bộ quản lý, giáo viên, nhân viên và học sinh. Phát huy truyền thống hiếu học của vùng đất Kinh Bắc, nhà trường tiếp tục hướng tới đào tạo những thế hệ học sinh có kiến thức, đạo đức, bản lĩnh và khát vọng cống hiến cho xã hội.'
};

const getHistoryFallback=(title?:string,idx?:number):string=>{
  if(typeof idx==='number'&&DEFAULT_TEXT_MAP[idx]?.txt)return DEFAULT_TEXT_MAP[idx]!.txt!;
  if(!title)return '';
  const clean=title.replace(/[\-–—]/g,'–').replace(/\s+/g,' ').trim();
  for(const [k,v] of Object.entries(HISTORY_FALLBACKS)){
    const cleanK=k.replace(/[\-–—]/g,'–').replace(/\s+/g,' ').trim();
    if(clean===cleanK||clean.includes(cleanK)||cleanK.includes(clean))return v;
  }
  return '';
};

const DEFAULT_PAGE_MAP:Record<number,Partial<Page>>={
  26:{
    t:'open',
    kind:'class',
    title:'Ảnh năm 1993 – 1994',
    yrs:'1993 – 1994',
    txt:'Những khoảnh khắc được lưu giữ.',
  }
};

export function calcKFromYear(yearOrStr: string | number | undefined): number | null {
  if (!yearOrStr) return null;
  if (typeof yearOrStr === 'number') {
    return yearOrStr >= 1966 ? (yearOrStr - 1966) : (yearOrStr > 0 && yearOrStr <= 100 ? yearOrStr : null);
  }
  const str = String(yearOrStr);
  const kMatch = str.match(/\b(?:K|Khóa)\s*(\d{1,2})\b/i);
  if (kMatch) return parseInt(kMatch[1], 10);
  const m = str.match(/\b(19\d{2}|20\d{2})\b/);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  return y >= 1966 ? (y - 1966) : null;
}

const patchPages=(rawPages:Page[]):Page[]=>{
  const defPages=defaultPages();
  if(!rawPages||!Array.isArray(rawPages)||rawPages.length<151){
    return defPages;
  }
  let pages=rawPages;

  return pages.map((p,idx)=>{
    let txt=p.txt;
    let by=p.by;
    let title=p.title;
    let yrs=p.yrs;
    let kind=p.kind;
    const def=DEFAULT_PAGE_MAP[idx];
    if(def){
      if(!title||title.trim()==='')title=def.title;
      if(!yrs||yrs.trim()==='')yrs=def.yrs;
      if(!kind)kind=def.kind;
      if(!txt||txt.includes('Khóa học đầu tiên'))txt=def.txt;
    }

    // 1. Cập nhật tiêu đề & niên khóa theo chuẩn Lớp + Khóa & Kỷ niệm 50 năm
    if(idx===74||(p.t==='open'&&title&&title.includes('50 năm'))){
      title='Kỷ niệm 50 năm thành lập trường';
      yrs='1966 — 2016';
    }else if(idx===16||(title&&title.includes('Lớp 8A'))){
      if(!yrs||yrs==='Khóa 1972 – 1975')yrs='Khóa 1972 – 1975 (K6)';
    }else if(idx===22){
      if(!yrs||yrs==='1984 – 1985')yrs='Khóa 1982 – 1985 (K18)';
    }else if(idx===26){
      if(!yrs||yrs==='1993 – 1994')yrs='1993 – 1994 (K27)';
    }else if(idx===32){
      title='Kỷ niệm 30 năm thành lập trường';
      yrs='1966 — 1996';
    }else if(idx===36||idx===42||idx===52){
      yrs='Khóa 31 (1997 – 2000)';
    }else if(idx===48){
      yrs='Khóa 1997 – 2000 (K31)';
    }else if(idx===54){
      yrs='Khóa 1998 – 2001 (K32)';
    }else if(idx===58||idx===60||idx===62||idx===64){
      yrs='Khóa 2003 – 2006 (K37)';
    }else if(idx===66){
      yrs='Khóa 2004 – 2007 (K38)';
    }else if(idx===70){
      yrs='Khóa 2008 – 2011 (K43)';
    }else if(idx===80){
      yrs='Khóa 2017 – 2020 (K51)';
    }else if(title&&title.includes('11A1')){
      yrs='Khóa 59 (2025 – 2028)';
    }else if(title&&(title.includes('11A2')||title.includes('11A4')||title.includes('11A10')||title.includes('11A11')||title.includes('11A12'))){
      yrs='Khóa 59 (2024 – 2027)';
    }

    // 2. Điền tự động chú thích toàn bộ các trang ảnh (Lớp + Khóa & Kỷ niệm 50 năm)
    let s=p.s;
    if(p.s&&p.s.length>0){
      s=p.s.map(slot=>{
        const cleanSrc=(slot.src||'').replace('i4ylyd7er3r63ity.public.blob.vercel-storage.com','gxq1ht10fih6sw0u.public.blob.vercel-storage.com');
        const src=cleanSrc;
        const cap=slot.cap||'';
        const isBlank=!cap||cap.trim()===''||cap==='\xa0'||cap==='Chú thích ký ức…'||cap==='Tên video…'||cap==='Chú thích…';
        if(!isBlank&&!cap.startsWith('Cựu học sinh Lớp 8A')&&!cap.startsWith('Tập thể Lớp 11A1')){
          return {...slot,src:cleanSrc};
        }
        let newCap='';
        if(src.includes('ky-niem-50-nam')||(idx>=75&&idx<=79)){
          newCap='Kỷ niệm 50 năm thành lập trường';
        }else if(src.includes('ky-niem-30-nam')||idx===33){
          newCap='Kỷ niệm 30 năm thành lập trường';
        }else if(src.includes('lop-11a1')){
          newCap='Tập thể Lớp 11A1 Khóa 59';
        }else if(src.includes('lop-8a')||idx===17||idx===18){
          newCap='Cựu học sinh Lớp 8A K6';
        }else if(src.includes('lop-12a7')||idx===49||idx===50){
          newCap='Cựu học sinh Lớp 12A7 K31';
        }else if(src.includes('lop-12a1')||idx===55){
          newCap='Cựu học sinh Lớp 12A1 K32';
        }else if(src.includes('giao-vien-va-nha-truong')||(idx>=43&&idx<=46)){
          newCap='Thầy cô & Nhà trường · Khóa 31';
        }else if(src.includes('khoa-1997-2000')||(idx>=37&&idx<=40)||idx===53){
          newCap='Cựu học sinh Khóa 31 (1997 – 2000)';
        }else if(src.includes('khoa-2003-2006')||(idx>=59&&idx<=65)){
          if(src.includes('xuan-2003')||idx===59)newCap='Cựu học sinh Khóa 37 · Xuân 2003';
          else if(src.includes('nam-2004')||idx===61)newCap='Cựu học sinh Khóa 37 · Năm 2004';
          else if(src.includes('nam-2006')||idx===63)newCap='Cựu học sinh Khóa 37 · Năm 2006';
          else newCap='Cựu học sinh Khóa 37 (2003 – 2006)';
        }else if(src.includes('khoa-2004-2007')||idx===67){
          newCap='Cựu học sinh Khóa 38 (2004 – 2007)';
        }else if(src.includes('khoa-2009-2011')||idx===71){
          newCap='Cựu học sinh Khóa 43 (2009 – 2011)';
        }else if(src.includes('khoa-2017-2020')||idx===81){
          newCap='Cựu học sinh Khóa 51 (2017 – 2020)';
        }else if(src.includes('1984-1985')||idx===23){
          newCap='Cựu học sinh Khóa 18 (1984 – 1985)';
        }else if(src.includes('1993-1994')||idx===27){
          newCap='Cựu học sinh niên khóa 1993 – 1994';
        }else if(src.includes('1996')||idx===31){
          newCap='Hình ảnh kỷ niệm năm 1996';
        }else if(src.includes('ngay-20-11-2001')||idx===57){
          newCap='Kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2001';
        }else if(src.includes('12E_2')||idx===99){
          newCap='Lớp 12E2 K27 (1993 – 1996)';
        }
        if(newCap&&isBlank){
          return {...slot,src:cleanSrc,cap:newCap};
        }
        return {...slot,src:cleanSrc};
      });
    }

    if(p.t==='q'){
      const qFb=getQuoteFallback(p,idx,pages);
      if(!txt||txt.trim()==='')txt=qFb.txt;
      if(!by||by.trim()==='')by=qFb.by;
    }else{
      const hasTxt=txt&&txt.trim().length>0;
      const hasBy=by&&by.trim().length>0;
      if(!hasTxt){
        const fb=getHistoryFallback(title,idx);
        if(fb)txt=fb;
      }
      if(!hasBy&&DEFAULT_TEXT_MAP[idx]?.by){
        by=DEFAULT_TEXT_MAP[idx].by;
      }
    }

    if(txt!==p.txt||by!==p.by||title!==p.title||yrs!==p.yrs||kind!==p.kind||s!==p.s){
      return {...p,title,yrs,kind,txt,by,s};
    }
    return p;
  });
};

function DoodleScore10({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 100 80' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g transform='rotate(-6 50 40)'>
        <circle cx='50' cy='40' r='32' stroke='#c0392b' strokeWidth='2' strokeDasharray='90 8' opacity='0.55'/>
        <circle cx='50' cy='40' r='28' stroke='#c0392b' strokeWidth='0.8' opacity='0.4'/>
        <text x='49' y='47' textAnchor='middle' fontSize='30' fontWeight='bold' fontFamily="'Caveat', cursive" fill='#c0392b' opacity='0.62'>10</text>
        <path d='M30 54 Q50 58 70 52' stroke='#c0392b' strokeWidth='2' strokeLinecap='round' opacity='0.5'/>
        <path d='M50 16 L52 21 L57 21 L53 24 L55 29 L50 26 L45 29 L47 24 L43 21 L48 21 Z' fill='#c0392b' opacity='0.45'/>
      </g>
    </svg>
  );
}

function DoodleScore10Flower({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 100 85' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g transform='rotate(4 50 42)'>
        {Array.from({length:8}).map((_,k)=>{
          const a=(k*Math.PI*2)/8;
          const x=50+Math.cos(a)*26,y=40+Math.sin(a)*26;
          return <circle key={k} cx={x} cy={y} r='8' fill='#e74c3c' fillOpacity='0.16' stroke='#c0392b' strokeWidth='0.8' opacity='0.45'/>;
        })}
        <circle cx='50' cy='40' r='23' fill='#fffdf5' fillOpacity='0.6' stroke='#c0392b' strokeWidth='1.4' opacity='0.55'/>
        <text x='50' y='46' textAnchor='middle' fontSize='22' fontWeight='bold' fontFamily="'Caveat', cursive" fill='#c0392b' opacity='0.65'>10</text>
        <text x='50' y='55' textAnchor='middle' fontSize='7.5' fontFamily="'Be Vietnam Pro', sans-serif" fontWeight='600' letterSpacing='1' fill='#c0392b' opacity='0.55'>XUẤT SẮC</text>
      </g>
    </svg>
  );
}

function DoodleBooks({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 120 90' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g opacity='0.34' stroke='#8a5a22' strokeWidth='1.2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M15 70 L95 70 L105 58 L25 58 Z' fill='#e8d398' fillOpacity='0.35'/>
        <path d='M15 70 C15 74 17 76 22 76 L102 76 C105 76 107 74 105 70'/>
        <path d='M22 76 L22 70'/>
        <line x1='30' y1='70' x2='30' y2='76'/>
        <line x1='35' y1='70' x2='35' y2='76'/>
        <g transform='rotate(-4 55 50)'>
          <path d='M20 54 L90 54 L98 44 L28 44 Z' fill='#f2e3b6' fillOpacity='0.4'/>
          <path d='M20 54 C20 58 22 60 26 60 L96 60 C99 60 100 58 98 54'/>
          <line x1='36' y1='54' x2='36' y2='60'/>
          <path d='M85 48 C88 56 86 64 89 68 L92 65 L95 68 C94 62 93 54 91 47' fill='#c0392b' fillOpacity='0.45' stroke='#c0392b' strokeWidth='0.8'/>
        </g>
        <g transform='rotate(3 60 36)'>
          <path d='M32 40 C42 36 50 37 58 40 C66 37 74 36 84 40 L80 26 C72 23 65 24 58 27 C51 24 44 23 36 26 Z' fill='#fffdf5' fillOpacity='0.5'/>
          <line x1='58' y1='27' x2='58' y2='40' strokeWidth='1.4'/>
        </g>
      </g>
    </svg>
  );
}

function DoodleStationery({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 110 80' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g opacity='0.34' stroke='#8a5a22' strokeWidth='1.2' strokeLinecap='round' strokeLinejoin='round'>
        <g transform='rotate(-28 50 40)'>
          <rect x='20' y='32' width='60' height='7' rx='1' fill='#e8c078' fillOpacity='0.35'/>
          <rect x='80' y='32' width='6' height='7' fill='#b0b0b0' fillOpacity='0.5'/>
          <rect x='86' y='32' width='10' height='7' rx='2' fill='#e74c3c' fillOpacity='0.4'/>
          <polygon points='20,32 10,35.5 20,39' fill='#f5deb3' fillOpacity='0.6'/>
          <polygon points='13,34.5 10,35.5 13,36.5' fill='#3b2a17' fillOpacity='0.7'/>
          <line x1='20' y1='35.5' x2='80' y2='35.5' strokeWidth='0.6'/>
        </g>
        <g transform='translate(15, 38) rotate(12)'>
          <rect x='0' y='0' width='28' height='16' rx='2' fill='#fffdf5' fillOpacity='0.6'/>
          <rect x='10' y='0' width='18' height='16' rx='1' fill='#3498db' fillOpacity='0.3'/>
          <text x='18' y='11' fontSize='7' fontFamily='sans-serif' fontWeight='bold' fill='#3b2a17' opacity='0.5' stroke='none'>2B</text>
        </g>
        <path d='M78 52 Q84 46 88 52 Q92 58 96 52' strokeWidth='0.8' strokeDasharray='2 2'/>
      </g>
    </svg>
  );
}

function DoodleAirplane({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 120 85' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path d='M12 70 C24 72 38 60 36 46 C34 32 18 36 22 50 C26 62 48 58 72 36' stroke='#8a5a22' strokeWidth='1' strokeDasharray='3 3' opacity='0.28' fill='none'/>
      <g transform='translate(70, 18) rotate(14)'>
        <path d='M0 16 L32 0 L18 28 L14 18 Z' fill='#fffdf5' fillOpacity='0.5' stroke='#8a5a22' strokeWidth='1.2' strokeLinejoin='round' opacity='0.4'/>
        <path d='M32 0 L14 18 L6 20 Z' fill='#ecd9a6' fillOpacity='0.4' stroke='#8a5a22' strokeWidth='1.2' strokeLinejoin='round' opacity='0.4'/>
        <line x1='32' y1='0' x2='14' y2='18' stroke='#8a5a22' strokeWidth='1.2' opacity='0.4'/>
      </g>
      <path d='M96 14 L97 10 L98 14 L102 15 L98 16 L97 20 L96 16 L92 15 Z' fill='#c0392b' opacity='0.35'/>
      <path d='M62 48 L63 45 L64 48 L67 49 L64 50 L63 53 L62 50 L59 49 Z' fill='#e67e22' opacity='0.35'/>
    </svg>
  );
}

function DoodleRuler({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 110 80' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g opacity='0.34' stroke='#8a5a22' strokeWidth='1.2' strokeLinecap='round' strokeLinejoin='round'>
        <polygon points='12,68 82,68 12,18' fill='#fffdf5' fillOpacity='0.35'/>
        <polygon points='22,62 62,62 22,34' fill='#f2e8cf' fillOpacity='0.3'/>
        <line x1='22' y1='68' x2='22' y2='65'/>
        <line x1='32' y1='68' x2='32' y2='64'/>
        <line x1='42' y1='68' x2='42' y2='65'/>
        <line x1='52' y1='68' x2='52' y2='64'/>
        <line x1='62' y1='68' x2='62' y2='65'/>
        <line x1='72' y1='68' x2='72' y2='64'/>
        <g transform='translate(45, 12) rotate(38)'>
          <rect x='0' y='4' width='46' height='5' rx='1' fill='#2c3e50' fillOpacity='0.35'/>
          <rect x='36' y='3.5' width='8' height='6' fill='#f39c12' fillOpacity='0.4'/>
          <path d='M0 4.5 L-8 6.5 L0 8.5 Z' fill='#d4af37' fillOpacity='0.6'/>
          <line x1='0' y1='6.5' x2='-6' y2='6.5' strokeWidth='0.7'/>
        </g>
      </g>
    </svg>
  );
}

function PageDoodle({pageIndex,type,count}:{pageIndex:number;type:string;count?:number}){
  if(type==='cover'||type==='end')return null;
  if((type==='ph'||type==='pr')&&typeof count==='number'&&count>2)return null;
  if(type==='vd'||type==='vd1')return null;
  const variant=(pageIndex*3+2)%8;
  const isLeft=pageIndex%2===1;
  const sideCls=isLeft?'doodle-l':'doodle-r';
  switch(variant){
    case 0:return <DoodleScore10 className={`watermark doodle-score ${sideCls}`}/>;
    case 1:return <DoodleBooks className={`watermark doodle-books ${sideCls}`}/>;
    case 2:return <DoodleAirplane className={`watermark doodle-plane ${sideCls}`}/>;
    case 3:return <DoodleStationery className={`watermark doodle-stationery ${sideCls}`}/>;
    case 4:return <DoodleFountainPenInk className={`watermark doodle-ink ${sideCls}`}/>;
    case 5:return <DoodleRuler className={`watermark doodle-ruler ${sideCls}`}/>;
    case 6:return <DoodleScore10Flower className={`watermark doodle-score ${sideCls}`}/>;
    case 7:return <DoodleCompass className={`watermark doodle-compass ${sideCls}`}/>;
    default:return <DoodleBooks className={`watermark doodle-books ${sideCls}`}/>;
  }
}

function DoodleFountainPenInk({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 115 80' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g opacity='0.36' stroke='#8a5a22' strokeWidth='1.2' strokeLinecap='round' strokeLinejoin='round'>
        <g transform='translate(18, 28)'>
          <rect x='6' y='0' width='14' height='6' rx='1' fill='#5c3d2e' fillOpacity='0.4'/>
          <path d='M3 6 L23 6 L26 12 L26 36 L0 36 L0 12 Z' fill='#3a2618' fillOpacity='0.25'/>
          <rect x='4' y='14' width='18' height='16' rx='1' fill='#fffdf5' fillOpacity='0.6'/>
          <text x='13' y='25' textAnchor='middle' fontSize='6' fontFamily="'Be Vietnam Pro', sans-serif" fontWeight='700' fill='#6c3483' stroke='none'>MỰC</text>
          <path d='M2 30 Q13 28 24 30 L24 35 Q13 36 2 35 Z' fill='#5b2c6f' fillOpacity='0.35' stroke='none'/>
        </g>
        <g transform='translate(45, 14) rotate(42)'>
          <rect x='0' y='3' width='56' height='6' rx='1' fill='#873600' fillOpacity='0.45'/>
          <rect x='42' y='2' width='10' height='8' rx='1' fill='#d4ac0d' fillOpacity='0.5'/>
          <path d='M0 3 L-9 6 L0 9 Z' fill='#d4ac0d' fillOpacity='0.7'/>
          <line x1='-1' y1='6' x2='-7' y2='6' stroke='#3e2723' strokeWidth='0.8'/>
        </g>
        <circle cx='86' cy='62' r='2' fill='#5b2c6f' fillOpacity='0.45' stroke='none'/>
        <circle cx='93' cy='66' r='1.2' fill='#5b2c6f' fillOpacity='0.4' stroke='none'/>
      </g>
    </svg>
  );
}

function DoodleCompass({className}:{className?:string}){
  return (
    <svg className={className} viewBox='0 0 105 85' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <g opacity='0.35' stroke='#8a5a22' strokeWidth='1.2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M15 72 A42 42 0 0 1 78 72' stroke='#8a5a22' strokeWidth='1' strokeDasharray='3 3' fill='none'/>
        <circle cx='46' cy='18' r='4' fill='#d4ac0d' fillOpacity='0.6'/>
        <line x1='46' y1='10' x2='46' y2='14' strokeWidth='1.8'/>
        <line x1='44' y1='21' x2='26' y2='68' strokeWidth='1.6'/>
        <polygon points='25,68 27,68 26,73' fill='#333'/>
        <line x1='48' y1='21' x2='66' y2='58' strokeWidth='1.6'/>
        <rect x='64' y='56' width='6' height='14' rx='1' transform='rotate(18 64 56)' fill='#e67e22' fillOpacity='0.5'/>
        <polygon points='68,70 70,70 69,74' fill='#333'/>
        <path d='M88 28 L89 25 L90 28 L93 29 L90 30 L89 33 L88 30 L85 29 Z' fill='#e67e22' opacity='0.5' stroke='none'/>
      </g>
    </svg>
  );
}

async function blobUp(path:string,file:Blob,multipart?:boolean):Promise<string>{
  const t=auth&&auth.currentUser?await auth.currentUser.getIdToken():'';
  const r=await upload(path,file,{access:'public',handleUploadUrl:'/api/upload',clientPayload:t,multipart:!!multipart});
  return r.url;
}

async function toSrc(f:File,k:number):Promise<string>{
  if(!(auth&&auth.currentUser))return URL.createObjectURL(f);
  const bm=await createImageBitmap(f);const sc=Math.min(1,1400/Math.max(bm.width,bm.height));
  const c=document.createElement('canvas');c.width=Math.round(bm.width*sc);c.height=Math.round(bm.height*sc);
  c.getContext('2d')!.drawImage(bm,0,0,c.width,c.height);
  const b:Blob=await new Promise(r=>c.toBlob(x=>r(x as Blob),'image/jpeg',0.8));
  return blobUp(`photos/${Date.now()}-${k}.jpg`,b);
}

function RotImg({src,rot,zoom}:{src:string;rot:number;zoom:number}){
  const ref=useRef<HTMLDivElement>(null);
  const [sz,setSz]=useState({w:0,h:0});
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const upd=()=>setSz({w:el.clientWidth,h:el.clientHeight});
    upd();
    const ro=new ResizeObserver(upd);ro.observe(el);
    return()=>ro.disconnect();
  },[]);
  const swap=rot%180!==0;
  const w=swap?sz.h:sz.w,h=swap?sz.w:sz.h;
  return <div ref={ref} style={{position:'absolute',inset:0,overflow:'hidden'}}><div style={{position:'absolute',left:'50%',top:'50%',width:w,height:h,marginLeft:-w/2,marginTop:-h/2,backgroundImage:`url('${src}')`,backgroundSize:'cover',backgroundPosition:'center',transform:`rotate(${rot}deg) scale(${zoom})`}}/></div>;
}

export default function Book(){
  const [P,setPs]=useState<Page[]>(defaultPages);
  const Pref=useRef<Page[]>(P);
  Pref.current=P;
  const hist=useRef<Page[][]>([]);
  const [hn,setHn]=useState(0);
  const [cur,setCur]=useState(0);
  const [half,setHalf]=useState(false);
  const [narrow,setNarrow]=useState(false);
  const [mv,setMv]=useState<number[]>([]);
  const [edit,setEdit]=useState(false);
  const [menu,setMenu]=useState<number|null>(null);
  const [modal,setModal]=useState(false);
  const [toc,setToc]=useState(false);
  const [lb,setLb]=useState<LB|null>(null);
  const [msg,setMsg]=useState('');
  const [intro,setIntro]=useState(true);
  const [err,setErr]=useState('');
  const [u,setU]=useState('');const [pw,setPw]=useState('');
  const [lg,setLg]=useState({x:14,y:12,s:64});
  const [lgMode,setLgMode]=useState<'cover'|'corner'|'end'>('cover');
  const [lgReady,setLgReady]=useState(false);
  const [lgAnim,setLgAnim]=useState(false);
  const [logoOk,setLogoOk]=useState(true);
  const fi=useRef<HTMLInputElement>(null);
  const vfi=useRef<HTMLInputElement>(null);
  const tilt=useRef<HTMLDivElement>(null);
  const sealRef=useRef<HTMLDivElement>(null);
  const endRef=useRef<HTMLDivElement>(null);
  const placed=useRef(false);
  const tx0=useRef<{x:number;y:number}|null>(null);
  const pick=useRef({p:0,s:0});
  const pickV=useRef({p:0,s:0});
  const tm=useRef<any>(null);
  const raf=useRef(0);
  const N=P.length/2;
  const maxCur=N+1;
  const toast=(t:string)=>{setMsg(t);clearTimeout(tm.current);tm.current=setTimeout(()=>setMsg(''),3600)};
  // mọi chỉnh sửa đi qua setP để có thể hoàn tác
  const setP=(v:Page[]|((p:Page[])=>Page[]))=>{
    const next=typeof v==='function'?(v as (p:Page[])=>Page[])(Pref.current):v;
    if(next===Pref.current)return;
    hist.current.push(Pref.current);
    if(hist.current.length>80)hist.current.shift();
    setHn(hist.current.length);
    Pref.current=next;
    setPs(next);
  };
  const loadP=(arr:Page[])=>{hist.current=[];setHn(0);Pref.current=arr;setPs(arr)};
  const undo=()=>{
    const h=hist.current.pop();
    setHn(hist.current.length);
    if(!h){toast('Không còn gì để hoàn tác');return}
    Pref.current=h;setPs(h);toast('Đã hoàn tác');
  };
  const commit=(n:Page[])=>setP(norm(n));

  useEffect(()=>{
    const f=()=>{
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      const nw=innerWidth<700||innerWidth<innerHeight;
      document.documentElement.classList.toggle('narrow',nw);
      setNarrow(nw);
      if(!nw)setHalf(false);
    };
    f();
    addEventListener('resize',f);addEventListener('orientationchange',f);
    return()=>{removeEventListener('resize',f);removeEventListener('orientationchange',f);document.documentElement.classList.remove('narrow')};
  },[]);

  useEffect(()=>{
    if(cur>maxCur){setCur(Math.max(0,maxCur));setHalf(false)}
  },[maxCur]);

  useEffect(()=>{
    if(db)getDoc(doc(db,'book','main')).then(s=>{const d:any=s.data();if(d&&d.pages&&d.pages.length%2===0)loadP(patchPages(d.pages))}).catch(()=>{});
    if(auth)return onAuthStateChanged(auth,usr=>{
      if(!usr){setEdit(false);return}
      if(EDITORS.includes((usr.email||'').toLowerCase())){setEdit(true)}else{toast('Tài khoản này chưa được cấp quyền biên tập');signOut(auth!)}
    });
  },[]);

  useEffect(()=>{
    try{
      const p=new URLSearchParams(window.location.search).get('p');
      if(p){
        const pg=parseInt(p,10);
        if(!isNaN(pg)&&pg>0){
          setIntro(false);
          setTimeout(()=>goPage(pg),400);
        }
      }
    }catch(_){}
  },[]);

  useEffect(()=>{
    const k=(e:KeyboardEvent)=>{
      const t=e.target as HTMLElement;
      if(t.isContentEditable||t.tagName==='INPUT')return;
      if((e.ctrlKey||e.metaKey)&&(e.key==='z'||e.key==='Z')&&edit){e.preventDefault();undo();return}
      if(e.key==='ArrowRight')step(1);
      if(e.key==='ArrowLeft')step(-1);
      if(e.key==='Escape'){setLb(null);setToc(false);setMenu(null)}
    };
    addEventListener('keydown',k);return()=>removeEventListener('keydown',k);
  });

  useEffect(()=>{
    const mode:'cover'|'corner'|'end'=cur===0?'cover':cur===N?'end':'corner';
    setLgMode(mode);
    const place=()=>{
      if(mode==='corner'){const sm=innerWidth<640;setLg({x:sm?10:18,y:sm?10:14,s:sm?46:64});placed.current=true;setLgReady(true);return}
      const el=mode==='cover'?sealRef.current:endRef.current;
      if(!el)return;
      const r=el.getBoundingClientRect();
      if(r.width<10||r.height<10)return;
      const s=Math.min(r.width,r.height);
      setLg({x:r.left+(r.width-s)/2,y:r.top+(r.height-s)/2,s});placed.current=true;setLgReady(true);
    };
    const delay=mode==='corner'?0:mode==='end'?1000:(placed.current?1450:80);
    const t1=setTimeout(place,delay);
    addEventListener('resize',place);
    return()=>{clearTimeout(t1);removeEventListener('resize',place)};
  },[cur,N,intro,narrow]);

  useEffect(()=>{
    if(!lgReady)return;
    const t=setTimeout(()=>setLgAnim(true),200);
    return()=>clearTimeout(t);
  },[lgReady]);

  const flip=(c:number,h:boolean)=>{
    if(c===cur&&h===half)return;
    const a=Math.min(c,cur),b=Math.max(c,cur);const m:number[]=[];for(let j=a;j<b;j++)m.push(j);
    setMenu(null);
    setMv(m);setCur(c);setHalf(h);
    if(tilt.current)tilt.current.style.transform='none';
    setTimeout(()=>setMv([]),1400);
  };
  const go=(n:number)=>{
    n=Math.max(0,Math.min(maxCur,n));
    if(narrow){const pg=n===0?0:2*n-1;flip(Math.ceil(pg/2),pg%2===1)}else flip(n,false);
  };
  const goPage=(pg:number)=>{
    if(!narrow){go(Math.ceil(pg/2));return}
    pg=Math.max(0,Math.min(2*maxCur-1,pg));
    flip(Math.ceil(pg/2),pg%2===1);
  };
  const step=(d:number)=>{
    if(!narrow){go(cur+d);return}
    const now=2*cur-(half?1:0);
    goPage(now+d);
  };
  const logoClick=()=>{if(lgMode!=='corner')return;setToc(false);setLb(null);go(0);setIntro(true)};
  const onTS=(e:React.TouchEvent)=>{const t=e.touches[0];tx0.current={x:t.clientX,y:t.clientY}};
  const onTE=(e:React.TouchEvent)=>{
    const s=tx0.current;tx0.current=null;
    if(!s||toc||lb||modal||intro)return;
    const t=e.changedTouches[0];const dx=t.clientX-s.x,dy=t.clientY-s.y;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){
      if((e.target as HTMLElement).closest('[contenteditable=true]'))return;
      if(edit)return;
      step(dx<0?1:-1);
    }
  };
  const setF=(i:number,f:string,v:any)=>setP(P.map((p,j)=>j===i?{...p,[f]:v}:p));
  const setCap=(i:number,k:number,v:string)=>setP(P.map((p,j)=>j===i&&p.s?{...p,s:p.s.map((s,m)=>m===k?{...s,cap:v}:s)}:p));
  const setSlot=(i:number,k:number,patch:any)=>setP(prev=>prev.map((p,j)=>j===i&&p.s?{...p,s:p.s.map((s,m)=>m===k?{...s,...patch}:s)}:p));

  const setTextSz=(i:number,field:string,delta:number)=>{
    const curSz=(P[i] as any)[field+'Sz']??1;
    const nextSz=Math.max(0.5,Math.min(2.5,Math.round((curSz+delta)*10)/10));
    setF(i,field+'Sz',nextSz);
    toast(`Cỡ chữ: ${Math.round(nextSz*100)}%`);
  };

  const setTextW=(i:number,field:string,deltaPct:number)=>{
    const curW=(P[i] as any)[field+'W']??100;
    const num=typeof curW==='number'?curW:parseInt(curW,10)||100;
    const nextW=Math.max(20,Math.min(100,Math.round((num+deltaPct)/5)*5));
    setF(i,field+'W',nextW);
    toast(`Độ rộng khung: ${nextW}%`);
  };

  const setTextH=(i:number,field:string,deltaPx:number)=>{
    const curH=(P[i] as any)[field+'H']??0;
    const num=typeof curH==='number'?curH:parseInt(curH,10)||0;
    const nextH=Math.max(0,Math.min(600,num+deltaPx));
    setF(i,field+'H',nextH>0?nextH:undefined);
    toast(`Chiều cao ô: ${nextH>0?nextH+'px':'Tự động'}`);
  };

  const resetTextProp=(i:number,field:string)=>{
    const next={...P[i]};
    delete (next as any)[field+'Sz'];
    delete (next as any)[field+'W'];
    delete (next as any)[field+'H'];
    setP(P.map((p,j)=>j===i?next:p));
    toast('Đã đặt lại cỡ chữ & khung mặc định');
  };

  const setCapSz=(i:number,k:number,delta:number)=>{
    const curSz=(P[i].s?.[k] as any)?.capSz??1;
    const nextSz=Math.max(0.5,Math.min(2.5,Math.round((curSz+delta)*10)/10));
    setSlot(i,k,{capSz:nextSz});
    toast(`Cỡ chữ chú thích: ${Math.round(nextSz*100)}%`);
  };

  const resetCapSz=(i:number,k:number)=>{
    setSlot(i,k,{capSz:1,capW:undefined});
    toast('Đã đặt lại cỡ chữ chú thích');
  };

  const startTextResize2D=(e:React.PointerEvent,i:number,field:string,axis:'x'|'y'|'both')=>{
    e.stopPropagation();e.preventDefault();
    const box=(e.currentTarget as HTMLElement).closest('.editable-txt-box') as HTMLElement|null;
    const parent=box?.parentElement;
    if(!parent||!box)return;
    const parentRect=parent.getBoundingClientRect();
    const boxRect=box.getBoundingClientRect();
    const startX=e.clientX;
    const startY=e.clientY;
    const startW=boxRect.width;
    const startH=boxRect.height;
    const mv=(ev:PointerEvent)=>{
      if(axis==='x'||axis==='both'){
        const diffX=ev.clientX-startX;
        const newPx=Math.max(60,Math.min(parentRect.width,startW+diffX));
        const pct=Math.max(20,Math.min(100,Math.round((newPx/parentRect.width)*100)));
        box.style.width=pct+'%';
        box.style.maxWidth=pct+'%';
        (P[i] as any)[field+'W']=pct;
      }
      if(axis==='y'||axis==='both'){
        const diffY=ev.clientY-startY;
        const newH=Math.max(20,Math.min(600,Math.round(startH+diffY)));
        box.style.minHeight=newH+'px';
        (P[i] as any)[field+'H']=newH;
      }
    };
    const up=()=>{
      removeEventListener('pointermove',mv);
      removeEventListener('pointerup',up);
      removeEventListener('pointercancel',up);
      const finalW=(P[i] as any)[field+'W'];
      const finalH=(P[i] as any)[field+'H'];
      setP(P.map((p,j)=>j===i?{...p,[field+'W']:finalW,[field+'H']:finalH}:p));
    };
    addEventListener('pointermove',mv);
    addEventListener('pointerup',up);
    addEventListener('pointercancel',up);
  };

  const TxtBox=({
    i,
    field,
    label,
    tag:Tag='div',
    className='',
    dataPh='',
    children,
    style={},
  }:{
    i:number;
    field:string;
    label?:string;
    tag?:any;
    className?:string;
    dataPh?:string;
    children:React.ReactNode;
    style?:React.CSSProperties;
  })=>{
    const p=P[i] as any;
    const sz=p?.[field+'Sz']??1;
    const w=p?.[field+'W'];
    const h=p?.[field+'H'];
    const wVal=w!==undefined?(typeof w==='number'?`${w}%`:w):undefined;
    const hVal=h!==undefined?(typeof h==='number'?`${h}px`:h):undefined;
    const boxStyle:React.CSSProperties={
      ...style,
      width:wVal,
      maxWidth:wVal,
      minHeight:hVal,
      position:'relative',
    };
    return (
      <div className={`editable-txt-box ${className}`} style={boxStyle}>
        <Tag
          {...E(i,field)}
          data-ph={dataPh}
          style={{
            width:'100%',
            minHeight:hVal?'100%':undefined,
            display:'block',
            fontSize:sz!==1?`calc(${sz} * 1em)`:undefined,
            color:'inherit',
            fontStyle:'inherit',
            fontWeight:'inherit',
            lineHeight:'inherit',
          }}
        >
          {children}
        </Tag>
        {edit&&(
          <>
            <div className='txt-tools' onClick={e=>e.stopPropagation()}>
              {label&&<span className='txt-lbl'>{label}</span>}
              <button title='Thu nhỏ chữ (-10%)' onClick={()=>setTextSz(i,field,-0.1)}>A-</button>
              <button title='Phóng to chữ (+10%)' onClick={()=>setTextSz(i,field,+0.1)}>A+</button>
              <button title='Thu hẹp ngang (-10%)' onClick={()=>setTextW(i,field,-10)}>↔-</button>
              <button title='Mở rộng ngang (+10%)' onClick={()=>setTextW(i,field,+10)}>↔+</button>
              <button title='Giảm chiều cao (-20px)' onClick={()=>setTextH(i,field,-20)}>↕-</button>
              <button title='Tăng chiều cao (+20px)' onClick={()=>setTextH(i,field,+20)}>↕+</button>
              {(sz!==1||w!==undefined||h!==undefined)&&(
                <button title='Về cỡ & khung mặc định' onClick={()=>resetTextProp(i,field)}>↺</button>
              )}
            </div>
            <div
              className='txt-h-e'
              title='Kéo sang trái/phải để đổi độ rộng (nhấp đúp = về 100%)'
              onPointerDown={e=>startTextResize2D(e,i,field,'x')}
              onDoubleClick={e=>{e.stopPropagation();setF(i,field+'W',undefined);}}
            >↔</div>
            <div
              className='txt-h-s'
              title='Kéo lên/xuống để đổi chiều cao ô chữ (nhấp đúp = tự động)'
              onPointerDown={e=>startTextResize2D(e,i,field,'y')}
              onDoubleClick={e=>{e.stopPropagation();setF(i,field+'H',undefined);}}
            >↕</div>
            <div
              className='txt-h-se'
              title='Kéo góc để đổi cả độ rộng lẫn chiều cao (nhấp đúp = về mặc định)'
              onPointerDown={e=>startTextResize2D(e,i,field,'both')}
              onDoubleClick={e=>{e.stopPropagation();resetTextProp(i,field);}}
            >⤡</div>
          </>
        )}
      </div>
    );
  };
  const setSlotLive=(i:number,k:number,patch:any)=>{
    const next=Pref.current.map((p,j)=>j===i&&p.s?{...p,s:p.s.map((s,m)=>m===k?{...s,...patch}:s)}:p);
    Pref.current=next;setPs(next);
  };
  const startResize=(e:React.PointerEvent,i:number,k:number,axis:'x'|'y'|'both'='both')=>{
    e.stopPropagation();e.preventDefault();
    const cell=(e.currentTarget as HTMLElement).closest('.cell') as HTMLElement|null;
    if(!cell)return;
    const r=cell.getBoundingClientRect();
    const s0=Pref.current[i].s![k];
    const w0=swOf(s0),h0=shOf(s0),x0=e.clientX,y0=e.clientY;
    hist.current.push(Pref.current);
    if(hist.current.length>80)hist.current.shift();
    setHn(hist.current.length);
    const mvf=(ev:PointerEvent)=>{
      const patch:any={};
      if(axis==='x'||axis==='both')patch.sw=clampSz(w0+2*(ev.clientX-x0)/Math.max(r.width,1));
      if(axis==='y'||axis==='both')patch.sh=clampSz(h0+2*(ev.clientY-y0)/Math.max(r.height,1));
      setSlotLive(i,k,patch);
    };
    const up=()=>{removeEventListener('pointermove',mvf);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
    addEventListener('pointermove',mvf);addEventListener('pointerup',up);addEventListener('pointercancel',up);
  };
  const moveSlotToPage = (fromI: number, fromK: number, toI: number, toK?: number) => {
    if (fromI < 0 || fromI >= Pref.current.length || toI < 0 || toI >= Pref.current.length) return;
    const curPages = Pref.current;
    const fromP = curPages[fromI];
    if (!fromP || !fromP.s || !fromP.s[fromK]) return;

    const movingSlot = { ...fromP.s[fromK], dx: 0, dy: 0 };

    if (fromI === toI) {
      if (toK === undefined || toK === fromK) return;
      const curSlots = [...fromP.s];
      curSlots.splice(fromK, 1);
      curSlots.splice(toK, 0, movingSlot);
      const next = curPages.map((p, idx) => idx === fromI ? { ...p, s: curSlots } : p);
      commit(next);
      toast(`Đã đổi vị trí ảnh trên trang ${fromI + 1} — nhớ bấm 💾 Lưu`);
      return;
    }

    const toP = curPages[toI];
    const maxSlots = toP.t === 'pr' ? 6 : 9;
    const targetSlots = toP.s ? [...toP.s] : [];
    if (targetSlots.length >= maxSlots) {
      toast(`Trang ${toI + 1} đã đầy (${maxSlots} khung ảnh)`);
      return;
    }

    const newSrcSlots = fromP.s.filter((_, idx) => idx !== fromK);
    if (toK !== undefined && toK >= 0 && toK <= targetSlots.length) {
      targetSlots.splice(toK, 0, movingSlot);
    } else {
      targetSlots.push(movingSlot);
    }

    const newToType = (toP.t === 'tx' || toP.t === 'q' || toP.t === 'vd' || toP.t === 'vd1') ? 'ph' : toP.t;
    const next = curPages.map((p, idx) => {
      if (idx === fromI) return { ...p, s: newSrcSlots };
      if (idx === toI) return { ...p, t: newToType, s: targetSlots };
      return p;
    });

    commit(next);
    toast(`✓ Đã chuyển ảnh từ trang ${fromI + 1} sang trang ${toI + 1} — nhớ bấm 💾 Lưu`);
  };

  const moveSlotStep = (fromI: number, fromK: number, delta: number) => {
    const toI = fromI + delta;
    if (toI < 0 || toI >= Pref.current.length) {
      toast('Không thể chuyển vượt ngoài giới hạn sách');
      return;
    }
    moveSlotToPage(fromI, fromK, toI);
    goPage(toI);
  };

  const promptMoveSlot = (fromI: number, fromK: number) => {
    const ans = prompt(`Nhập số trang bạn muốn chuyển ảnh tới (1 đến ${Pref.current.length}):`, String(fromI + 1));
    if (!ans) return;
    const pg = parseInt(ans.trim(), 10);
    if (isNaN(pg) || pg < 1 || pg > Pref.current.length) {
      toast(`Số trang không hợp lệ (hãy nhập từ 1 đến ${Pref.current.length})`);
      return;
    }
    const toI = pg - 1;
    if (toI === fromI) {
      toast('Ảnh đã ở trang này rồi');
      return;
    }
    moveSlotToPage(fromI, fromK, toI);
    goPage(toI);
  };

  const startDrag=(e:React.PointerEvent,i:number,k:number)=>{
    e.stopPropagation();e.preventDefault();
    const s0=Pref.current[i].s![k];
    const dx0=dxOf(s0),dy0=dyOf(s0);
    const x0=e.clientX,y0=e.clientY;
    hist.current.push(Pref.current);
    if(hist.current.length>80)hist.current.shift();
    setHn(hist.current.length);

    let lastTargetFace: HTMLElement | null = null;
    let flipTimer: any = null;
    let didFlip = false;

    const clearHighlights = () => {
      document.querySelectorAll('.drop-target-active').forEach(el => el.classList.remove('drop-target-active'));
      document.querySelectorAll('.slot-drop-target').forEach(el => el.classList.remove('slot-drop-target'));
    };

    const mvf=(ev:PointerEvent)=>{
      setSlotLive(i,k,{dx:Math.round(dx0+ev.clientX-x0),dy:Math.round(dy0+ev.clientY-y0)});

      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const faceEl = el?.closest('.face[data-p]') as HTMLElement | null;
      if (faceEl !== lastTargetFace) {
        clearHighlights();
        lastTargetFace = faceEl;
      }
      if (faceEl) {
        const targetP = parseInt(faceEl.getAttribute('data-p') || '', 10);
        if (!isNaN(targetP) && targetP !== i) {
          faceEl.classList.add('drop-target-active');
        }
      }

      const slotEl = el?.closest('.slot[data-slot-k]') as HTMLElement | null;
      if (slotEl) {
        const targetK = parseInt(slotEl.getAttribute('data-slot-k') || '', 10);
        if (targetK !== k || (faceEl && parseInt(faceEl.getAttribute('data-p') || '', 10) !== i)) {
          slotEl.classList.add('slot-drop-target');
        }
      } else {
        document.querySelectorAll('.slot-drop-target').forEach(el => el.classList.remove('slot-drop-target'));
      }

      if (!flipTimer) {
        if (ev.clientX > window.innerWidth - 65) {
          flipTimer = setTimeout(() => {
            step(1);
            didFlip = true;
            flipTimer = null;
          }, 550);
        } else if (ev.clientX < 65) {
          flipTimer = setTimeout(() => {
            step(-1);
            didFlip = true;
            flipTimer = null;
          }, 550);
        }
      } else {
        if (ev.clientX >= 65 && ev.clientX <= window.innerWidth - 65) {
          clearTimeout(flipTimer);
          flipTimer = null;
        }
      }
    };

    const up=(ev: PointerEvent)=>{
      clearTimeout(flipTimer);
      removeEventListener('pointermove',mvf);
      removeEventListener('pointerup',up);
      removeEventListener('pointercancel',up);

      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const faceEl = el?.closest('.face[data-p]') as HTMLElement | null;
      const slotEl = el?.closest('.slot[data-slot-k]') as HTMLElement | null;
      clearHighlights();

      if (faceEl) {
        const targetP = parseInt(faceEl.getAttribute('data-p') || '', 10);
        const targetK = slotEl ? parseInt(slotEl.getAttribute('data-slot-k') || '', 10) : undefined;
        if (!isNaN(targetP) && targetP !== i) {
          setSlotLive(i, k, { dx: 0, dy: 0 });
          moveSlotToPage(i, k, targetP, targetK);
          return;
        }
        if (!isNaN(targetP) && targetP === i && targetK !== undefined && targetK !== k) {
          setSlotLive(i, k, { dx: 0, dy: 0 });
          moveSlotToPage(i, k, i, targetK);
          return;
        }
      }

      if (didFlip) {
        setSlotLive(i, k, { dx: 0, dy: 0 });
      }
    };

    addEventListener('pointermove',mvf);
    addEventListener('pointerup',up);
    addEventListener('pointercancel',up);
  };
  const startRotate=(e:React.PointerEvent,i:number,k:number)=>{
    e.stopPropagation();e.preventDefault();
    const fig=(e.currentTarget as HTMLElement).closest('.slot') as HTMLElement|null;
    if(!fig)return;
    const rect=fig.getBoundingClientRect();
    const cx=rect.left+rect.width/2;
    const cy=rect.top+rect.height/2;
    const a0=Math.atan2(e.clientY-cy,e.clientX-cx)*(180/Math.PI);
    const s0=Pref.current[i].s![k];
    const rot0=frotOf(s0,k);
    hist.current.push(Pref.current);
    if(hist.current.length>80)hist.current.shift();
    setHn(hist.current.length);
    const mvf=(ev:PointerEvent)=>{
      const a1=Math.atan2(ev.clientY-cy,ev.clientX-cx)*(180/Math.PI);
      let diff=a1-a0;
      let angle=Math.round((rot0+diff)*10)/10;
      while(angle>180)angle-=360;
      while(angle<-180)angle+=360;
      if(Math.abs(angle)<2)angle=0;
      else if(Math.abs(angle-90)<2)angle=90;
      else if(Math.abs(angle+90)<2)angle=-90;
      setSlotLive(i,k,{frot:angle});
    };
    const up=()=>{removeEventListener('pointermove',mvf);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
    addEventListener('pointermove',mvf);addEventListener('pointerup',up);addEventListener('pointercancel',up);
  };
  const E=(i:number,f:string)=>({contentEditable:edit,suppressContentEditableWarning:true,onBlur:(e:React.FocusEvent<HTMLElement>)=>{const v=e.currentTarget.innerText||'';if(((P[i] as any)[f]||'')!==v)setF(i,f,v)}});
  const C=(i:number,k:number)=>({contentEditable:edit,suppressContentEditableWarning:true,onBlur:(e:React.FocusEvent<HTMLElement>)=>{const v=e.currentTarget.innerText||'';const cs=P[i]&&P[i].s&&P[i].s![k];if(cs&&cs.cap!==v)setCap(i,k,v)}});
  const eraNo=(i:number)=>P.slice(0,i+1).filter(p=>p.t==='open'&&p.kind==='era').length;

  const slotClick=(i:number,k:number)=>{
    const p=P[i];const s=p.s![k];
    if(p.t==='vd'||p.t==='vd1'){
      if(edit){pickV.current={p:i,s:k};vfi.current?.click();return}
      if(s.src)setLb({src:s.src,cap:s.cap,v:s.v});
      return;
    }
    if(edit){pick.current={p:i,s:k};fi.current?.click();return}
    if(s.src)setLb({src:s.src,cap:s.cap,rot:s.rot});
  };
  const onVideo=async(f:File)=>{
    const {p,s}=pickV.current;
    if(f.size>500*1024*1024){toast('Video quá lớn (tối đa 500MB) — hãy nén nhỏ lại');return}
    try{
      let src:string;
      if(auth&&auth.currentUser){toast('Đang tải video lên… video lớn có thể mất vài phút, đừng đóng trang');src=await blobUp('videos/'+Date.now()+'-'+f.name.replace(/[^a-zA-Z0-9.]/g,'_'),f,true)}
      else src=URL.createObjectURL(f);
      setSlot(p,s,{src,v:'file'});toast('Đã thêm video — nhớ bấm 💾 Lưu');
    }catch(e:any){toast('Tải video thất bại: '+(e&&e.message?e.message:'lỗi không rõ'))}
  };
  const onFiles=async(fs:File[])=>{
    if(!fs.length)return;
    if(pick.current.s===99){
      toast('Đang tải ảnh cổng trường…');
      try{
        const src=await toSrc(fs[0],0);
        setP(P.map((p,idx)=>idx===pick.current.p?{...p,gateImg:src}:p));
        toast('Đã cập nhật ảnh cổng trường — nhớ bấm 💾 Lưu');
      }catch(e:any){toast('Tải ảnh thất bại: '+(e&&e.message?e.message:'lỗi không rõ'))}
      return;
    }
    const targetP=pick.current.p;
    let targetS=pick.current.s;
    const next=P.map(p=>({...p,s:p.s?p.s.map(x=>({...x})):[]}));
    let pIdx=targetP;
    let sIdx=targetS;
    for(let k=0;k<fs.length;k++){
      toast(`Đang xử lý ảnh ${k+1}/${fs.length}…`);
      try{
        if(pIdx>=next.length)break;
        const curP=next[pIdx];
        if(!curP.s)curP.s=[];
        if(sIdx>=curP.s.length){
          if(curP.s.length<9){
            curP.s.push({src:'',cap:curP.t==='pr'?'Họ và tên · Nhiệm kỳ':'Chú thích ký ức…'});
            sIdx=curP.s.length-1;
          }else{
            pIdx++;
            while(pIdx<next.length&&next[pIdx].t!=='ph'&&next[pIdx].t!=='pr')pIdx++;
            if(pIdx>=next.length){toast('Đã hết chỗ trống trong sách');break}
            if(!next[pIdx].s)next[pIdx].s=[];
            if(next[pIdx].s.length===0)next[pIdx].s.push({src:'',cap:'Chú thích ký ức…'});
            sIdx=0;
          }
        }
        next[pIdx].s![sIdx].src=await toSrc(fs[k],k);
        next[pIdx].s![sIdx].rot=0;
        (next[pIdx].s![sIdx] as any).zoom=1;
        sIdx++;
      }catch(e:any){toast('Tải ảnh thất bại: '+(e&&e.message?e.message:'lỗi không rõ'));break}
    }
    setP(next);toast('Xong! Nhớ bấm 💾 Lưu');
  };

  const addAfter=(i:number,kind:'tx'|'ph'|'vd')=>{
    const pg:Page=kind==='tx'?mkTx():kind==='ph'?mkPh():mkVd1();
    const at=Math.max(1,Math.min(i+1,P.length-1));
    const n=[...P];n.splice(at,0,pg);commit(n);
    toast('Đã thêm 1 trang — nhớ bấm 💾 Lưu');
  };
  const delPage=(i:number)=>{
    const p=P[i];
    if(!p||p.t==='cover'||p.t==='end')return;
    const siblingIdx=(i%2===1)?i+1:i-1;
    const sib=P[siblingIdx];
    const sibEmpty=sib&&(
      (sib.t==='ph'&&(!sib.s||sib.s.every(s=>!s.src)))||
      (sib.t==='q'&&!sib.txt)
    );
    if(sibEmpty&&siblingIdx>0&&siblingIdx<P.length-1){
      if(confirm(`Trang đối diện (trang ${siblingIdx+1}) cũng đang để trống. Bạn có muốn xóa luôn cả 2 trang của tờ này để giữ sách cân đối không?`)){
        setMenu(null);
        const first=Math.min(i,siblingIdx);
        const n=[...P];
        n.splice(first,2);
        setP(n);
        toast(`Đã xóa 2 trang ${first+1} & ${first+2} — nhớ bấm 💾 Lưu trên thanh công cụ!`);
        return;
      }
    }
    const ask=p.t==='open'?'Đây là trang mở đầu của một mục — xóa sẽ làm mục này mất khỏi mục lục. Vẫn xóa trang '+(i+1)+'?':'Xóa trang '+(i+1)+'?';
    if(!confirm(ask))return;
    setMenu(null);
    const n=[...P];n.splice(i,1);commit(n);
    toast('Đã xóa trang '+(i+1)+' — nhớ bấm 💾 Lưu trên thanh công cụ!');
  };
  const addSlot=(i:number)=>{
    const p=P[i];if(!p)return;
    const curSlots=p.s||[];
    const max=p.t==='pr'?6:9;
    if(curSlots.length>=max){toast('Mỗi trang tối đa '+max+' khung ảnh');return}
    const cap=p.t==='pr'?'Họ và tên · Nhiệm kỳ':'Chú thích ký ức…';
    setP(P.map((q,j)=>j===i?{...q,t:(q.t==='tx'||q.t==='q'?'ph':q.t),s:[...curSlots,{src:'',cap}]}:q));
    toast('Đã thêm 1 khung ảnh — nhớ bấm 💾 Lưu');
  };
  const delSlot=(i:number,k:number)=>{
    const p=P[i];if(!p||!p.s)return;
    if(!confirm('Xóa khung ảnh này (cả ảnh lẫn chú thích)?'))return;
    setP(P.map((q,j)=>j===i?{...q,s:q.s!.filter((_,m)=>m!==k)}:q));
    toast('Đã xóa khung — nhớ bấm 💾 Lưu trên thanh công cụ!');
  };
  const clearAllSlots=(i:number)=>{
    if(!confirm('Xóa TẤT CẢ các khung ảnh trên trang này?'))return;
    setP(P.map((q,j)=>j===i?{...q,s:[]}:q));
    toast('Đã xóa tất cả ảnh trên trang '+(i+1)+' — nhớ bấm 💾 Lưu trên thanh công cụ!');
  };
  const setPageType=(i:number,newType:Kind)=>{
    setP(P.map((q,j)=>j===i?{...q,t:newType,s:(newType==='ph'||newType==='pr')?(q.s&&q.s.length?[...q.s]:[{src:'',cap:'Chú thích ký ức…'}]):q.s}:q));
    toast(`Đã chuyển trang ${i+1} sang dạng: ${newType.toUpperCase()} — nhớ bấm 💾 Lưu`);
  };
  const setNote=(i:number,v:string|undefined)=>{
    setP(P.map((q,j)=>j===i?({...q,note:v} as Page):q));
    toast(v===undefined?'Đã xóa văn bản — bấm ↩ Hoàn tác nếu xóa nhầm':'Đã thêm khung văn bản ở cuối trang — bấm vào để viết');
  };
  const clearTitle=(i:number)=>{
    setP(P.map((q,j)=>j===i?{...q,title:''}:q));
    toast('Đã xóa tiêu đề — bấm ↩ Hoàn tác nếu xóa nhầm');
  };
  const clearCaps=(i:number)=>{
    setP(P.map((q,j)=>j===i&&q.s?{...q,s:q.s.map(s=>({...s,cap:''}))}:q));
    toast('Đã xóa các chú thích — bấm ↩ Hoàn tác nếu xóa nhầm');
  };
  const here=()=>Math.max(1,Math.min(narrow?(2*cur-(half?1:0)):2*cur,P.length-2));

  const tail=()=>{let idx=P.length-1;if(idx>0&&P[idx-1].t==='q'&&!P[idx-1].txt)idx--;return idx};
  const groupEnd=(i:number)=>{let j=i+1;while(j<P.length){const p=P[j];if(p.t==='end')break;if(p.t==='q'&&!p.txt&&P[j+1]&&P[j+1].t==='end')break;if(p.t==='open'&&p.kind!=='class')break;j++}return j};
  const insertAt=(at:number,pages:Page[],text:string)=>{const n=[...P];n.splice(at,0,...pages);commit(n);toast(text)};
  const addClass=(eraIdx:number)=>insertAt(groupEnd(eraIdx),mkSection('class'),'Đã thêm khóa mới cuối chương này — mở ra và đặt tên');
  const addSection=(kind:Kind)=>{
    const eras=secs.filter(x=>x.p.kind==='era');
    let at:number;
    if(kind==='era')at=eras.length?groupEnd(eras[eras.length-1].i):tail();
    else if(kind==='history'||kind==='principals')at=eras.length?eras[0].i:tail();
    else at=tail();
    insertAt(at,mkSection(kind),'Đã thêm vào mục lục — bấm vào để mở và đặt tên');
  };
  const delSection=(i:number)=>{
    const isEra=P[i].kind==='era';
    if(!confirm(isEra?'Xóa chương này cùng tất cả các khóa bên trong?':'Xóa đề mục này cùng toàn bộ trang bên trong?'))return;
    let j=i+1;
    while(j<P.length){const p=P[j];if(p.t==='end')break;if(p.t==='q'&&!p.txt&&P[j+1]&&P[j+1].t==='end')break;if(p.t==='open'&&(!isEra||p.kind!=='class'))break;j++}
    const n=[...P];n.splice(i,j-i);commit(n);setCur(0);setHalf(false);setToc(false);
    toast('Đã xóa — nhớ bấm 💾 Lưu trên thanh công cụ!');
  };
  const cleanEmptyPages=()=>{
    if(!confirm('Tự động tìm và xóa tất cả các trang ảnh trống (không có ảnh nào) trong sách?'))return;
    const n=P.filter((p,idx)=>{
      if(p.t==='cover'||p.t==='end'||idx===1)return true;
      if(p.t==='ph'&&(!p.s||p.s.length===0))return false;
      return true;
    });
    commit(n);
    toast('Đã dọn dẹp các trang trống — nhớ bấm 💾 Lưu!');
  };
  const save=async()=>{
    if(!db){toast('Chế độ demo: chưa kết nối Firebase nên chưa lưu được');return}
    try{
      const ref0=doc(db,'book','main');
      const old=await getDoc(ref0);
      if(old.exists())await setDoc(doc(db,'book','prev'),{...old.data(),backupAt:Date.now()});
      await setDoc(ref0,{pages:JSON.parse(JSON.stringify(P)),updated:Date.now()});
      toast('Đã lưu lên hệ thống ✓ (bản trước đó được giữ lại, lấy bằng nút ⟲ Bản lưu trước)');
    }catch(e){toast('Lưu thất bại — kiểm tra quyền Firestore')}
  };
  const reloadSaved=async()=>{
    if(!confirm('Bỏ mọi chỉnh sửa chưa lưu và quay về bản đã lưu gần nhất?'))return;
    if(db){
      try{
        const s=await getDoc(doc(db,'book','main'));const d:any=s.data();
        if(d&&d.pages&&d.pages.length%2===0){loadP(patchPages(d.pages));toast('Đã quay về bản đã lưu');return}
      }catch(e){toast('Không đọc được bản đã lưu');return}
    }
    loadP(defaultPages());toast('Chưa có bản lưu nào — đã đưa về bản mặc định');
  };
  const restorePrev=async()=>{
    if(!db){toast('Chưa kết nối Firebase');return}
    try{
      const s=await getDoc(doc(db,'book','prev'));const d:any=s.data();
      if(d&&d.pages&&d.pages.length%2===0){
        if(!confirm('Lấy lại bản đã lưu TRƯỚC lần lưu gần nhất? (Chưa ghi đè gì cho đến khi bạn bấm 💾 Lưu)'))return;
        setP(patchPages(d.pages));toast('Đã lấy lại bản trước — xem rồi bấm 💾 Lưu nếu đúng ý');
      }else toast('Chưa có bản sao lưu nào (chỉ có sau lần bấm Lưu từ giờ)');
    }catch(e){toast('Không đọc được bản sao lưu')}
  };
  const toDefault=()=>{
    if(!confirm('Đưa sách về BẢN MẶC ĐỊNH ban đầu? Các chỉnh sửa chưa lưu sẽ mất. Bản đã lưu trên hệ thống chỉ bị thay khi bạn bấm 💾 Lưu.'))return;
    setP(defaultPages());setCur(0);setHalf(false);
    toast('Đã về bản mặc định — bấm 💾 Lưu nếu muốn dùng bản này');
  };
  const login=()=>{
    setErr('');
    if(auth){signInWithEmailAndPassword(auth,u.trim(),pw).then(()=>setModal(false)).catch((e:any)=>setErr(authMsg(e&&e.code)));return}
    if(u==='admin'&&pw==='60nam2026'){setEdit(true);setModal(false);toast('Chế độ DEMO: sửa được nhưng chưa lưu')}else setErr('Sai tài khoản hoặc mật khẩu');
  };
  const logout=()=>{if(auth)signOut(auth);setEdit(false);setMenu(null)};
  const onMove=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(edit||narrow||mv.length||raf.current)return;
    const x=e.clientX/innerWidth,y=e.clientY/innerHeight;
    raf.current=requestAnimationFrame(()=>{raf.current=0;if(tilt.current)tilt.current.style.transform=`rotateX(${(.5-y)*4}deg) rotateY(${(x-.5)*5}deg)`});
  };
  const faceClick=(side:string)=>(e:React.MouseEvent<HTMLDivElement>)=>{
    if((e.target as HTMLElement).closest('[contenteditable=true]'))return;
    setMenu(null);
    const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;
    if(narrow){if(x>.7)step(1);else if(x<.3)step(-1);return}
    if(cur===0){go(1);return}
    if(cur===maxCur){go(cur-1);return}
    if(side==='front'&&x>.75)go(cur+1);else if(side==='back'&&x<.25)go(cur-1);
  };

  const slotsEl=(p:Page,i:number,cls:string)=>{
    const allSlots = p.s || [];
    const slotsToRender = edit
      ? allSlots.map((s, k) => ({ s, k }))
      : (allSlots.some(s => !!s.src)
          ? allSlots.map((s, k) => ({ s, k })).filter(x => !!x.s.src)
          : allSlots.map((s, k) => ({ s, k })));
    const n = slotsToRender.length;
    if (n === 0) {
      if (edit) {
        return (
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:'20px 0'}}>
            <button className='empty-page-add-slot' onClick={()=>addSlot(i)}>
              📷 Bấm để thêm khung ảnh vào trang này
            </button>
            <button className='dl' style={{padding:'7px 16px',borderRadius:8,background:'rgba(160,35,35,.85)',color:'#fff',border:0,cursor:'pointer',fontSize:12.5,fontWeight:600}} onClick={()=>delPage(i)}>
              🗑 Xóa hẳn trang trống này
            </button>
          </div>
        );
      }
      return null;
    }
    const isPr = p.t === 'pr' || cls.includes('pr');
    const isStack2 = n === 2 && !isPr;
    return <div className={'grid' + (n > 4 ? ' g3' : '') + (n === 1 ? ' n1' : '') + (n === 2 ? ' n2' + (isStack2 ? ' stack' : '') : '') + (n === 3 ? ' n3' : '')}>{slotsToRender.map(({ s, k }, renderIdx) => {
      const rot = s.rot || 0, z = zoomOf(s);
      const sw = swOf(s), sh = shOf(s);
      const dx = dxOf(s), dy = dyOf(s);
      const frot = frotOf(s, k, i);
      const tapeCls = ['', ' tape-l', ' tape-r', ' tape-corner'][(i + k) % 4];
      const adv = !!(rot || z !== 1);
      const isWideSpan = (s as any).span === 'wide';
      const isCustomSz = sw !== 1 || sh !== 1;
      const defaultAr = isPr ? '3/4' : (n === 1 ? '16/11' : (isStack2 ? '16/10' : (isWideSpan ? '16/9' : (n === 3 && renderIdx === 2 ? '16/9' : '4/3'))));
      const arVal = (s as any).ar || (isCustomSz ? 'auto' : defaultAr);
      const slotStyle: React.CSSProperties = {
        ['--frot' as any]: frot + 'deg',
        ['--ar' as any]: arVal,
        width: (sw * 100) + '%',
        height: (sh * 100) + '%',
        position: 'relative',
        left: dx + 'px',
        top: dy + 'px',
      };
      const phStyle: React.CSSProperties | undefined = s.src
        ? (adv
            ? { position: 'relative', overflow: 'hidden' }
            : { backgroundImage: `url('${s.src}')`, backgroundPosition: 'center', backgroundSize: (s as any).fit || 'cover', ...(edit ? { position: 'relative' as const } : {}) })
        : (edit ? { position: 'relative' } : undefined);
      return (
        <div className={'cell' + (isWideSpan ? ' wide' : '')} key={k} onClick={e => e.stopPropagation()}>
          <figure
            className={'slot' + cls + tapeCls}
            style={slotStyle}
            data-slot-k={k}
            draggable={edit}
            onDragStart={e => {
              if (!edit) return;
              e.dataTransfer.setData('application/json', JSON.stringify({ fromI: i, fromK: k }));
              e.dataTransfer.effectAllowed = 'move';
              (e.currentTarget as HTMLElement).classList.add('dragging-slot');
            }}
            onDragEnd={e => {
              (e.currentTarget as HTMLElement).classList.remove('dragging-slot');
              document.querySelectorAll('.drop-target-active').forEach(el => el.classList.remove('drop-target-active'));
              document.querySelectorAll('.slot-drop-target').forEach(el => el.classList.remove('slot-drop-target'));
            }}
            onClick={e => { e.stopPropagation(); if (!edit) slotClick(i, k); }}
          >
            <div className='ph' style={phStyle} onClick={e => { e.stopPropagation(); slotClick(i, k); }}>
              {s.src ? (adv ? <RotImg src={s.src} rot={rot} zoom={z} /> : null) : (cls ? 'ẢNH CHÂN DUNG' : 'ẢNH KỶ NIỆM')}
              {edit && (
                <div className='slbar' onClick={e => e.stopPropagation()}>
                  <div className='g'>
                    <button className='drgbtn' title='Kéo để di chuyển hoặc kéo sang trang khác (nhấp đúp = về vị trí gốc)' onPointerDown={e => startDrag(e, i, k)} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { dx: 0, dy: 0 }); }}>✥</button>
                    <button title='Kéo dãn bề ngang (+10%)' onClick={() => setSlot(i, k, { sw: clampSz(sw + 0.1) })}>↔+</button>
                    <button title='Thu hẹp bề ngang (-10%)' onClick={() => setSlot(i, k, { sw: clampSz(sw - 0.1) })}>↔-</button>
                    <button title='Kéo dãn bề dọc (+10%)' onClick={() => setSlot(i, k, { sh: clampSz(sh + 0.1) })}>↕+</button>
                    <button title='Thu hẹp bề dọc (-10%)' onClick={() => setSlot(i, k, { sh: clampSz(sh - 0.1) })}>↕-</button>
                    <button title='Phóng to cả khung (+10%)' onClick={() => setSlot(i, k, { sw: clampSz(sw + 0.1), sh: clampSz(sh + 0.1) })}>＋</button>
                    <button title='Thu nhỏ cả khung (-10%)' onClick={() => setSlot(i, k, { sw: clampSz(sw - 0.1), sh: clampSz(sh - 0.1) })}>－</button>
                  </div>
                  <div className='g'>
                    <button title={isWideSpan ? 'Hủy trải cả hàng' : 'Trải rộng trọn cả hàng (2 cột)'} style={isWideSpan ? { background: '#27ae60' } : undefined} onClick={() => setSlot(i, k, { span: isWideSpan ? undefined : 'wide' })}>⇥</button>
                    <button title='Tỉ lệ ngang 16:9' onClick={() => setSlot(i, k, { ar: '16/9' })}>16:9</button>
                    <button title='Tỉ lệ ảnh 4:3' onClick={() => setSlot(i, k, { ar: '4/3' })}>4:3</button>
                    <button title='Tỉ lệ dọc 3:4' onClick={() => setSlot(i, k, { ar: '3/4' })}>3:4</button>
                    <button title='Nghiêng trái -3°' onClick={() => setSlot(i, k, { frot: Math.round((frot - 3) * 10) / 10 })}>↶</button>
                    <button title='Nghiêng phải +3°' onClick={() => setSlot(i, k, { frot: Math.round((frot + 3) * 10) / 10 })}>↷</button>
                    {s.src ? <button title='Xoay ảnh bên trong 90°' onClick={() => setSlot(i, k, { rot: (rot + 90) % 360 })}>⟳</button> : null}
                    <button title='Chữ chú thích nhỏ hơn (-10%)' onClick={() => setCapSz(i, k, -0.1)}>aA-</button>
                    <button title='Chữ chú thích to hơn (+10%)' onClick={() => setCapSz(i, k, +0.1)}>aA+</button>
                    {s.src ? <button className='dl' title='Xóa ảnh (giữ khung)' onClick={() => { setSlot(i, k, { src: '', rot: 0, zoom: 1 }); toast('Đã xóa ảnh — bấm ↩ Hoàn tác nếu xóa nhầm'); }}>✕</button> : null}
                    <button className='dl' title='Xóa cả khung này' onClick={() => delSlot(i, k)}>🗑</button>
                  </div>
                  <div className='g move-group'>
                    <button title='Chuyển ảnh này sang trang trước' onClick={() => moveSlotStep(i, k, -1)}>◀ Trang</button>
                    <button title='Chuyển ảnh này sang trang sau' onClick={() => moveSlotStep(i, k, 1)}>Trang ▶</button>
                    <button title='Chuyển ảnh này tới trang bất kỳ' onClick={() => promptMoveSlot(i, k)}>✈ Tới tr…</button>
                  </div>
                </div>
              )}
            </div>
            <div className='cap-wrap' style={{ position: 'relative', width: '100%' }}>
              <figcaption
                {...C(i, k)}
                data-ph='Chú thích…'
                style={{
                  fontSize: (s as any).capSz ? `calc(${(s as any).capSz} * 1em)` : undefined,
                }}
              >
                {s.cap}
              </figcaption>
              {edit && (
                <div className='cap-tools' onClick={e => e.stopPropagation()}>
                  <button title='Giảm cỡ chữ chú thích (-10%)' onClick={() => setCapSz(i, k, -0.1)}>aA-</button>
                  <button title='Tăng cỡ chữ chú thích (+10%)' onClick={() => setCapSz(i, k, +0.1)}>aA+</button>
                  {((s as any).capSz && (s as any).capSz !== 1) && (
                    <button title='Cỡ chữ mặc định' onClick={() => resetCapSz(i, k)}>↺</button>
                  )}
                </div>
              )}
            </div>
            {edit && (
              <>
                <div className='rsz rsz-se' title='Kéo để đổi kích thước khung (nhấp đúp = về cỡ 100%)' onPointerDown={e => startResize(e, i, k, 'both')} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { sw: 1, sh: 1 }); }}>⤡</div>
                <div className='rsz rsz-e' title='Kéo ngang: dãn/thu hẹp bề ngang (nhấp đúp = về 100%)' onPointerDown={e => startResize(e, i, k, 'x')} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { sw: 1 }); }}>↔</div>
                <div className='rsz rsz-s' title='Kéo dọc: dãn/thu hẹp bề dọc (nhấp đúp = về 100%)' onPointerDown={e => startResize(e, i, k, 'y')} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { sh: 1 }); }}>↕</div>
                <div className='drg' title='Kéo để di chuyển vị trí khung (nhấp đúp = về vị trí ban đầu)' onPointerDown={e => startDrag(e, i, k)} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { dx: 0, dy: 0 }); }}>✥</div>
                <div className='rot-handle' title='Kéo xoay 360° tự do (nhấp đúp = về 0° thẳng đứng)' onPointerDown={e => startRotate(e, i, k)} onDoubleClick={e => { e.stopPropagation(); setSlot(i, k, { frot: 0 }); toast('Đã chỉnh ảnh về 0° thẳng đứng'); }}>↻</div>
              </>
            )}
          </figure>
        </div>
      );
    })}</div>;
  };
  const vdEl=(p:Page,i:number)=><div className='vgrid'>{p.s!.map((s,k)=><figure className='vslot' key={k} onClick={e=>e.stopPropagation()}><div className='vbox' style={s.v==='yt'&&s.src?{backgroundImage:`url(https://i.ytimg.com/vi/${s.src}/hqdefault.jpg)`}:undefined} onClick={e=>{e.stopPropagation();slotClick(i,k)}}><span className='play'>{s.src?'▶':'＋ VIDEO'}</span></div><figcaption {...C(i,k)}>{s.cap}</figcaption></figure>)}</div>;
  const vdBig=(p:Page,i:number)=>{const s=p.s![0];return <div className='vbigwrap' onClick={e=>e.stopPropagation()}><div className='vbigbox' style={s.v==='yt'&&s.src?{backgroundImage:`url(https://i.ytimg.com/vi/${s.src}/hqdefault.jpg)`}:undefined} onClick={e=>{e.stopPropagation();slotClick(i,0)}}><span className={'vbigplay'+(s.src?'':' add')}>{s.src?'▶':'＋ VIDEO'}</span>{edit&&s.src&&<button className='rotbtn delbtn' title='Xóa video này' onClick={e=>{e.stopPropagation();setSlot(i,0,{src:'',v:undefined});toast('Đã xóa video — bấm ↩ Hoàn tác nếu xóa nhầm')}}>✕</button>}</div><div className='vbigcap' {...C(i,0)}>{s.cap}</div></div>};

  const tools=(i:number,p:Page)=>{
    if(!edit)return null;
    const hasSlots=p.t==='ph'||p.t==='pr'||(p.s&&p.s.length>0);
    const hasTitle=!!p.title;
    const isSpecial=p.t==='cover'||p.t==='end';
    const isTextPage=p.t==='open'||p.t==='tx'||p.t==='q';
    const act=(fn:()=>void)=>()=>{setMenu(null);fn()};

    // Calculate nearest preceding class & K
    let secClass = '';
    let secYrs = '';
    for (let j = i; j >= 0; j--) {
      if (P[j].t === 'open' && (P[j].kind === 'class' || !P[j].kind)) {
        secClass = P[j].title || '';
        secYrs = P[j].yrs || '';
        break;
      }
    }
    const kNum = calcKFromYear(secYrs);
    const kStr = kNum ? `K${kNum}` : '';
    const autoCap = (secClass && kStr)
      ? `Cựu học sinh ${secClass} ${kStr}`
      : (secClass ? `Cựu học sinh ${secClass}` : (kStr ? `Cựu học sinh ${kStr} Quế Võ 1` : 'Cựu học sinh THPT Quế Võ số 1'));

    return <>
      <button className='pgcog' onClick={e=>{e.stopPropagation();setMenu(menu===i?null:i)}} title='Công cụ của trang này'>⚙ Công cụ trang</button>
      {menu===i&&<div className='pgmenu' onClick={e=>e.stopPropagation()}>
        <div style={{color:'#e6c97f',fontWeight:600,padding:'4px 8px',fontSize:12}}>TRANG {i+1} ({p.t.toUpperCase()})</div>
        <button onClick={act(()=>addSlot(i))}>＋ Thêm khung ảnh vào trang</button>
        <button onClick={act(()=>{
          pick.current={p:i,s:(p.s&&p.s.length>0)?p.s.length:0};
          if(!p.s||p.s.length===0){
            setP(P.map((q,j)=>j===i?{...q,t:(q.t==='tx'||q.t==='q'?'ph':q.t),s:[{src:'',cap:'Chú thích ký ức…'}]}:q));
          }
          setTimeout(()=>fi.current?.click(),80);
        })}>📷 Tải ảnh từ máy lên trang này</button>
        {p.s&&p.s.length>0&&<button className='dl' onClick={act(()=>clearAllSlots(i))}>🗑 Xóa tất cả ảnh trên trang này</button>}
        {hasSlots&&p.s&&p.s.some(s=>!s.src)&&<button onClick={act(()=>{
          if(!confirm('Xóa bớt các khung ảnh còn trống trên trang này?'))return;
          setP(P.map((q,j)=>j===i?{...q,s:q.s!.filter(s=>!!s.src)}:q));
          toast('Đã dọn bớt khung trống — nhớ bấm 💾 Lưu');
        })}>🧹 Xóa các khung ảnh còn trống</button>}
        {hasSlots&&<button onClick={act(()=>{
          setP(P.map((q,j)=>j===i&&q.s?{...q,s:q.s.map(s=>({...s,ar:'16/9'}))}:q));
          toast('Đã chuyển các ảnh trang này sang 16:9 — nhớ bấm 💾 Lưu');
        })}>↔ Đặt tất cả ảnh tỉ lệ 16:9 (ngang)</button>}
        {hasSlots&&<button onClick={act(()=>{
          setP(P.map((q,j)=>j===i&&q.s?{...q,s:q.s.map(s=>({...s,ar:'4/3'}))}:q));
          toast('Đã chuyển các ảnh trang này sang 4:3 — nhớ bấm 💾 Lưu');
        })}>⬚ Đặt tất cả ảnh tỉ lệ 4:3</button>}
        {hasSlots&&<button onClick={act(()=>{
          setP(P.map((q,j)=>j===i&&q.s?{...q,s:q.s.map(s=>({...s,sw:1,sh:1,dx:0,dy:0,frot:0,span:undefined}))}:q));
          toast('Đã đặt lại kích thước & vị trí các khung về mặc định');
        })}>↺ Đặt lại kích thước & vị trí ban đầu</button>}
        {hasSlots&&(
          <button onClick={act(()=>{
            const val=prompt('Nội dung chú thích điền cho tất cả ảnh trang này:',autoCap);
            if(val!==null&&val.trim()){
              setP(P.map((q,j)=>j===i&&q.s?{...q,s:q.s.map(slot=>({...slot,cap:val.trim()}))}:q));
              toast(`Đã điền chú thích "${val.trim()}" cho tất cả ảnh — bấm 💾 Lưu`);
            }
          })}>🏷️ Điền chú thích "{autoCap}" cho tất cả ảnh</button>
        )}
        {isTextPage&&(
          <div style={{borderTop:'1px dashed rgba(143,95,28,.4)',marginTop:6,paddingTop:6}}>
            <div style={{color:'#e6c97f',fontWeight:600,padding:'2px 8px',fontSize:11}}>CỠ CHỮ & KHUNG CHỮ</div>
            <div style={{display:'flex',gap:4,padding:'4px 8px',alignItems:'center',justifyContent:'space-between',fontSize:12}}>
              <span>Tiêu đề</span>
              <div style={{display:'flex',gap:2}}>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'title',-0.1)}>A-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'title',+0.1)}>A+</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'title',-10)}>↔-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'title',+10)}>↔+</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'title',-20)}>↕-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'title',+20)}>↕+</button>
              </div>
            </div>
            {p.t==='open'&&(
              <div style={{display:'flex',gap:4,padding:'4px 8px',alignItems:'center',justifyContent:'space-between',fontSize:12}}>
                <span>Niên khóa</span>
                <div style={{display:'flex',gap:2}}>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'yrs',-0.1)}>A-</button>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'yrs',+0.1)}>A+</button>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'yrs',-10)}>↔-</button>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'yrs',+10)}>↔+</button>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'yrs',-20)}>↕-</button>
                  <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'yrs',+20)}>↕+</button>
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:4,padding:'4px 8px',alignItems:'center',justifyContent:'space-between',fontSize:12}}>
              <span>Nội dung</span>
              <div style={{display:'flex',gap:2}}>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'txt',-0.1)}>A-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextSz(i,'txt',+0.1)}>A+</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'txt',-10)}>↔-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextW(i,'txt',+10)}>↔+</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'txt',-20)}>↕-</button>
                <button style={{padding:'2px 6px',fontSize:11}} onClick={()=>setTextH(i,'txt',+20)}>↕+</button>
              </div>
            </div>
          </div>
        )}
        {!isSpecial&&p.t!=='ph'&&<button onClick={act(()=>setPageType(i,'ph'))}>Chuyển thành: Trang ảnh</button>}
        {!isSpecial&&p.t!=='tx'&&<button onClick={act(()=>setPageType(i,'tx'))}>Chuyển thành: Trang bài viết</button>}
        {!isSpecial&&p.t!=='q'&&<button onClick={act(()=>setPageType(i,'q'))}>Chuyển thành: Trang trích dẫn</button>}
        <button onClick={act(()=>addAfter(i,'tx'))}>＋ Thêm 1 trang chữ sau trang này</button>
        <button onClick={act(()=>addAfter(i,'ph'))}>＋ Thêm 1 trang ảnh sau trang này</button>
        <button onClick={act(()=>addAfter(i,'vd'))}>＋ Thêm 1 trang video sau trang này</button>
        {noteOf(p)===undefined?<button onClick={act(()=>setNote(i,''))}>＋ Thêm khung văn bản</button>:<button className='dl' onClick={act(()=>setNote(i,undefined))}>🗑 Xóa khung văn bản</button>}
        {hasTitle&&<button className='dl' onClick={act(()=>clearTitle(i))}>🗑 Xóa tiêu đề</button>}
        {hasSlots&&<button className='dl' onClick={act(()=>clearCaps(i))}>🗑 Xóa chú thích các ảnh</button>}
        <button className='dl' onClick={act(cleanEmptyPages)}>🧹 Dọn dẹp các trang ảnh trống</button>
        {!isSpecial&&<button className='dl' onClick={act(()=>delPage(i))}>🗑 Xóa trang này</button>}
      </div>}
    </>;
  };
  const noteEl=(i:number,p:Page)=>noteOf(p)!==undefined?<div className='pnote' data-ph='Viết văn bản…' {...E(i,'note')}>{noteOf(p)}</div>:null;

  const renderClickableText=(text:string)=>{
    if(!text)return '';
    const urlRegex=/(https?:\/\/[^\s]+)/g;
    const parts=text.split(urlRegex);
    return parts.map((part,idx)=>{
      if(urlRegex.test(part)){
        return (
          <a key={idx} href={part} target='_blank' rel='noopener noreferrer' style={{color:'#8b5a1b',textDecoration:'underline',wordBreak:'break-all'}} onClick={e=>e.stopPropagation()}>
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const pageBody=(p:Page,i:number)=>{
    const ft=<div className='ft'>{i+1}</div>;
    const doodle=<PageDoodle pageIndex={i} type={p.t} count={p.s?.length}/>;
    if(p.t==='cover'){
      const covTitle=p.title||'60 NĂM';
      const covSub=p.yrs||'MỘT DÒNG KÝ ỨC';
      const covTxt=p.txt||'Trường THPT Quế Võ số 1\n1966 — 2026';
      const covMotto=p.by||'Tự hào truyền thống — Vững bước tương lai';
      return (
        <div className='t-cover'>
          <div className='lslot' ref={sealRef} style={{visibility:'hidden'}}/>
          <TxtBox i={i} field='title' label='Tiêu đề' tag='h1' dataPh='Tiêu đề bìa'>{covTitle}</TxtBox>
          <TxtBox i={i} field='yrs' label='Phụ đề' tag='h2' dataPh='Phụ đề'>{covSub}</TxtBox>
          <TxtBox i={i} field='txt' label='Tên trường & năm' tag='p' dataPh='Tên trường & năm'>{covTxt}</TxtBox>
          <TxtBox i={i} field='by' label='Khẩu hiệu' tag='em' dataPh='Khẩu hiệu'>{covMotto}</TxtBox>
        </div>
      );
    }
    if(p.t==='q'){
      const qFb=getQuoteFallback(p,i,P);
      const qTxt=(p.txt!==undefined&&p.txt.trim()!=='')?p.txt:qFb.txt;
      const qBy=(p.by!==undefined&&p.by.trim()!=='')?p.by:qFb.by;
      return (
        <>
          <div className='q'>
            <TxtBox i={i} field='txt' label='Trích dẫn' tag='span' dataPh='Trích dẫn…'>{qTxt}</TxtBox>
            <TxtBox i={i} field='by' label='Tác giả' tag='small' dataPh='Tác giả…'>{qBy}</TxtBox>
          </div>
          {doodle}{noteEl(i,p)}{ft}
        </>
      );
    }
    if(p.t==='open'){
      const def=DEFAULT_PAGE_MAP[i];
      const lab=p.kind==='era'?'CHƯƠNG '+roman(eraNo(i)):KIND_LABEL[p.kind||def?.kind||'class'];
      const openTitle=p.title||def?.title||'';
      const openYrs=p.yrs||def?.yrs||'';
      const openTxt=(p.txt&&!p.txt.includes('Khóa học đầu tiên'))?p.txt:(def?.txt||p.txt||'');
      return (
        <>
          <div className='open' style={{margin:'auto 0'}}>
            <div className='no'>{lab}</div>
            <TxtBox i={i} field='yrs' label='Niên khóa' className='yrs' dataPh='Niên khóa…'>{openYrs}</TxtBox>
            <TxtBox i={i} field='title' label='Tiêu đề' tag='h2' className='txt-title' dataPh='Tiêu đề…'>{openTitle}</TxtBox>
            <TxtBox i={i} field='txt' label='Giới thiệu' className='txt' dataPh='Giới thiệu…'>{openTxt}</TxtBox>
          </div>
          {doodle}{noteEl(i,p)}{ft}
        </>
      );
    }
    if(p.t==='ph')return <>{slotsEl(p,i,'')}{doodle}{noteEl(i,p)}{ft}</>;
    if(p.t==='pr')return <>{slotsEl(p,i,' pr')}{doodle}{noteEl(i,p)}{ft}</>;
    if(p.t==='vd')return <>{vdEl(p,i)}{noteEl(i,p)}{ft}</>;
    if(p.t==='vd1')return <>{vdBig(p,i)}{noteEl(i,p)}{ft}</>;
    if(p.t==='tx'){
      const txtVal=(p.txt!==undefined&&p.txt!=='')?p.txt:(getHistoryFallback(p.title,i)||'');
      return (
        <>
          <div className='tx'>
            <TxtBox i={i} field='title' label='Tiêu đề' tag='h2' className='txt-title' dataPh='Tiêu đề…'>{p.title}</TxtBox>
            <TxtBox i={i} field='txt' label='Nội dung' className='body' dataPh='Nội dung bài viết…'>{edit?txtVal:renderClickableText(txtVal)}</TxtBox>
          </div>
          {doodle}{noteEl(i,p)}{ft}
        </>
      );
    }
    if(p.t==='end'){
      const endT1=p.title||'Chào mừng kỉ niệm 60 năm thành lập trường';
      const endT2=p.txt||'Hành trình vẫn còn dang dở — và chúng ta là những trang tiếp theo.';
      const endClass=p.by||'11A1 cùng nhau viết tiếp trang sử';
      return (
        <div className='endp'>
          <div ref={endRef} className='endlogo'/>
          <TxtBox i={i} field='title' label='Tiêu đề' className={'t1 endmsg'+(cur===N?' on':'')} dataPh='Tiêu đề kết'>{endT1}</TxtBox>
          <TxtBox i={i} field='txt' label='Thông điệp' className='t2' dataPh='Thông điệp'>{endT2}</TxtBox>
          <TxtBox i={i} field='by' label='Lớp / Niên khóa' className='t3-class' dataPh='Lớp / Niên khóa'>{endClass}</TxtBox>
          <DoodleBooks className='watermark doodle-books doodle-r'/>
          {ft}
        </div>
      );
    }
    return null;
  };
  const pageEl=(p:Page,i:number,near:boolean)=>{
    if(!near)return null;
    return <>{pageBody(p,i)}{tools(i,p)}</>;
  };

  const secs:Item[]=P.map((p,i)=>({p,i})).filter(x=>x.p.t==='open');
  const front:Item[]=[],back:Item[]=[],groups:{era:Item;kids:Item[]}[]=[];
  for(const x of secs){const kd=x.p.kind;if(kd==='era')groups.push({era:x,kids:[]});else if(kd==='class'&&groups.length)groups[groups.length-1].kids.push(x);else if(groups.length)back.push(x);else front.push(x)}
  const lim=Math.min(2*cur,P.length-1);
  let curSec:Item|null=null,curEra:Item|null=null;
  for(const x of secs){if(x.i<=lim){curSec=x;if(x.p.kind==='era')curEra=x}}
  const eraTxt=(x:Item)=>'CHƯƠNG '+roman(eraNo(x.i));
  let label='';
  if(cur===0)label='BÌA TRƯỚC';else if(cur===maxCur)label='BÌA SAU';else if(cur===N)label='LỜI KẾT';
  else if(curSec){
    const c=curSec as Item;
    const def=DEFAULT_PAGE_MAP[c.i];
    const secTitle=c.p.title||def?.title||'';
    const secYrs=c.p.yrs||def?.yrs||'';
    const secKind=c.p.kind||def?.kind||'class';
    label=(secKind==='era'?eraTxt(c)+' · '+secYrs:secKind==='class'&&curEra?eraTxt(curEra as Item)+' › '+secTitle+' · '+secYrs:KIND_LABEL[secKind]+' · '+secTitle).toUpperCase();
  }
  const isOpen=cur>0&&cur<=N;
  const isClosedBack=cur===maxCur;
  const k=narrow?(half?1:0):(cur===0?0:cur===maxCur?1:.5);
  const canPrev=narrow?(cur>0||half):(cur>0);
  const canNext=narrow?(cur<maxCur||!half):(cur<maxCur);

  const tocBtn=(x:Item)=>{
    const def=DEFAULT_PAGE_MAP[x.i];
    const title=x.p.title||def?.title||'';
    const yrs=x.p.yrs||def?.yrs||'';
    const kind=x.p.kind||def?.kind||'class';
    const kLabel=kind==='era'?eraTxt(x):KIND_LABEL[kind];
    return <li key={x.i}><button onClick={()=>{goPage(x.i);setToc(false)}}><span className='k'>{kLabel}</span><b>{title}</b><i>{yrs}</i><em>tr.{x.i+1}</em></button>{edit&&<span className='x' onClick={()=>delSection(x.i)} title='Xóa'>✕</span>}</li>;
  };

  return (
  <div className={'root'+(edit?' editing':'')} onPointerMove={onMove} onTouchStart={onTS} onTouchEnd={onTE}>
    <style>{CSS}</style>
    <div className='school-gate-bg' aria-hidden='true'/>
    <Fireflies/>
    <div id='bar' style={{width:(cur/maxCur*100)+'%'}}/>
    <div id='top' className='glass'>{label}</div>
    {edit?<div id='tb' className='glass'><button className='btn' onClick={()=>addAfter(here(),'tx')}>＋ 1 trang</button><button className='btn' onClick={()=>addAfter(here(),'vd')}>＋ 1 video</button><button className='btn' onClick={save}>💾 Lưu</button><button className='btn' onClick={logout}>Đăng xuất</button></div>:<button id='lock' className='glass' title='Đăng nhập biên tập' aria-label='Đăng nhập biên tập' onClick={()=>setModal(true)}>🔒</button>}
    {edit&&<div id='tb2' className='glass'><button className='btn' onClick={undo} disabled={!hn} title='Hoàn tác thao tác vừa làm (Ctrl+Z)'>↩ Hoàn tác</button><button className='btn' onClick={restorePrev} title='Lấy lại bản đã lưu trước lần Lưu gần nhất'>⟲ Bản lưu trước</button><button className='btn' onClick={reloadSaved} title='Bỏ các chỉnh sửa chưa lưu'>↺ Bỏ chưa lưu</button><button className='btn' onClick={toDefault} title='Đưa sách về bản mặc định ban đầu'>⟳ Về mặc định</button></div>}
    <div id='stage'><div id='tilt' ref={tilt}><div id='book' className={(isOpen?'is-open':'')+(isClosedBack?' is-closed-back':'')+(narrow&&half?' is-half':'')} style={{['--k' as any]:k}}>
      {Array.from({length:N+1}).map((_,j)=>{const f=j<cur;const isMv=mv.includes(j);const near=Math.abs(j-cur)<=(narrow?2:3)||isMv;const isLeftActive=(narrow?(half&&j===cur-1):(j===cur-1&&cur>0))&&!isMv;const isRightActive=(narrow?(!half&&j===cur):(j===cur&&cur<N+1))&&!isMv;const zIdx=isMv?200:(f?j+1:(N+1)-j);const isVis=narrow?(isMv||Math.abs(j-cur)<=1||(near&&(half?j<cur:j>=cur))):near;
        if(j===N){
          const endIdx=P.length-1;
          const endP=P[endIdx]||{} as any;
          const gateImg=(endP as any).gateImg||FRAME;
          const gateTitle=(endP as any).gateTitle||'TRƯỜNG THPT QUẾ VÕ SỐ 1';
          const gateYrs=(endP as any).gateYrs||'1966 — 2026';
          const gateMotto=(endP as any).gateMotto||'TỰ HÀO TRUYỀN THỐNG — VỮNG BƯỚC TƯƠNG LAI';
          const gateSub=(endP as any).gateSub||'Kỷ niệm 60 năm thành lập trường';

          const backTitle=(endP as any).backTitle||'THPT QUẾ VÕ SỐ 1';
          const backYrs=(endP as any).backYrs||'1966 — 2026';
          const backMotto=(endP as any).backMotto||'Tự hào truyền thống — Vững bước tương lai';
          const backSub=(endP as any).backSub||'Một dòng ký ức 60 năm';
          const backSig=(endP as any).backSig||'HW';

          return(
            <div key={j} className={'leaf'+(f?' flip':'')+(near?' near':'')} style={{zIndex:zIdx,visibility:isVis?'visible':'hidden',pointerEvents:(isLeftActive||isRightActive||isMv)?'auto':'none',transitionDelay:(isMv&&mv.length>1)?Math.min(Math.abs(j-cur)*35,300)+'ms':'0ms'}}>
              <div className='face front' onClick={faceClick('front')} style={{pointerEvents:isRightActive?'auto':'none'}}>
                <div className='end-school-page'>
                  <div className='crest-frame' onClick={e=>{
                    if(edit){
                      e.stopPropagation();
                      pick.current={p:endIdx,s:99};
                      fi.current?.click();
                    }
                  }} title={edit?'Bấm để đổi ảnh phác họa cổng trường':undefined} style={edit?{cursor:'pointer',position:'relative'}:undefined}>
                    <img src={gateImg} alt='Trường THPT Quế Võ số 1' className='gate-sketch'/>
                    {edit&&<span style={{position:'absolute',bottom:6,right:6,background:'rgba(40,25,8,.85)',color:'#f6e7bd',padding:'3px 8px',borderRadius:6,fontSize:10,pointerEvents:'none'}}>📷 Đổi ảnh</span>}
                  </div>
                  <TxtBox i={endIdx} field='gateTitle' label='Tên trường' tag='h2' dataPh='Tên trường'>{gateTitle}</TxtBox>
                  <TxtBox i={endIdx} field='gateYrs' label='Năm' className='end-yrs' tag='p' dataPh='Năm'>{gateYrs}</TxtBox>
                  <TxtBox i={endIdx} field='gateMotto' label='Khẩu hiệu' className='end-motto' dataPh='Khẩu hiệu'>{gateMotto}</TxtBox>
                  <TxtBox i={endIdx} field='gateSub' label='Phụ đề' className='end-sub' tag='p' dataPh='Phụ đề'>{gateSub}</TxtBox>
                </div>
                {tools(endIdx,endP)}
              </div>
              <div className='face back face-back-cover' onClick={faceClick('back')} style={{pointerEvents:isLeftActive?'auto':'none'}}>
                <div className='t-cover t-back-cover'>
                  <div className='back-crest'>
                    {logoOk?<img src={LOGO} alt='Logo 60 năm THPT Quế Võ số 1' draggable={false}/>:<span className='lgtxt'>60</span>}
                  </div>
                  <TxtBox i={endIdx} field='backTitle' label='Tiêu đề bìa sau' tag='h1' dataPh='Tiêu đề bìa sau'>{backTitle}</TxtBox>
                  <TxtBox i={endIdx} field='backYrs' label='Niên khóa' tag='h2' dataPh='Niên khóa'>{backYrs}</TxtBox>
                  <TxtBox i={endIdx} field='backMotto' label='Khẩu hiệu' tag='p' dataPh='Khẩu hiệu'>{backMotto}</TxtBox>
                  <TxtBox i={endIdx} field='backSub' label='Dòng chữ' tag='em' dataPh='Dòng chữ'>{backSub}</TxtBox>
                  <div className='hw-sig' {...E(endIdx,'backSig')} data-ph='Ký tên' title={edit?'Chữ ký':undefined}>{backSig}</div>
                </div>
              </div>
            </div>
          );
        }
        const a=P[2*j],b=P[2*j+1];return(
        <div key={j} className={'leaf'+(f?' flip':'')+(near?' near':'')} style={{zIndex:zIdx,visibility:isVis?'visible':'hidden',pointerEvents:(isLeftActive||isRightActive||isMv)?'auto':'none',transitionDelay:(isMv&&mv.length>1)?Math.min(Math.abs(j-cur)*35,300)+'ms':'0ms'}}>
          <div
            className='face front'
            data-p={2*j}
            onDragOver={e => { if(edit){ e.preventDefault(); e.dataTransfer.dropEffect = 'move'; e.currentTarget.classList.add('drop-target-active'); } }}
            onDragLeave={e => { e.currentTarget.classList.remove('drop-target-active'); }}
            onDrop={e => {
              if(!edit) return;
              e.preventDefault();
              e.currentTarget.classList.remove('drop-target-active');
              document.querySelectorAll('.slot-drop-target').forEach(el => el.classList.remove('slot-drop-target'));
              try {
                const raw = e.dataTransfer.getData('application/json');
                if (!raw) return;
                const data = JSON.parse(raw);
                if (data.fromI !== undefined && data.fromK !== undefined) {
                  const slotEl = (e.target as HTMLElement).closest('[data-slot-k]') as HTMLElement | null;
                  const targetK = slotEl ? parseInt(slotEl.getAttribute('data-slot-k') || '', 10) : undefined;
                  moveSlotToPage(data.fromI, data.fromK, 2*j, targetK);
                }
              } catch(_) {}
            }}
            onClick={faceClick('front')}
            style={{pointerEvents:isRightActive?'auto':'none'}}
          >
            {pageEl(a,2*j,near)}
          </div>
          <div
            className='face back'
            data-p={2*j+1}
            onDragOver={e => { if(edit){ e.preventDefault(); e.dataTransfer.dropEffect = 'move'; e.currentTarget.classList.add('drop-target-active'); } }}
            onDragLeave={e => { e.currentTarget.classList.remove('drop-target-active'); }}
            onDrop={e => {
              if(!edit) return;
              e.preventDefault();
              e.currentTarget.classList.remove('drop-target-active');
              document.querySelectorAll('.slot-drop-target').forEach(el => el.classList.remove('slot-drop-target'));
              try {
                const raw = e.dataTransfer.getData('application/json');
                if (!raw) return;
                const data = JSON.parse(raw);
                if (data.fromI !== undefined && data.fromK !== undefined) {
                  const slotEl = (e.target as HTMLElement).closest('[data-slot-k]') as HTMLElement | null;
                  const targetK = slotEl ? parseInt(slotEl.getAttribute('data-slot-k') || '', 10) : undefined;
                  moveSlotToPage(data.fromI, data.fromK, 2*j+1, targetK);
                }
              } catch(_) {}
            }}
            onClick={faceClick('back')}
            style={{pointerEvents:isLeftActive?'auto':'none'}}
          >
            {pageEl(b,2*j+1,near)}
          </div>
        </div>)})}
    </div></div></div>
    <div id='dock' className='glass'>
      <button onClick={()=>step(-1)} disabled={!canPrev} style={{opacity:canPrev?1:0.3,cursor:canPrev?'pointer':'default'}} title={canPrev?'Trang trước':'Đã ở bìa trước'}>‹</button>
      <button className={toc?'on':''} onClick={()=>setToc(true)}>☰ Mục lục</button>
      <button onClick={()=>step(1)} disabled={!canNext} style={{opacity:canNext?1:0.3,cursor:canNext?'pointer':'default'}} title={canNext?'Trang sau':'Đã ở bìa sau'}>›</button>
    </div>
    <div id='toc' className={toc?'on':''} onClick={()=>setToc(false)}><div className='panel glass' onClick={e=>e.stopPropagation()}>
      <h3>Mục lục</h3>
      {front.length>0&&<h4>MỞ ĐẦU</h4>}
      <ul>{front.map(tocBtn)}</ul>
      {groups.map(g=><div className='grp' key={g.era.i}><ul>{tocBtn(g.era)}</ul><ul className='kids'>{g.kids.map(tocBtn)}</ul>{edit&&<button className='btn sm' onClick={()=>addClass(g.era.i)}>＋ khóa / lớp</button>}</div>)}
      {back.length>0&&<h4>TƯ LIỆU</h4>}
      <ul>{back.map(tocBtn)}</ul>
      {edit&&<div className='add'><button className='btn' onClick={()=>addSection('era')}>＋ Chương mới</button><button className='btn' onClick={()=>addSection('history')}>＋ Lược sử</button><button className='btn' onClick={()=>addSection('principals')}>＋ Hiệu trưởng</button><button className='btn' onClick={()=>addSection('video')}>＋ Video</button></div>}
    </div></div>
    <div id='toast' className={'glass'+(msg?' on':'')}>{msg}</div>
    <input ref={fi} type='file' accept='image/*' multiple hidden onChange={e=>{const fs=Array.from(e.target.files||[]);e.target.value='';if(fs.length)onFiles(fs)}}/>
    <input ref={vfi} type='file' accept='video/*' hidden onChange={e=>{const f=e.target.files?.[0];e.target.value='';if(f)onVideo(f)}}/>
    <div id='modal' className={modal?'on':''}><div className='card glass'><h3>Đăng nhập biên tập</h3><input placeholder='Email / Tài khoản' value={u} onChange={e=>setU(e.target.value)} autoComplete='username'/><input type='password' placeholder='Mật khẩu' value={pw} onChange={e=>setPw(e.target.value)} autoComplete='current-password' onKeyDown={e=>{if(e.key==='Enter')login()}}/><div className='err'>{err}</div><button className='btn go' onClick={login}>Đăng nhập</button><button className='btn' style={{textAlign:'center'}} onClick={()=>setModal(false)}>Đóng</button></div></div>
    <div id='lb' className={lb?'on':''} onClick={()=>setLb(null)}>{lb&&<figure onClick={e=>e.stopPropagation()}>{lb.v==='yt'?<iframe src={`https://www.youtube.com/embed/${lb.src}?autoplay=1&rel=0`} allow='autoplay; encrypted-media; fullscreen' allowFullScreen/>:lb.v==='file'?<video src={lb.src} controls autoPlay playsInline/>:<img src={lb.src} alt={lb.cap} style={lb.rot?{transform:`rotate(${lb.rot}deg)`,...(lb.rot%180!==0?{maxWidth:'78vh',maxHeight:'88vw'}:{})}:undefined}/>}<figcaption>{lb.cap}</figcaption></figure>}</div>
    <div id='logo60' className={lgMode==='corner'?'corner':''} onClick={logoClick} title={lgMode==='corner'?'Về trang bìa':undefined} style={{left:lg.x,top:lg.y,width:lg.s,height:lg.s,opacity:(intro||!lgReady)?0:1,pointerEvents:(lgMode==='corner'&&!intro)?'auto':'none',transition:lgAnim?undefined:'none'}}>{logoOk?<img src={LOGO} alt='Logo 60 năm THPT Quế Võ số 1' draggable={false} onError={()=>setLogoOk(false)}/>:<span className='lgtxt'>60</span>}</div>
    <div id='intro' className={intro?'':'hide'}><div className='school-gate-bg' aria-hidden='true'/><div className='in' style={{top:'-12vh'}}><h1>60 NĂM</h1><p>MỘT DÒNG KÝ ỨC</p><button className='btn' onClick={()=>{setIntro(false);setTimeout(()=>go(1),500)}}>Mở cuốn sách ký ức</button></div></div>
  </div>);
}
