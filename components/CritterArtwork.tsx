import { ATLAS_BOUNDS } from "@/lib/calm-critters-artwork";
/** Crop transparent atlas margins without modifying the original artwork. */
export default function CritterArtwork({image,alt=""}:{image:string;alt?:string}){
 const atlas=image.match(/^(.+\/([a-z0-9-]+)\/sprites\.webp)#(\d+)$/);
 if(!atlas)return <img src={image} alt={alt} draggable={false}/>;
 const sheet=ATLAS_BOUNDS[atlas[2]];
 const cell=Number(atlas[3]);
 const [x,y,width,height]=sheet?.cells[cell]||[cell%4*384,Math.floor(cell/4)*1024/3,384,1024/3];
 return <span className="cc-artwork" role={alt?"img":undefined} aria-label={alt||undefined} aria-hidden={!alt} style={{display:"block",width:"100%",aspectRatio:`${width}/${height}`}}>
  <svg viewBox={`${x} ${y} ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style={{display:"block",overflow:"hidden"}} aria-hidden="true"><image href={atlas[1]} width={sheet?.width||1536} height={sheet?.height||1024}/></svg>
 </span>;
}
