'use client';
import {useEffect,useRef} from 'react';

// Bảng màu lá thu: chủ đạo cam, đỏ, vàng ấm áp
const LEAF_COLORS=[
  'rgba(215,45,28,',   // Đỏ thắm
  'rgba(235,75,25,',   // Đỏ cam
  'rgba(240,105,25,',  // Cam tươi
  'rgba(220,60,20,',   // Đỏ chu sa
  'rgba(242,130,30,',  // Cam vàng
  'rgba(195,32,22,',   // Đỏ vang
  'rgba(230,90,30,',   // Cam hổ phách
];

export default function Fireflies(){
  const r=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const cv=r.current;
    if(!cv)return;
    const cx=cv.getContext('2d',{alpha:true});
    if(!cx)return;
    let raf=0;

    const isMobile=innerWidth<700;
    const rs=()=>{
      cv.width=innerWidth;
      cv.height=innerHeight;
    };
    rs();
    addEventListener('resize',rs);

    // Đom đóm nhẹ nhàng (giảm tải tối đa trên mobile)
    const fl=Array.from({length:isMobile?10:22},()=>({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      r:Math.random()*1.5+.6,
      vx:(Math.random()-.5)*.2,
      vy:-Math.random()*.25-.05,
      a:Math.random()*6
    }));

    // Lá rơi màu cam, đỏ (16 lá trên mobile là vừa vặn, không lag)
    const leafCount=isMobile?16:38;
    const leaves=Array.from({length:leafCount},(_,i)=>({
      x:Math.random()*innerWidth,
      y:(Math.random()*(innerHeight+60))-30,
      r:Math.random()*3.5+3,
      vx:(Math.random()-.3)*.45-.1,
      vy:Math.random()*.5+.35,
      rot:Math.random()*Math.PI*2,
      vr:(Math.random()-.5)*.03,
      flip:Math.random()*Math.PI*2,
      vflip:(Math.random()-.5)*.04,
      sway:Math.random()*Math.PI*2,
      vsway:Math.random()*.015+.01,
      color:LEAF_COLORS[i%LEAF_COLORS.length],
      op:Math.random()*.3+.45
    }));

    let lastTime=performance.now();
    let lastDraw=0;
    // Giới hạn 45fps trên mobile để dành 100% GPU cho lật trang và cảm ứng mượt mà
    const minInterval=isMobile?22:12;

    const loop=(time:number)=>{
      raf=requestAnimationFrame(loop);
      if(document.hidden)return;

      if(time-lastDraw<minInterval)return;
      const dt=Math.min(32,time-lastTime)/16.66;
      lastTime=time;
      lastDraw=time;

      cx.clearRect(0,0,cv.width,cv.height);

      // Render lá rơi chao liệng 3D
      for(let i=0;i<leaves.length;i++){
        const p=leaves[i];
        p.sway+=p.vsway*dt;
        p.x+=(p.vx+Math.sin(p.sway)*.5)*dt;
        p.y+=p.vy*dt;
        p.rot+=p.vr*dt;
        p.flip+=p.vflip*dt;

        if(p.y>cv.height+25){
          p.y=-25;
          p.x=Math.random()*cv.width;
        }
        if(p.x>cv.width+25)p.x=-25;
        else if(p.x<-25)p.x=cv.width+25;

        cx.save();
        cx.translate(p.x,p.y);
        cx.rotate(p.rot);
        const scaleX=Math.cos(p.flip);
        cx.scale(scaleX,1);

        cx.beginPath();
        cx.moveTo(0,-p.r*1.1);
        cx.bezierCurveTo(p.r,-p.r*.3,p.r*.85,p.r*.85,0,p.r*1.1);
        cx.bezierCurveTo(-p.r*.85,p.r*.85,-p.r,-p.r*.3,0,-p.r*1.1);
        cx.fillStyle=`${p.color}${p.op})`;
        cx.fill();

        // Gân chính giữa
        if(!isMobile||i%2===0){
          cx.strokeStyle=`rgba(255,230,180,${p.op*.5})`;
          cx.lineWidth=0.7;
          cx.beginPath();
          cx.moveTo(0,-p.r*.8);
          cx.lineTo(0,p.r*.85);
          cx.stroke();
        }

        cx.restore();
      }

      // Render đom đóm
      for(let i=0;i<fl.length;i++){
        const f=fl[i];
        f.x+=(f.vx+Math.sin(f.a)*.15)*dt;
        f.y+=f.vy*dt;
        f.a+=.02*dt;
        if(f.y<-10){
          f.y=cv.height+10;
          f.x=Math.random()*cv.width;
        }
        const al=.25+Math.sin(f.a)*.2;
        cx.fillStyle=`rgba(180,125,45,${al*.9})`;
        cx.beginPath();
        cx.arc(f.x,f.y,f.r,0,6.28);
        cx.fill();
      }
    };
    raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',rs)};
  },[]);
  return <canvas ref={r} id='ff'/>;
}
