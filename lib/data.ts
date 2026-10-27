export type Slot={src:string;cap:string;v?:string;rot?:number;dx?:number;dy?:number;frot?:number;sw?:number;sh?:number;zoom?:number;span?:string;ar?:string;fit?:string};
export type Kind='class'|'history'|'principals'|'video'|'era';
export type Page={t:'cover'|'q'|'open'|'ph'|'pr'|'tx'|'vd'|'vd1'|'thx'|'end';kind?:Kind;yrs?:string;title?:string;txt?:string;by?:string;s?:Slot[]};
export const KIND_LABEL:Record<string,string>={class:'LỚP · KHÓA',history:'LƯỢC SỬ',principals:'HIỆU TRƯỞNG',video:'VIDEO',era:'CHƯƠNG'};
export const ERAS:[string,string,string,string][]=[
['1966 — 1975','Những viên gạch đầu tiên','Có những ngôi trường không bắt đầu bằng tiếng trống, mà bằng đôi bàn tay dựng lớp bên cánh đồng Kinh Bắc. Mái tranh, bảng đen, và niềm tin lặng lẽ rằng con chữ sẽ đi xa hơn con đường làng.','196x – 197x'],
['1976 — 1985','Giữ lửa trong gian khó','Những năm tháng thiếu thốn, thầy trò chia nhau từng cuốn vở, từng ngọn đèn dầu. Thiếu đủ thứ, chỉ không thiếu tình thầy trò.','197x – 198x'],
['1986 — 1995','Đổi mới, khát vọng mới','Cánh cổng mở ra những chân trời rộng hơn. Thế hệ học trò mang theo giấc mơ rời quê, để rồi mang cả quê hương trở về trong tim.','198x – 199x'],
['1996 — 2005','Sân trường rợp bóng phượng','Mùa hè nào cũng đỏ một màu phượng. Lưu bút, tà áo trắng, và những lời hẹn mà ta ngỡ sẽ còn mãi.','199x – 200x'],
['2006 — 2015','Tiếp bước truyền thống','Trường lớn lên cùng thời đại, nhưng vẫn nguyên một mái nhà chung. Mỗi thế hệ đi qua đều để lại một dấu chân.','200x – 201x'],
['2016 — 2026','Hôm nay, ngày mai','Sáu mươi năm — một chặng đường, không phải điểm dừng. Tự hào truyền thống, vững bước tương lai.','201x – 202x']];
const slots=(cap:string):Slot[]=>[0,1,2,3].map(()=>({src:'',cap}));
export const mkPh=():Page=>({t:'ph',s:slots('Chú thích ký ức…')});
export const mkPr=():Page=>({t:'pr',s:slots('Họ và tên · Nhiệm kỳ')});
export const mkVd=():Page=>({t:'vd',s:[{src:'',cap:'Tên video…'},{src:'',cap:'Tên video…'}]});
export const mkVd1=():Page=>({t:'vd1',s:[{src:'',cap:'Tên video…'}]});
export const mkTx=(title='Tiêu đề',txt='Viết nội dung ở đây…'):Page=>({t:'tx',title,txt});
const blank=():Page=>({t:'q',txt:'',by:''});
const vdText=():Page=>mkTx('Tên video','Viết vài dòng giới thiệu về video này…');
export function mkSection(kind:Kind,title?:string,yrs?:string,txt?:string):Page[]{
if(kind==='era')return [{t:'open',kind,title:title||'Chương mới',yrs:yrs||'20xx — 20xx',txt:txt||'Viết vài dòng mở đầu cho giai đoạn này…'},mkPh()];
if(kind==='history')return [{t:'open',kind,title:title||'Lược sử nhà trường',yrs:yrs||'1966 — 2026',txt:'Nơi viết lại hành trình nhà trường, từ những ngày đầu thành lập đến hôm nay.'},mkTx('Những ngày đầu','Viết về thời kỳ thành lập, những thầy cô và lớp học đầu tiên…'),mkTx('Những chặng đường','Viết về các cột mốc, thành tích, những thay đổi qua từng giai đoạn…'),mkTx('Hôm nay và mai sau','Viết về ngôi trường hôm nay và niềm tin vào thế hệ tiếp theo…')];
if(kind==='principals')return [{t:'open',kind,title:title||'Hiệu trưởng qua các thời kỳ',yrs:yrs||'1966 — 2026',txt:'Những người đã giữ ngọn lửa của nhà trường qua từng thời kỳ.'},mkPr(),mkPr(),mkPr()];
if(kind==='video')return [{t:'open',kind,title:title||'Video kỷ niệm',yrs:yrs||'Những thước phim xưa',txt:'Nơi lưu giữ những đoạn phim thầy trò, lễ hội, buổi diễn… Bấm vào khung để xem.'},mkVd1(),vdText(),mkVd1(),vdText(),blank()];
return [{t:'open',kind:'class',title:title||'Lớp 9A',yrs:yrs||'Khóa 19xx – 19xx',txt:'Vài dòng về lớp: thầy cô chủ nhiệm, những kỷ niệm đáng nhớ…'},mkPh(),mkPh(),mkPh()];
}
const mkHistory=():Page[]=>[
{t:'open',kind:'history',title:'Lược sử nhà trường',yrs:'1966 — 2026',txt:'Hành trình 60 năm của Trường THPT Quế Võ số 1, từ khóa học đầu tiên năm 1965 đến hôm nay.'},
mkTx('Những ngày đầu thành lập (1965–1970)','Khóa học đầu tiên của trường được khai giảng vào tháng 10/1965. Đến năm 1966, Trường cấp 3 Quế Võ chính thức được thành lập, đặt nền móng cho giáo dục trung học phổ thông của địa phương. Năm học đầu tiên, trường có 4 lớp với 152 học sinh. Mùa hè năm 1970, trường chuyển địa điểm sang một thôn khác trong tỉnh Bắc Ninh; trong điều kiện đất nước còn nhiều khó khăn, thầy và trò vẫn duy trì dạy và học, từng bước xây dựng nền nếp.'),
mkTx('Từng bước phát triển (1981–1988)','Đây là giai đoạn nhà trường tiếp tục mở rộng hoạt động dạy học, số lượng học sinh ngày càng tăng. Các thế hệ cán bộ, giáo viên và học sinh cùng góp sức xây dựng truyền thống hiếu học, đoàn kết và vượt khó.'),
mkTx('Đổi tên, khẳng định vị thế (1991–2000)','Năm 1991, Trường cấp 3 Quế Võ được đổi tên thành Trường THPT Quế Võ, đánh dấu một mốc mới trong quá trình phát triển. Đến năm học 1999–2000, nhà trường chính thức mang tên Trường THPT Quế Võ số 1, tiếp tục khẳng định vị thế trong hệ thống giáo dục tỉnh Bắc Ninh, chú trọng nâng cao chất lượng dạy học và bồi dưỡng học sinh giỏi.'),
mkTx('50 năm một chặng đường (2016)','Ngày 13/11/2016, trường tổ chức lễ kỷ niệm 50 năm thành lập. Quy mô nhà trường đã phát triển từ 4 lớp, 152 học sinh lên 45 lớp với gần 2.000 học sinh. Năm học 2015–2016, trường được Bộ Giáo dục và Đào tạo tặng Cờ đơn vị dẫn đầu phong trào thi đua.'),
mkTx('Danh hiệu và thành tích','Huân chương Lao động hạng Ba (năm học 2003–2004), Cờ thi đua của Thủ tướng Chính phủ cùng nhiều Bằng khen của Bộ Giáo dục và Đào tạo, UBND tỉnh Bắc Ninh. Năm học 2023–2024: 78 giải học sinh giỏi cấp tỉnh (6 Nhất, 28 Nhì, 17 Ba, 27 Khuyến khích), 631/631 thí sinh đỗ tốt nghiệp THPT. Năm học 2024–2025: 7 giải Nhất, trường đón 775 học sinh lớp 10, tổng số học sinh vượt 2.000 em.'),
mkTx('Đổi mới và chuyển đổi số (2020–2026)','Nhà trường đẩy mạnh đổi mới phương pháp dạy học và ứng dụng công nghệ; năm học 2025–2026 tham gia triển khai chương trình học Toán thích ứng ứng dụng trí tuệ nhân tạo (AI), dẫn đầu tỉnh về tỷ lệ học sinh học tập trên nền tảng số. Học sinh nhà trường dẫn đầu toàn quốc về số lượng tham gia chiến dịch trực tuyến “Tiếp sức mùa thi 2026”.'),
mkTx('Hôm nay và mai sau','Trải qua 60 năm xây dựng và phát triển, Trường THPT Quế Võ số 1 đã viết nên một chặng đường đáng tự hào của giáo dục Bắc Ninh. Thành quả hôm nay là kết tinh nỗ lực của nhiều thế hệ cán bộ quản lý, giáo viên, nhân viên và học sinh. Phát huy truyền thống hiếu học của vùng đất Kinh Bắc, nhà trường tiếp tục hướng tới đào tạo những thế hệ học sinh có kiến thức, đạo đức, bản lĩnh và khát vọng cống hiến cho xã hội.')];
export const PRINCIPALS:[string,string,string][]=[
['Thầy Trịnh Văn Nhận','1981 – 1987','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/trinh-van-nhan.jpg'],
['Thầy Nguyễn Hồng Việt','1987 – 1991','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-hong-viet.jpg'],
['Thầy Vũ Văn Bách','1991 – 1997','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/vu-van-bach.jpg'],
['Thầy Lê Đức Vĩ','1997 – 2006','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-duc-vi.jpg'],
['Thầy Nguyễn Văn Nhiên','2006 – 2013','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-van-nhien.jpg'],
['Thầy Lê Tiến Dũng','2013 – 2022','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-tien-dung.jpg']];

const mkPrincipals=():Page[]=>[
{t:'open',kind:'principals',title:'Hiệu trưởng qua các thời kỳ',yrs:'1966 — 2026',txt:'Những người đã giữ ngọn lửa của nhà trường qua từng thời kỳ.'},
{t:'pr',s:[
  {src:PRINCIPALS[0][2],cap:`${PRINCIPALS[0][0]} · ${PRINCIPALS[0][1]}`},
  {src:PRINCIPALS[1][2],cap:`${PRINCIPALS[1][0]} · ${PRINCIPALS[1][1]}`},
  {src:PRINCIPALS[2][2],cap:`${PRINCIPALS[2][0]} · ${PRINCIPALS[2][1]}`},
  {src:PRINCIPALS[3][2],cap:`${PRINCIPALS[3][0]} · ${PRINCIPALS[3][1]}`}
]},
{t:'pr',s:[
  {src:PRINCIPALS[4][2],cap:`${PRINCIPALS[4][0]} · ${PRINCIPALS[4][1]}`},
  {src:PRINCIPALS[5][2],cap:`${PRINCIPALS[5][0]} · ${PRINCIPALS[5][1]}`},
  {src:'',cap:'Thầy Phan Văn Hiếu · 2022 – nay'},
  {src:'',cap:'Họ và tên · Nhiệm kỳ'}
]},
{t:'q',txt:'“Tôn sư trọng đạo — Uống nước nhớ nguồn. Tri ân công lao các thế hệ lãnh đạo nhà trường qua các thời kỳ.”',by:'THẦY TRÒ QUẾ VÕ SỐ 1'}
];

const BLOB='https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com';
const urls=(prefix:string,n:number):string[]=>Array.from({length:n},(_,i)=>BLOB+'/'+prefix+'-'+String(i+1).padStart(3,'0')+'.jpg');
const photoSection=(title:string,yrs:string,list:string[]):Page[]=>{
const pages:Page[]=[{t:'open',kind:'class',title,yrs,txt:'Những khoảnh khắc được lưu giữ.'}];
for(let i=0;i<list.length;i+=4)pages.push({t:'ph',s:[0,1,2,3].map((k):Slot=>list[i+k]?{src:list[i+k],cap:''}:{src:'',cap:'Chú thích ký ức…'})});
if(pages.length%2!==0)pages.push(blank());
return pages;
};
type PS=[string,string,string,number];
const PHOTO_BY_ERA:PS[][]=[
[['c1-lop-8a-khoa-1972-1975','Lớp 8A','Khóa 1972 – 1975',8]],
[['c2-anh-1984-1985','Ảnh năm 1984 – 1985','1984 – 1985',3]],
[],
[['c4-anh-1996','Ảnh năm 1996','1996',3],['c4-ky-niem-30-nam','Kỷ niệm 30 năm','Kỷ niệm',2],['c4-khoa-1997-2000-giao-vien-va-nha-truong','Thầy cô và nhà trường','Khóa 1997 – 2000',13],['c4-khoa-1997-2000-lop-co-kim','Lớp cô Kim','Khóa 1997 – 2000',21],['c4-khoa-1997-2000-lop-mama','Lớp Mama','Khóa 1997 – 2000',2],['c4-lop-12a1-khoa-1998-2001','Lớp 12A1','Khóa 1998 – 2001',2],['c4-ngay-20-11-2001','Ngày 20/11/2001','2001',2],['c4-khoa-2003-2006-xuan-2003','Xuân 2003','Khóa 2003 – 2006',3],['c4-khoa-2003-2006-nam-2004','Năm 2004','Khóa 2003 – 2006',4],['c4-khoa-2003-2006-nam-2006','Năm 2006','Khóa 2003 – 2006',3],['c4-khoa-2003-2006-lop-bac-my','Lớp bác Mỹ','Khóa 2003 – 2006',4],['c4-khoa-2004-2007','Khóa 2004 – 2007','2004 – 2007',4]],
[['c5-khoa-2009-2011','Khóa 2009 – 2011','2009 – 2011',2]],
[['c6-ky-niem-50-nam','Kỷ niệm 50 năm','2016',18],['c6-khoa-2017-2020','Khóa 2017 – 2020','2017 – 2020',2],['c6-lop-11a1-khoa-59','Lớp 11A1','Khóa 59',60],['c6-lop-11a2-khoa-59','Lớp 11A2','Khóa 59 (2024 – 2027)',8],['c6-lop-11a6-khoa-59','Lớp 11A6','Khóa 59 (2024 – 2027)',8],['c6-lop-11a10-khoa-59','Lớp 11A10','Khóa 59 (2024 – 2027)',1],['c6-lop-11a12-khoa-59','Lớp 11A12','Khóa 59 (2024 – 2027)',2],['c6-lop-10a5-khoa-60','Lớp 10A5','Khóa 60 (2025 – 2028)',1],['c6-lop-10a9-khoa-60','Lớp 10A9','Khóa 60 (2025 – 2028)',1]]];
export const ERA_TRANSITION_QUOTES: [string, string][] = [
  ['“Những năm tháng bom đạn sơ tán, lớp học dựng bằng tre nứa giữa lòng dân; ngọn đèn dầu soi sáng từng trang sách, thắp lên ngọn lửa hiếu học Quế Võ.”', 'KÝ ỨC NHỮNG NGÀY ĐẦU (1966 – 1975)'],
  ['“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”', 'GIỮ LỬA QUA NĂM THÁNG'],
  ['“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”', 'ĐỔI MỚI & KHÁT VỌNG'],
  ['“Dẫu thời gian có trôi đi như bóng câu qua cửa sổ, tiếng trống trường ngày khai giảng năm ấy vẫn vang vọng mãi trong tim.”', 'HOÀI NIỆM MỘT THỜI ÁO TRẮNG'],
  ['“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”', 'TIẾP BƯỚC TRUYỀN THỐNG'],
  ['“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”', 'HÔM NAY VÀ MAI SAU']
];

export const NEW_K59_CLASSES: [string, string, string][] = [
  ['Lớp 11A4', 'Khóa 59 (2024 – 2027)', 'Nhiệt huyết, sáng tạo và những kỷ niệm đáng nhớ của tuổi học trò 11A4.'],
  ['Lớp 11A11', 'Khóa 59 (2024 – 2027)', 'Nụ cười rạng rỡ, tình bạn trong sáng và hoài bão tuổi trẻ của tập thể 11A11.']
];

export function defaultPages():Page[]{
const P:Page[]=[{t:'cover'},{t:'q',txt:'“Nơi đây, mỗi viên gạch đều thuộc về một ký ức.”',by:'THẦY TRÒ QUẾ VÕ SỐ 1'}];
P.push(...mkHistory(),...mkPrincipals());
ERAS.forEach((e,i)=>{
  const qInfo = ERA_TRANSITION_QUOTES[i] || ['“Nơi đây, mỗi viên gạch đều thuộc về một ký ức.”', 'THẦY TRÒ QUẾ VÕ SỐ 1'];
  P.push({t:'open',kind:'era',title:e[1],yrs:e[0],txt:e[2]},{t:'q',txt:qInfo[0],by:qInfo[1]});
  for(const [prefix,title,yrs,n] of PHOTO_BY_ERA[i])P.push(...photoSection(title,yrs,urls(prefix,n)));
  if(i === 5){
    // Thêm các lớp mới sau 11A1 Khóa 59
    NEW_K59_CLASSES.forEach(([title, yrs, desc]) => {
      P.push(
        {t:'open',kind:'class',title,yrs,txt:desc},
        {t:'ph',s:[0,1,2,3].map(()=>({src:'',cap:`Kỷ niệm ${title}…`}))}
      );
    });
  }
});
P.push({t:'open',kind:'video',title:'Video kỷ niệm',yrs:'Những thước phim xưa',txt:'Nơi lưu giữ những đoạn phim thầy trò, lễ hội, buổi diễn… Bấm vào khung để xem.'},mkVd1(),vdText(),mkVd1(),vdText(),mkVd1(),vdText());
if(P.length%2===0)P.push({t:'q',txt:'“Sáu mươi năm — một chặng đường vinh quang. Dù ở bất cứ nơi đâu, chỉ cần ngoảnh lại, Quế Võ số 1 vẫn luôn là ngôi nhà chan chứa tình thương đón ta trở về.”',by:'HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1'});
P.push({t:'end'});
return P;
}
