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
if(kind==='video')return [{t:'tx',kind,title:title||'Video kỷ niệm',txt:txt||'Các thước phim tư liệu, phóng sự và video kỷ niệm 60 năm Trường THPT Quế Võ số 1:\n\n• Video kỷ niệm: https://www.youtube.com/\n\n(Bấm Chế độ biên tập để dán link video; bấm trực tiếp vào link để mở xem video)'}];
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
['Thầy Nguyễn Pha','1966 – 1981','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/photos/1793289513561-0-LmXKHYJoOA7iccyJHhMLStjxzCYymb.jpg'],
['Thầy Trịnh Văn Nhận','1981 – 1987','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/trinh-van-nhan.jpg'],
['Thầy Nguyễn Hồng Việt','1987 – 1991','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-hong-viet.jpg'],
['Thầy Vũ Văn Bách','1991 – 1997','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/vu-van-bach.jpg'],
['Thầy Lê Đức Vĩ','1997 – 2006','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-duc-vi.jpg'],
['Thầy Nguyễn Văn Nhiên','2006 – 2013','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-van-nhien.jpg'],
['Thầy Lê Tiến Dũng','2013 – 2022','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-tien-dung.jpg'],
['Thầy Phan Văn Hiếu','2022 – nay','https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/photos/1793289506378-0-XykGPDDsoTyjtFrKn0BKdWkOEN5hBA.jpg']];

const mkPrincipals=():Page[]=>[
{t:'open',kind:'principals',title:'Hiệu trưởng qua các thời kỳ',yrs:'1966 — 2026',txt:'Những người đã giữ ngọn lửa của nhà trường qua từng thời kỳ.'},
{t:'pr',s:[
  {src:PRINCIPALS[0][2],cap:`${PRINCIPALS[0][0]}\n${PRINCIPALS[0][1]}`},
  {src:PRINCIPALS[1][2],cap:`${PRINCIPALS[1][0]}\n${PRINCIPALS[1][1]}`},
  {src:PRINCIPALS[2][2],cap:`${PRINCIPALS[2][0]}\n${PRINCIPALS[2][1]}`},
  {src:PRINCIPALS[3][2],cap:`${PRINCIPALS[3][0]}\n${PRINCIPALS[3][1]}`}
]},
{t:'pr',s:[
  {src:PRINCIPALS[4][2],cap:`${PRINCIPALS[4][0]}\n${PRINCIPALS[4][1]}`},
  {src:PRINCIPALS[5][2],cap:`${PRINCIPALS[5][0]}\n${PRINCIPALS[5][1]}`},
  {src:PRINCIPALS[6][2],cap:`${PRINCIPALS[6][0]}\n${PRINCIPALS[6][1]}`},
  {src:PRINCIPALS[7][2],cap:`${PRINCIPALS[7][0]}\n${PRINCIPALS[7][1]}`}
]},
{t:'q',txt:'“Tôn sư trọng đạo — Uống nước nhớ nguồn. Tri ân công lao các thế hệ lãnh đạo nhà trường qua các thời kỳ.”',by:'THẦY TRÒ QUẾ VÕ SỐ 1'}
];

const BLOB='https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com';
const urls=(prefix:string,n:number):string[]=>Array.from({length:n},(_,i)=>BLOB+'/'+prefix+'-'+String(i+1).padStart(3,'0')+'.jpg');

export const QUOTE_POOL: [string, string][] = [
  ['“Tuổi thanh xuân giống như một cơn mưa rào, dẫu từng bị cảm lạnh vì tắm mưa, bạn vẫn muốn đắm mình trong cơn mưa ấy lần nữa.”', 'KÝ ỨC THANH XUÂN'],
  ['“Thời gian trôi qua, lớp học năm xưa giờ đã cũ, nhưng ký ức về thầy cô và bạn bè thì mãi vẹn nguyên như ngày đầu.”', 'MÁI TRƯỜNG MẾN YÊU'],
  ['“Có một nơi để về đó là nhà. Có những người để yêu thương đó là gia đình. Có cả hai đó là hạnh phúc — THPT Quế Võ số 1.”', 'NGÔI NHÀ CHUNG'],
  ['“Tiếng trống trường vang lên năm ấy đã khép lại một thời áo trắng, nhưng mở ra cả một trời ước mơ và khát vọng.”', 'HOÀI NIỆM MỘT THỜI'],
  ['“Những người thầy, người cô đã dành cả cuộc đời lặng lẽ chèo đò đưa bao thế hệ học trò sang sông cập bến tri thức.”', 'TRI ÂN THẦY CÔ'],
  ['“Bạn bè cũ, lớp học xưa, tiếng cười giòn tan dưới tán bàng rợp bóng… Tất cả hóa thành hành trang quý giá nhất theo ta suốt cuộc đời.”', 'TÌNH BẠN TUỔI TRÒ'],
  ['“Mỗi bức ảnh là một mảnh ghép của thanh xuân, lưu giữ trọn vẹn những nụ cười rạng rỡ nhất của chúng ta.”', 'KHOẢNH KHẮC VÔ GIÁ'],
  ['“Sáu mươi năm tự hào một mái trường — Nơi ươm mầm tri thức, nâng cánh ước mơ cho bao thế hệ học sinh Quế Võ.”', 'TỰ HÀO 60 NĂM']
];

let quoteCounter = 0;
const nextQuote = (secTitle: string): Page => {
  const q = QUOTE_POOL[quoteCounter % QUOTE_POOL.length];
  quoteCounter++;
  return { t: 'q', txt: q[0], by: `${secTitle.toUpperCase()} · ${q[1]}` };
};

const photoSection = (title: string, yrs: string, list: string[], perPage: number = 2): Page[] => {
  const pages: Page[] = [{ t: 'open', kind: 'class', title, yrs, txt: 'Những khoảnh khắc được lưu giữ.' }];
  for (let i = 0; i < list.length; i += perPage) {
    const chunk = list.slice(i, i + perPage);
    pages.push({
      t: 'ph',
      s: chunk.map((src): Slot => ({ src, cap: '' }))
    });
  }
  if (pages.length % 2 !== 0) pages.push(nextQuote(title));
  return pages;
};

type PS = [string, string, string, number, number?];
const PHOTO_BY_ERA: PS[][] = [
  [['c1-lop-8a-khoa-1972-1975', 'Lớp 8A', 'Khóa 1972 – 1975', 8, 2]],
  [['c2-anh-1984-1985', 'Ảnh năm 1984 – 1985', '1984 – 1985', 3, 2]],
  [],
  [
    ['c4-anh-1996', 'Ảnh năm 1996', '1996', 3, 2],
    ['c4-ky-niem-30-nam', 'Kỷ niệm 30 năm', 'Kỷ niệm', 2, 2],
    ['c4-khoa-1997-2000-giao-vien-va-nha-truong', 'Thầy cô và nhà trường', 'Khóa 1997 – 2000 (K31)', 13, 4],
    ['c4-khoa-1997-2000', 'Khóa 1997 – 2000', 'Khóa 1997 – 2000 (K31)', 14, 2],
    ['c4-khoa-1997-2000-lop-co-kim', 'Lớp cô Kim', 'Khóa 1997 – 2000 (K31)', 7, 2],
    ['c4-khoa-1997-2000-lop-mama', 'Lớp Mama', 'Khóa 1997 – 2000 (K31)', 2, 2],
    ['c4-lop-12a1-khoa-1998-2001', 'Lớp 12A1', 'Khóa 1998 – 2001 (K32)', 2, 2],
    ['c4-ngay-20-11-2001', 'Ngày 20/11/2001', 'Năm 2001 (K33)', 2, 2],
    ['c4-khoa-2003-2006-xuan-2003', 'Xuân 2003', 'Khóa 2003 – 2006 (K37)', 3, 2],
    ['c4-khoa-2003-2006-nam-2004', 'Năm 2004', 'Khóa 2003 – 2006 (K37)', 4, 2],
    ['c4-khoa-2003-2006-nam-2006', 'Năm 2006', 'Khóa 2003 – 2006 (K37)', 3, 2],
    ['c4-khoa-2003-2006-lop-bac-my', 'Lớp bác Mỹ', 'Khóa 2003 – 2006 (K37)', 4, 2],
    ['c4-khoa-2004-2007', 'Khóa 2004 – 2007', 'Khóa 2004 – 2007 (K38)', 4, 2]
  ],
  [['c5-khoa-2009-2011', 'Khóa 2009 – 2011', '2009 – 2011', 2, 2]],
  [
    ['c6-ky-niem-50-nam', 'Kỷ niệm 50 năm', '2016', 18, 2],
    ['c6-khoa-2017-2020', 'Khóa 2017 – 2020', '2017 – 2020', 2, 2],
    ['c6-lop-11a1-khoa-59', 'Lớp 11A1', 'Khóa 59', 28, 4],
    ['c6-lop-11a2-khoa-59', 'Lớp 11A2', 'Khóa 59 (2024 – 2027)', 8, 2],
    ['c6-lop-11a6-khoa-59', 'Lớp 11A6', 'Khóa 59 (2024 – 2027)', 8, 2],
    ['c6-lop-11a10-khoa-59', 'Lớp 11A10', 'Khóa 59 (2024 – 2027)', 1, 2],
    ['c6-lop-11a12-khoa-59', 'Lớp 11A12', 'Khóa 59 (2024 – 2027)', 2, 2],
    ['c6-lop-10a5-khoa-60', 'Lớp 10A5', 'Khóa 60 (2025 – 2028)', 1, 2],
    ['c6-lop-10a9-khoa-60', 'Lớp 10A9', 'Khóa 60 (2025 – 2028)', 1, 2]
  ]
];
export const ERA_TRANSITION_QUOTES: [string, string][] = [
  ['“Những năm tháng bom đạn sơ tán, lớp học dựng bằng tre nứa giữa lòng dân; ngọn đèn dầu soi sáng từng trang sách, thắp lên ngọn lửa hiếu học Quế Võ.”', 'KÝ ỨC NHỮNG NGÀY ĐẦU (1966 – 1975)'],
  ['“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”', 'GIỮ LỬA QUA NĂM THÁNG'],
  ['“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”', 'ĐỔI MỚI & KHÁT VỌNG'],
  ['“Dẫu thời gian có trôi đi như bóng câu qua cửa sổ, tiếng trống trường ngày khai giảng năm ấy vẫn vang vọng mãi trong tim.”', 'HOÀI NIỆM MỘT THỜI ÁO TRẮNG'],
  ['“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”', 'TIẾP BƯỚC TRUYỀN THỐNG'],
  ['“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”', 'HÔM NAY VÀ MAI SAU']
];

export const NEW_K59_CLASSES: [string, string, string][] = [];

export const PERFECT_BOOK_PAGES: Page[] = [
  {
    "t": "cover"
  },
  {
    "t": "q",
    "by": "THẦY TRÒ QUẾ VÕ SỐ 1",
    "txt": "“Nơi đây, mỗi viên gạch đều thuộc về một ký ức.”"
  },
  {
    "title": "Lược sử nhà trường",
    "t": "open",
    "yrs": "1966 — 2026",
    "txt": "Hành trình 60 năm của Trường THPT Quế Võ số 1, từ khóa học đầu tiên năm 1965 đến hôm nay.",
    "kind": "history"
  },
  {
    "txt": "Khóa học đầu tiên của trường được khai giảng vào tháng 10/1965. Đến năm 1966, Trường cấp 3 Quế Võ chính thức được thành lập, đặt nền móng cho giáo dục trung học phổ thông của địa phương. Năm học đầu tiên, trường có 4 lớp với 152 học sinh. Mùa hè năm 1970, trường chuyển địa điểm sang một thôn khác trong tỉnh Bắc Ninh; trong điều kiện đất nước còn nhiều khó khăn, thầy và trò vẫn duy trì dạy và học, từng bước xây dựng nền nếp.",
    "title": "Những ngày đầu thành lập (1965–1970)",
    "t": "tx"
  },
  {
    "t": "tx",
    "title": "Từng bước phát triển (1981–1988)",
    "txt": "Đây là giai đoạn nhà trường tiếp tục mở rộng hoạt động dạy học, số lượng học sinh ngày càng tăng. Các thế hệ cán bộ, giáo viên và học sinh cùng góp sức xây dựng truyền thống hiếu học, đoàn kết và vượt khó.",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c2-anh-1984-1985-001.jpg",
        "cap": "Thầy trò nhà trường năm học 1984 – 1985",
        "ar": "16/9"
      }
    ]
  },
  {
    "t": "tx",
    "txt": "Năm 1991, Trường cấp 3 Quế Võ được đổi tên thành Trường THPT Quế Võ, đánh dấu một mốc mới trong quá trình phát triển. Đến năm học 1999–2000, nhà trường chính thức mang tên Trường THPT Quế Võ số 1, tiếp tục khẳng định vị thế trong hệ thống giáo dục tỉnh Bắc Ninh, chú trọng nâng cao chất lượng dạy học và bồi dưỡng học sinh giỏi.",
    "title": "Đổi tên, khẳng định vị thế (1991–2000)",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-ky-niem-30-nam-001.jpg",
        "cap": "Lễ kỷ niệm 30 năm ngày thành lập trường (1966 – 1996)",
        "ar": "16/9"
      }
    ]
  },
  {
    "title": "50 năm một chặng đường (2016)",
    "t": "tx",
    "txt": "Ngày 13/11/2016, trường tổ chức lễ kỷ niệm 50 năm thành lập. Quy mô nhà trường đã phát triển từ 4 lớp, 152 học sinh lên 45 lớp với gần 2.000 học sinh. Năm học 2015–2016, trường được Bộ Giáo dục và Đào tạo tặng Cờ đơn vị dẫn đầu phong trào thi đua.",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-001.jpg",
        "cap": "Đại lễ Kỷ niệm 50 năm thành lập THPT Quế Võ số 1 (1966 – 2016)",
        "ar": "16/9"
      }
    ]
  },
  {
    "title": "Danh hiệu và thành tích",
    "txt": "Huân chương Lao động hạng Ba (năm học 2003–2004), Cờ thi đua của Thủ tướng Chính phủ cùng nhiều Bằng khen của Bộ Giáo dục và Đào tạo, UBND tỉnh Bắc Ninh. Năm học 2023–2024: 78 giải học sinh giỏi cấp tỉnh (6 Nhất, 28 Nhì, 17 Ba, 27 Khuyến khích), 631/631 thí sinh đỗ tốt nghiệp THPT. Năm học 2024–2025: 7 giải Nhất, trường đón 775 học sinh lớp 10, tổng số học sinh vượt 2.000 em.",
    "t": "tx"
  },
  {
    "txt": "Nhà trường đẩy mạnh đổi mới phương pháp dạy học và ứng dụng công nghệ; năm học 2025–2026 tham gia triển khai chương trình học Toán thích ứng ứng dụng trí tuệ nhân tạo (AI), dẫn đầu tỉnh về tỷ lệ học sinh học tập trên nền tảng số. Học sinh nhà trường dẫn đầu toàn quốc về số lượng tham gia chiến dịch trực tuyến “Tiếp sức mùa thi 2026”.",
    "t": "tx",
    "title": "Đổi mới và chuyển đổi số (2020–2026)"
  },
  {
    "title": "Hôm nay và mai sau",
    "txt": "Trải qua 60 năm xây dựng và phát triển, Trường THPT Quế Võ số 1 đã viết nên một chặng đường đáng tự hào của giáo dục Bắc Ninh. Thành quả hôm nay là kết tinh nỗ lực của nhiều thế hệ cán bộ quản lý, giáo viên, nhân viên và học sinh. Phát huy truyền thống hiếu học của vùng đất Kinh Bắc, nhà trường tiếp tục hướng tới đào tạo những thế hệ học sinh có kiến thức, đạo đức, bản lĩnh và khát vọng cống hiến cho xã hội.",
    "t": "tx"
  },
  {
    "title": "Hiệu trưởng qua các thời kỳ",
    "txt": "Những người đã giữ ngọn lửa của nhà trường qua từng thời kỳ.",
    "yrs": "1966 — 2026",
    "kind": "principals",
    "t": "open"
  },
  {
    "s": [
      {
        "cap": "Thầy Nguyễn Pha\n1966 – 1981",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/photos/1793289513561-0-LmXKHYJoOA7iccyJHhMLStjxzCYymb.jpg",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/trinh-van-nhan.jpg",
        "cap": "Thầy Trịnh Văn Nhận\n1981 – 1987",
        "ar": "3/4"
      },
      {
        "cap": "Thầy Lê Đức Vĩ\n1997 – 2006",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-hong-viet.jpg",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/vu-van-bach.jpg",
        "cap": "Thầy Nguyễn Văn Nhiên\n2006 – 2013",
        "ar": "3/4"
      }
    ],
    "t": "pr"
  },
  {
    "t": "pr",
    "s": [
      {
        "cap": "Thầy Nguyễn Hồng Việt\n1987 – 1991",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-duc-vi.jpg",
        "ar": "3/4"
      },
      {
        "cap": "Thầy Vũ Văn Bách\n1991 – 1997",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/nguyen-van-nhien.jpg",
        "ar": "3/4"
      },
      {
        "cap": "Thầy Lê Tiến Dũng\n2013 – 2022",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/principals/le-tien-dung.jpg",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/photos/1793289506378-0-XykGPDDsoTyjtFrKn0BKdWkOEN5hBA.jpg",
        "cap": "Thầy Phan Văn Hiếu\n2022 – nay",
        "ar": "3/4"
      }
    ]
  },
  {
    "t": "q",
    "txt": "“Tôn sư trọng đạo — Uống nước nhớ nguồn. Tri ân công lao các thế hệ lãnh đạo nhà trường qua các thời kỳ.”",
    "by": "THẦY TRÒ QUẾ VÕ SỐ 1"
  },
  {
    "kind": "era",
    "txt": "Có những ngôi trường không bắt đầu bằng tiếng trống, mà bằng đôi bàn tay dựng lớp bên cánh đồng Kinh Bắc. Mái tranh, bảng đen, và niềm tin lặng lẽ rằng con chữ sẽ đi xa hơn con đường làng.",
    "yrs": "1966 — 1975",
    "t": "open",
    "title": "Những viên gạch đầu tiên"
  },
  {
    "by": "KÝ ỨC NHỮNG NGÀY ĐẦU (1966 – 1975)",
    "t": "q",
    "txt": "“Những năm tháng bom đạn sơ tán, lớp học dựng bằng tre nứa giữa lòng dân; ngọn đèn dầu soi sáng từng trang sách, thắp lên ngọn lửa hiếu học Quế Võ.”"
  },
  {
    "kind": "class",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 1972 – 1975 (K6)",
    "t": "open",
    "title": "Lớp 8A"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 8A K6",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-002.jpg",
        "cap": "Cựu học sinh Lớp 8A K6"
      }
    ]
  },
  {
    "s": [
      {
        "cap": "Cựu học sinh Lớp 8A K6",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-003.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-004.jpg",
        "cap": "Cựu học sinh Lớp 8A K6"
      }
    ],
    "t": "ph"
  },
  {
    "by": "GIỮ LỬA QUA NĂM THÁNG",
    "t": "ph",
    "txt": "“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 8A K6",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-005.jpg"
      },
      {
        "cap": "Cựu học sinh Lớp 8A K6",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-006.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-007.jpg",
        "cap": "Cựu học sinh Lớp 8A K6"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c1-lop-8a-khoa-1972-1975-008.jpg",
        "cap": "Cựu học sinh Lớp 8A K6"
      }
    ],
    "t": "ph"
  },
  {
    "t": "q",
    "by": "LỚP 8A · KÝ ỨC THANH XUÂN",
    "txt": "“Tuổi thanh xuân giống như một cơn mưa rào, dẫu từng bị cảm lạnh vì tắm mưa, bạn vẫn muốn đắm mình trong cơn mưa ấy lần nữa.”"
  },
  {
    "kind": "era",
    "title": "Giữ lửa trong gian khó",
    "t": "open",
    "yrs": "1976 — 1985",
    "txt": "Những năm tháng thiếu thốn, thầy trò chia nhau từng cuốn vở, từng ngọn đèn dầu. Thiếu đủ thứ, chỉ không thiếu tình thầy trò."
  },
  {
    "t": "q",
    "txt": "“Gian khó tôi luyện ý chí, thiếu thốn nuôi lớn ước mơ. Dưới mái trường thân yêu, tình thầy trò như ngọn lửa sưởi ấm những mùa đông Kinh Bắc.”",
    "by": "GIỮ LỬA QUA NĂM THÁNG"
  },
  {
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 1982 – 1985 (K18)",
    "kind": "class",
    "title": "Ảnh năm 1984 – 1985",
    "t": "open"
  },
  {
    "txt": "“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”",
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c2-anh-1984-1985-001.jpg",
        "cap": "Lễ kỉ niệm Khóa 18 (1984 – 1985)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c2-anh-1984-1985-002.jpg",
        "cap": "Lễ kỉ niệm Khóa 18 (1984 – 1985)"
      }
    ],
    "by": "NIÊN KHÓA 1993 — 1994 (K27)"
  },
  {
    "kind": "class",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c2-anh-1984-1985-003.jpg",
        "cap": "Lễ kỉ niệm Khóa 18 (1984 – 1985)"
      }
    ],
    "title": "Ảnh năm 1993 – 1994",
    "yrs": "1993 – 1994 (K27)",
    "t": "ph",
    "txt": "Những khoảnh khắc được lưu giữ."
  },
  {
    "txt": "“Thời gian trôi qua, lớp học năm xưa giờ đã cũ, nhưng ký ức về thầy cô và bạn bè thì mãi vẹn nguyên như ngày đầu.”",
    "by": "ẢNH NĂM 1984 – 1985 · MÁI TRƯỜNG MẾN YÊU",
    "t": "q"
  },
  {
    "yrs": "1986 — 1995",
    "txt": "Cánh cổng mở ra những chân trời rộng hơn. Thế hệ học trò mang theo giấc mơ rời quê, để rồi mang cả quê hương trở về trong tim.",
    "title": "Đổi mới, khát vọng mới",
    "kind": "era",
    "t": "open"
  },
  {
    "by": "ĐỔI MỚI & KHÁT VỌNG",
    "t": "q",
    "txt": "“Thời áo trắng ngây ngô bên hàng ghế đá, tiếng ve ngân trong những buổi chiều hè. Năm tháng ấy, chúng ta đã cùng nhau lớn lên.”"
  },
  {
    "t": "open",
    "txt": "Mùa hè nào cũng đỏ một màu phượng. Lưu bút, tà áo trắng, và những lời hẹn mà ta ngỡ sẽ còn mãi.",
    "yrs": "1996 — 2005",
    "title": "Sân trường rợp bóng phượng",
    "kind": "era"
  },
  {
    "txt": "“Dẫu thời gian có trôi đi như bóng câu qua cửa sổ, tiếng trống trường ngày khai giảng năm ấy vẫn vang vọng mãi trong tim.”",
    "by": "HOÀI NIỆM MỘT THỜI ÁO TRẮNG",
    "t": "q"
  },
  {
    "t": "open",
    "kind": "class",
    "title": "Thầy cô và nhà trường",
    "yrs": "1996 — 2005",
    "txt": "Những khoảnh khắc được lưu giữ."
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "1 góc sân trường",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-anh-1996-001.jpg",
        "ar": "3/4"
      },
      {
        "cap": "Mái trường xưa",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-anh-1996-002.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-anh-1996-003.jpg",
        "cap": "Học sinh dưới tán cây sân trường"
      }
    ],
    "t": "ph"
  },
  {
    "t": "q",
    "by": "ẢNH NĂM 1996 · NGÔI NHÀ CHUNG",
    "txt": "“Có một nơi để về đó là nhà. Có những người để yêu thương đó là gia đình. Có cả hai đó là hạnh phúc — THPT Quế Võ số 1.”"
  },
  {
    "title": "Kỷ niệm 30 năm thành lập trường",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "1966 — 1996",
    "kind": "class",
    "t": "open"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-ky-niem-30-nam-001.jpg",
        "cap": "Kỷ niệm 30 năm thành lập trường (1966 – 1996)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-ky-niem-30-nam-002.jpg",
        "cap": "Kỷ niệm 30 năm thành lập trường (1966 – 1996)"
      }
    ]
  },
  {
    "yrs": "Khóa 1997 – 2000 (K31)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "kind": "class",
    "title": "Thầy cô và nhà trường",
    "t": "open"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-001.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-002.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-003.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-004.jpg",
        "ar": "3/4"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-005.jpg",
        "ar": "3/4"
      },
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-006.jpg",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-007.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-008.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "txt": "“Có một nghề bụi phấn bám đầy tay, người ta bảo đó là nghề cao quý nhất. Tri ân những người đưa đò thầm lặng đã chở bao thế hệ qua sông.”",
    "by": "TRI ÂN THẦY CÔ QUẾ VÕ 1",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-009.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-010.jpg",
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "ar": "3/4"
      },
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-011.jpg",
        "ar": "3/4"
      },
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-012.jpg",
        "ar": "3/4"
      }
    ]
  },
  {
    "t": "ph",
    "yrs": null,
    "s": [
      {
        "cap": "Thầy cô & Nhà trường · Khóa 31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-giao-vien-va-nha-truong-013.jpg",
        "ar": "3/4"
      }
    ],
    "title": null
  },
  {
    "txt": "“Tiếng trống trường vang lên năm ấy đã khép lại một thời áo trắng, nhưng mở ra cả một trời ước mơ và khát vọng.”",
    "t": "q",
    "by": "THẦY CÔ VÀ NHÀ TRƯỜNG · HOÀI NIỆM MỘT THỜI"
  },
  {
    "t": "open",
    "kind": "class",
    "yrs": "Khóa 1997 – 2000 (K31)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "title": "Khóa 1997 – 2000"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-001.jpg",
        "cap": "Hội ngộ 25 năm Kỷ niệm Ngày ra trường · Lớp 12A3 K31"
      },
      {
        "cap": "Kỷ niệm 21 năm 10A3 - 12A3 (1997 – 2018)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-002.jpg"
      }
    ]
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-003.jpg",
        "cap": "Các nữ sinh 12A3 trong ngày họp mặt kỷ niệm"
      },
      {
        "cap": "Học sinh trước cổng trường THPT Quế Võ xưa",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-004.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-005.jpg",
        "cap": "Tập thể lớp trước khu phòng học và hàng phượng vĩ"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-006.jpg",
        "cap": "Xếp hình chữ 12A3 trên sân trường"
      }
    ],
    "by": "LƯU BÚT TUỔI HỌC TRÒ",
    "t": "ph",
    "txt": "“Những dòng lưu bút viết vội ngày chia tay, cái ôm thật chặt trước cổng trường. Tạm biệt nhé, thanh xuân tươi đẹp nhất của chúng mình!”"
  },
  {
    "t": "ph",
    "yrs": null,
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-007.jpg",
        "cap": "Các bạn học sinh trên con đường rợp bóng cây"
      },
      {
        "cap": "Học sinh bên cổng trường THPT Quế Võ",
        "rot": 270,
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-008.jpg",
        "ar": "3/4"
      }
    ],
    "title": null
  },
  {
    "t": "ph",
    "s": [
      {
        "rot": 270,
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-009.jpg",
        "cap": "Cựu học sinh Lớp 12A7 K31",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-010.jpg",
        "cap": "Cựu học sinh Lớp 12A7 K31"
      }
    ]
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-011.jpg",
        "cap": "Cựu học sinh Lớp 12A7 K31"
      },
      {
        "cap": "Cựu học sinh Lớp 12A7 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-012.jpg"
      }
    ]
  },
  {
    "by": "THANH XUÂN DƯỚI MÁI TRƯỜNG",
    "t": "ph",
    "txt": "“Thời gian có thể làm phai mờ màu mực, nhưng không thể xóa nhòa tiếng cười giòn tan nơi góc lớp thân thương.”",
    "s": [
      {
        "rot": 270,
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-013.jpg",
        "cap": "Kỷ niệm bên thềm lớp học xưa",
        "ar": "3/4"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-014.jpg",
        "cap": "Học sinh rạng rỡ dưới tán phượng vĩ sân trường"
      }
    ]
  },
  {
    "yrs": "Khóa 1997 – 2000 (K31)",
    "txt": "Khóa 1997 – 2000 (K31) · Lớp 12A3 cô Kim",
    "t": "open",
    "title": "Lớp 12A3",
    "kind": "class"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 12A3 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-001.jpg"
      },
      {
        "cap": "Cựu học sinh Lớp 12A3 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-002.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "cap": "Cựu học sinh Lớp 12A3 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-003.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-004.jpg",
        "cap": "Cựu học sinh Lớp 12A3 K31"
      }
    ],
    "yrs": null,
    "t": "ph",
    "title": null
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-005.jpg",
        "cap": "Cựu học sinh Lớp 12A3 K31"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-006.jpg",
        "cap": "Cựu học sinh Lớp 12A3 K31"
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-co-kim-007.jpg",
        "cap": "Cựu học sinh Lớp 12A3 K31"
      }
    ]
  },
  {
    "by": "LỚP CÔ KIM · TRI ÂN THẦY CÔ",
    "t": "q",
    "txt": "“Những người thầy, người cô đã dành cả cuộc đời lặng lẽ chèo đò đưa bao thế hệ học trò sang sông cập bến tri thức.”"
  },
  {
    "t": "open",
    "kind": "class",
    "txt": "Khóa 1997 – 2000 (K31) · Lớp 12A9",
    "yrs": "Khóa 1997 – 2000 (K31)",
    "title": "Lớp 12A9"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 12A9 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-mama-001.jpg",
        "rot": 0
      },
      {
        "cap": "Cựu học sinh Lớp 12A9 K31",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-1997-2000-lop-mama-002.jpg",
        "rot": 270
      }
    ]
  },
  {
    "title": "Lớp 12A1",
    "txt": "Khóa 1998 – 2001 (K32) · Lớp 12A1",
    "yrs": "Khóa 1998 – 2001 (K32)",
    "kind": "class",
    "t": "open"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-lop-12a1-khoa-1998-2001-001.jpg",
        "rot": 270,
        "cap": "Cựu học sinh Lớp 12A1 K32"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-lop-12a1-khoa-1998-2001-002.jpg",
        "rot": 270,
        "cap": "Cựu học sinh Lớp 12A1 K32"
      }
    ]
  },
  {
    "kind": "class",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Năm 2001 (K33)",
    "t": "open",
    "title": "Kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2001"
  },
  {
    "s": [
      {
        "cap": "Kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2001 (K33)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-ngay-20-11-2001-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-ngay-20-11-2001-002.jpg",
        "cap": "Kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2001 (K33)"
      }
    ],
    "t": "ph"
  },
  {
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 2003 – 2006 (K37)",
    "kind": "class",
    "title": "Xuân 2003",
    "t": "open"
  },
  {
    "s": [
      {
        "cap": "Học sinh Khóa 37 · Xuân 2003",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-xuan-2003-001.jpg"
      },
      {
        "cap": "Học sinh Khóa 37 · Xuân 2003",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-xuan-2003-002.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "yrs": null,
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-xuan-2003-003.jpg",
        "cap": "Học sinh Khóa 37 · Xuân 2003"
      }
    ],
    "title": null
  },
  {
    "by": "XUÂN 2003 · TÌNH BẠN TUỔI TRÒ",
    "t": "q",
    "txt": "“Bạn bè cũ, lớp học xưa, tiếng cười giòn tan dưới tán bàng rợp bóng… Tất cả hóa thành hành trang quý giá nhất theo ta suốt cuộc đời.”"
  },
  {
    "t": "open",
    "yrs": "Khóa 2003 – 2006 (K37)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "title": "Năm 2004",
    "kind": "class"
  },
  {
    "by": "TIẾP BƯỚC TRUYỀN THỐNG",
    "txt": "“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”",
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2004-001.jpg",
        "cap": "Học sinh Khóa 37 · Năm 2004"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2004-002.jpg",
        "cap": "Học sinh Khóa 37 · Năm 2004",
        "ar": "3/4"
      }
    ]
  },
  {
    "yrs": null,
    "s": [
      {
        "cap": "Học sinh Khóa 37 · Năm 2004",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2004-003.jpg"
      },
      {
        "cap": "Học sinh Khóa 37 · Năm 2004",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2004-004.jpg"
      }
    ],
    "t": "ph",
    "title": null
  },
  {
    "txt": "“Mỗi bức ảnh là một mảnh ghép của thanh xuân, lưu giữ trọn vẹn những nụ cười rạng rỡ nhất của chúng ta.”",
    "t": "q",
    "by": "NĂM 2004 · KHOẢNH KHẮC VÔ GIÁ"
  },
  {
    "title": "Năm 2006",
    "yrs": "Khóa 2003 – 2006 (K37)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "kind": "class",
    "t": "open"
  },
  {
    "s": [
      {
        "cap": "Học sinh Khóa 37 · Năm 2006 vui vẻ bên sân trường",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2006-001.jpg"
      },
      {
        "cap": "Học sinh Khóa 37 · Năm 2006 vui vẻ bên sân trường",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2006-002.jpg"
      }
    ],
    "txt": "“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”",
    "t": "ph",
    "by": "50 NĂM MỘT CHẶNG ĐƯỜNG (1966 — 2016)"
  },
  {
    "yrs": null,
    "t": "ph",
    "title": null,
    "s": [
      {
        "cap": "Học sinh Khóa 37 · Năm 2006 vui vẻ bên sân trường",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-nam-2006-003.jpg"
      }
    ]
  },
  {
    "t": "q",
    "by": "NĂM 2006 · TỰ HÀO 60 NĂM",
    "txt": "“Sáu mươi năm tự hào một mái trường — Nơi ươm mầm tri thức, nâng cánh ước mơ cho bao thế hệ học sinh Quế Võ.”"
  },
  {
    "t": "open",
    "title": "Lớp 12A1",
    "kind": "class",
    "txt": "Khóa 2003 – 2006 (K37) · Lớp 12A1",
    "yrs": "Khóa 2003 – 2006 (K37)"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 12A1 K37",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-lop-bac-my-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-lop-bac-my-002.jpg",
        "cap": "Cựu học sinh Lớp 12A1 K37"
      }
    ]
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Cựu học sinh Lớp 12A1 K37",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-lop-bac-my-003.jpg"
      },
      {
        "cap": "Cựu học sinh Lớp 12A1 K37",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2003-2006-lop-bac-my-004.jpg"
      }
    ]
  },
  {
    "by": "LỚP BÁC MỸ · KÝ ỨC THANH XUÂN",
    "t": "q",
    "txt": "“Tuổi thanh xuân giống như một cơn mưa rào, dẫu từng bị cảm lạnh vì tắm mưa, bạn vẫn muốn đắm mình trong cơn mưa ấy lần nữa.”"
  },
  {
    "t": "open",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "kind": "class",
    "yrs": "Khóa 2004 – 2007 (K38)",
    "title": "Lớp 12A4"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2004-2007-001.jpg",
        "cap": "Khuôn viên vườn trường Khóa 38 (2004 – 2007)"
      },
      {
        "cap": "Trường Quế Võ 1 Khóa 38 (2004 – 2007)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2004-2007-002.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "rot": 270,
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2004-2007-003.jpg",
        "cap": "Cựu học sinh Khóa 38 (2004 – 2007)"
      },
      {
        "cap": "Cựu học sinh Khóa 38 (2004 – 2007)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c4-khoa-2004-2007-004.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "t": "q",
    "by": "KHÓA 2004 – 2007 · MÁI TRƯỜNG MẾN YÊU",
    "txt": "“Thời gian trôi qua, lớp học năm xưa giờ đã cũ, nhưng ký ức về thầy cô và bạn bè thì mãi vẹn nguyên như ngày đầu.”"
  },
  {
    "title": "Tiếp bước truyền thống",
    "kind": "era",
    "t": "open",
    "txt": "Trường lớn lên cùng thời đại, nhưng vẫn nguyên một mái nhà chung. Mỗi thế hệ đi qua đều để lại một dấu chân.",
    "yrs": "2006 — 2015"
  },
  {
    "by": "TIẾP BƯỚC TRUYỀN THỐNG",
    "t": "q",
    "txt": "“Trường xưa vẫn rợp bóng cây, thầy cô vẫn bên bục giảng. Chỉ có chúng ta là bay xa, mang theo trọn vẹn niềm tự hào Quế Võ 1.”"
  },
  {
    "kind": "class",
    "title": "Khóa 2009 – 2011",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 2008 – 2011 (K43)",
    "t": "open"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c5-khoa-2009-2011-001.jpg",
        "cap": "Cựu học sinh Khóa 43 (2009 – 2011)"
      },
      {
        "cap": "Cựu học sinh Khóa 43 (2009 – 2011)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c5-khoa-2009-2011-002.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "t": "open",
    "kind": "era",
    "title": "Hôm nay, ngày mai",
    "txt": "Sáu mươi năm — một chặng đường, không phải điểm dừng. Tự hào truyền thống, vững bước tương lai.",
    "yrs": "2016 — 2026"
  },
  {
    "txt": "“Nửa thế kỷ dựng xây và trưởng thành. Năm mươi mùa phượng nở là bấy nhiêu ân tình, bấy nhiêu thế hệ làm rạng danh quê hương Kinh Bắc.”",
    "t": "q",
    "by": "HÔM NAY VÀ MAI SAU"
  },
  {
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "1966 — 2016",
    "kind": "class",
    "title": "Kỷ niệm 50 năm thành lập trường",
    "t": "open"
  },
  {
    "s": [
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-002.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-003.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-004.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-005.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-006.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-007.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-008.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-009.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-010.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-011.jpg"
      },
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-012.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-013.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-014.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-015.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      },
      {
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-016.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-017.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-ky-niem-50-nam-018.jpg",
        "cap": "Kỷ niệm 50 năm thành lập trường (1966 – 2016)"
      }
    ]
  },
  {
    "t": "open",
    "title": "Khóa 2017 – 2020",
    "kind": "class",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 2017 – 2020 (K51)"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-khoa-2017-2020-001.jpg",
        "cap": "Cựu học sinh Khóa 51 (2017 – 2020)",
        "ar": "3/4"
      },
      {
        "cap": "Cựu học sinh Khóa 51 (2017 – 2020)",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-khoa-2017-2020-002.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "yrs": "Khóa 59 (2024 – 2027)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "kind": "class",
    "title": "Lớp 11A1",
    "t": "open"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-001.jpg"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-002.jpg"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-003.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-004.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      }
    ]
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-005.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-006.jpg"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-007.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-008.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      }
    ]
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-009.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-010.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-011.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-012.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-013.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-014.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-015.jpg"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-016.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-017.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-018.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-019.jpg"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-020.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-021.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-022.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-023.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-024.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      }
    ],
    "t": "ph"
  },
  {
    "s": [
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-025.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-026.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-027.jpg",
        "cap": "Tập thể Lớp 11A1 Khóa 59"
      },
      {
        "cap": "Tập thể Lớp 11A1 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a1-khoa-59-028.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "by": "HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1",
    "t": "open",
    "kind": "class",
    "yrs": "Khóa 59 (2024 – 2027)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "title": "Lớp 11A2"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-002.jpg",
        "cap": ""
      }
    ]
  },
  {
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-003.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-004.jpg",
        "cap": ""
      }
    ],
    "t": "ph"
  },
  {
    "t": "ph",
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-005.jpg",
        "cap": ""
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-006.jpg",
        "cap": ""
      }
    ]
  },
  {
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-007.jpg"
      },
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a2-khoa-59-008.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "by": "LỚP 11A2 · NGÔI NHÀ CHUNG",
    "t": "q",
    "txt": "“Có một nơi để về đó là nhà. Có những người để yêu thương đó là gia đình. Có cả hai đó là hạnh phúc — THPT Quế Võ số 1.”"
  },
  {
    "yrs": "Khóa 59 (2024 – 2027)",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "t": "open",
    "kind": "class",
    "title": "Lớp 11A6"
  },
  {
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-001.jpg"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-002.jpg",
        "cap": ""
      }
    ],
    "t": "ph"
  },
  {
    "by": "HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1",
    "t": "ph",
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-003.jpg"
      },
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-004.jpg"
      }
    ],
    "txt": "“Sáu mươi năm — một chặng đường vinh quang. Dù ở bất cứ nơi đâu, chỉ cần ngoảnh lại, Quế Võ số 1 vẫn luôn là ngôi nhà chan chứa tình thương đón ta trở về.”"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-005.jpg"
      },
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-006.jpg"
      }
    ]
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-007.jpg",
        "cap": ""
      },
      {
        "cap": "",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a6-khoa-59-008.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "txt": "“Tiếng trống trường vang lên năm ấy đã khép lại một thời áo trắng, nhưng mở ra cả một trời ước mơ và khát vọng.”",
    "by": "LỚP 11A5 · HOÀI NIỆM MỘT THỜI",
    "t": "q"
  },
  {
    "kind": "class",
    "t": "open",
    "title": "Lớp 11A10",
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 59 (2024 – 2027)"
  },
  {
    "s": [
      {
        "cap": "Tập thể Lớp 11A10 Khóa 59",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a10-khoa-59-001.jpg"
      }
    ],
    "t": "ph"
  },
  {
    "title": "Lớp 11A12",
    "kind": "class",
    "t": "open",
    "yrs": "Khóa 59 (2024 – 2027)",
    "txt": "Những khoảnh khắc được lưu giữ."
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a12-khoa-59-001.jpg",
        "cap": "Tập thể Lớp 11A12 Khóa 59"
      },
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-11a12-khoa-59-002.jpg",
        "cap": "Tập thể Lớp 11A12 Khóa 59"
      }
    ],
    "t": "ph"
  },
  {
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 60 (2025 – 2028)",
    "t": "open",
    "title": "Lớp 10A5",
    "kind": "class"
  },
  {
    "s": [
      {
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-10a5-khoa-60-001.jpg",
        "cap": "Tập thể Lớp 10A5 Khóa 60"
      }
    ],
    "t": "ph"
  },
  {
    "txt": "Những khoảnh khắc được lưu giữ.",
    "yrs": "Khóa 60 (2025 – 2028)",
    "t": "open",
    "title": "Lớp 10A9",
    "kind": "class"
  },
  {
    "t": "ph",
    "s": [
      {
        "cap": "Tập thể Lớp 10A9 Khóa 60",
        "src": "https://gxq1ht10fih6sw0u.public.blob.vercel-storage.com/c6-lop-10a9-khoa-60-001.jpg"
      }
    ]
  },
  {
    "txt": "“Sáu mươi năm — một chặng đường vinh quang. Dù ở bất cứ nơi đâu, chỉ cần ngoảnh lại, Quế Võ số 1 vẫn luôn là ngôi nhà chan chứa tình thương đón ta trở về.”",
    "title": "",
    "t": "q",
    "by": "HỘI NGỘ & TRI ÂN — 60 NĂM QUẾ VÕ 1"
  },
  {
    "txt": "https://thptquevo1.bacninh.edu.vn\nCô Nguyễn Thị Kim Anh - 11A1\nCLB Tiefe\nTập thể lớp 11A1\nHọc sinh các lớp\nCựu học sinh các khóa\nCán bộ, giáo viên nhà trường",
    "t": "tx",
    "note": "Chúng em rất cảm kích vì những tư liệu quý này ạ, xin chân thành cảm ơn",
    "title": "Nguồn Ảnh + video"
  },
  {
    "title": "Team Làm : WEB kỉ niệm 60 năm",
    "note": "Chúng em rất cảm kích vì những tư liệu quý này ạ, xin chân thành cảm ơn",
    "txt": "Trưởng nhóm : Phùng Gia Bảo\nThành Viên : Phương Thành An, Phạm Ngọc Tùng, Trần Ngọc Minh, Nguyễn Hoàng An, Lê Phạm Thúy Ngân, Trần Hải Ninh, Nguyễn Đức Hùng.\nCode chính : Gia Bảo, Ngọc Minh\nTìm, lọc Ảnh: Thành An\nNội dung : Tùng\nVideo : Hoàng An\nThiết kế bìa, font chữ, hoàn thiện và kiểm tra chất lượng: Ninh, Ngân.\nNhà đầu tư : Đức Hùng",
    "t": "tx",
    "txtH": 348
  },
  {
    "title": "Chào mừng kỉ niệm 60 năm thành lập trường",
    "s": [
      {
        "src": "",
        "cap": "Chú thích ký ức…"
      }
    ],
    "txt": "Hành trình vẫn còn dang dở — và chúng ta là những trang tiếp theo.",
    "t": "end",
    "by": "11A1 cùng nhau viết tiếp trang sử"
  }
];

export function defaultPages(): Page[] {
  return JSON.parse(JSON.stringify(PERFECT_BOOK_PAGES));
}
