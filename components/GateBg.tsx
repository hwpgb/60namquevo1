'use client';
import {useState} from 'react';
const IMG='https://i.postimg.cc/FHy6s9ZS/Phac-hoa-cong-truong-Que-Vo-So-1.png';
const OPT='/_next/image?url='+encodeURIComponent(IMG)+'&w=1920&q=60';

function GateSvg({className}:{className:string}){
  const win=(x:number,y:number,w=22,h=34)=><rect key={x+'-'+y} x={x} y={y} width={w} height={h}/>;
  const row=(x0:number,n:number,step:number,y:number,w?:number,h?:number)=>Array.from({length:n}).map((_,i)=>win(x0+i*step,y,w,h));
  return (
  <svg className={className} viewBox='0 0 1200 420' preserveAspectRatio='xMidYMax meet' aria-hidden='true'>
    <defs><pattern id='fence' width='14' height='40' patternUnits='userSpaceOnUse'><path d='M7 0V40'/></pattern></defs>
    <path d='M0 400H1200'/>
    <path d='M30 140L250 250V400H30Z'/><path d='M30 140L22 132L36 126'/>
    {row(50,5,36,270)}{row(50,5,36,320)}
    <path d='M178 250L214 212H432L452 250Z'/><rect x='190' y='250' width='262' height='150'/>
    {row(206,6,40,272)}{row(206,6,40,330)}
    <path d='M748 250L768 212H986L1022 250Z'/><rect x='748' y='250' width='262' height='150'/>
    {row(764,6,40,272)}{row(764,6,40,330)}
    <rect x='452' y='290' width='18' height='110'/><rect x='730' y='290' width='18' height='110'/>
    <rect x='470' y='205' width='52' height='195'/><rect x='678' y='205' width='52' height='195'/>
    <rect x='450' y='150' width='300' height='56'/><rect x='456' y='138' width='46' height='12'/><rect x='698' y='138' width='46' height='12'/>
    <rect x='462' y='158' width='276' height='40'/>
    <text x='600' y='184' textAnchor='middle' fontSize='15' letterSpacing='1' style={{fill:'currentColor',stroke:'none'}}>TRƯỜNG THPT QUẾ VÕ SỐ 1</text>
    <path d='M522 400V300A78 78 0 0 1 678 300V400'/><path d='M536 400V304A64 64 0 0 1 664 304V400'/>
    <rect x='0' y='365' width='452' height='35' fill='url(#fence)'/><rect x='748' y='365' width='452' height='35' fill='url(#fence)'/>
    <path d='M0 366H452M748 366H1200M0 392H452M748 392H1200'/>
    <path d='M90 400V240'/><circle cx='90' cy='200' r='46'/><circle cx='55' cy='235' r='34'/><circle cx='128' cy='232' r='36'/><circle cx='80' cy='160' r='30'/>
    <path d='M1110 400V230'/><circle cx='1110' cy='190' r='48'/><circle cx='1072' cy='228' r='32'/><circle cx='1148' cy='226' r='34'/><circle cx='1100' cy='148' r='30'/>
  </svg>);
}

export default function GateBg({className}:{className:string}){
  const [stage,setStage]=useState(0);
  const intro=className.indexOf('intro-bg')>=0;
  if(stage>=2)return <GateSvg className={className}/>;
  return <img src={stage===0?OPT:IMG} alt='' decoding='async' className={className} onError={()=>setStage(stage+1)} style={{filter:'sepia(.35) contrast(1.25)',mixBlendMode:'multiply',opacity:intro?0.9:0.7,objectFit:'contain',objectPosition:'bottom'}}/>;
}
