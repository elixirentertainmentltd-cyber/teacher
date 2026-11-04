import { spawn } from "node:child_process";
const supplied=process.argv.slice(2);
const args=[];
for(let i=0;i<supplied.length;i++){
 if(supplied[i]==="--strictPort")continue;
 args.push(supplied[i]==="--host"?"--hostname":supplied[i]);
}
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","dev",...args],{stdio:"inherit"});
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>child.kill(signal));
child.on("exit",code=>process.exit(code??1));
