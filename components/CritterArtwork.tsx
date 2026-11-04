/** Built-in atlases use a #0–#11 cell reference; uploaded creatures use ordinary images. */
export default function CritterArtwork({image,alt=""}:{image:string;alt?:string}){
 const atlas=image.match(/^(.*\/sprites\.webp)#(\d+)$/);
 if(!atlas)return <img src={image} alt={alt} draggable={false}/>;
 const cell=Number(atlas[2]);
 return <span className="cc-artwork" role={alt?"img":undefined} aria-label={alt||undefined} aria-hidden={!alt} style={{display:"block",width:"100%",aspectRatio:"1.125",backgroundImage:`url(${atlas[1]})`,backgroundSize:"400% 300%",backgroundPosition:`${cell%4/3*100}% ${Math.floor(cell/4)/2*100}%`,backgroundRepeat:"no-repeat"}}/>;
}
