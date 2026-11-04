/** Relative microphone level (not a calibrated sound-pressure/decibel reading). */
export function roomSoundLevel(samples:Float32Array):number {
 let power=0;for(const sample of samples)power+=sample*sample;
 const rms=Math.sqrt(power/Math.max(1,samples.length));
 if(rms<=0)return 0;
 // Logarithmic scaling preserves quiet microphone input that the previous byte/linear meter lost.
 return Math.max(0,Math.min(100,Math.round((20*Math.log10(rms)+72)/60*100)));
}
