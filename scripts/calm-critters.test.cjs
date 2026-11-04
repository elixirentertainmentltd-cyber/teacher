const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=join(__dirname,'..');
function load(file,dependencies={}){
 const module={exports:{}};
 const code=ts.transpileModule(readFileSync(join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>{if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency '+name);}});
 return module.exports;
}
const data=load('lib/calm-critters-data.ts');
const {validateScene,validImage,getScenes}=load('lib/calm-critters-store.ts',{'server-only':{},'@/lib/db':{configured:()=>false},'@/lib/calm-critters-data':data});
test('all seven built-in scenes are valid and every background and creature asset exists',()=>{
 assert.equal(data.DEFAULT_SCENES.length,7);
 for(const scene of data.DEFAULT_SCENES){assert.equal(validateScene(scene),true,scene.id);for(const url of [scene.background,...scene.creatures.map(c=>c.image)])assert.ok(existsSync(join(root,'public',url.split('#')[0])),url);}
});
test('malformed creature data is rejected without throwing',()=>{
 for(const value of [null,{},[],{...data.DEFAULT_SCENES[0],creatures:[null]},{...data.DEFAULT_SCENES[0],creatures:[7]}])assert.equal(validateScene(value),false);
});
test('invalid positions, duplicate creature identities and external images cannot be published',()=>{
 for(const mutate of [s=>s.creatures.push(s.creatures[0]),s=>s.creatures[0].left=999,s=>s.creatures[0].size=-1,s=>s.background='https://example.org/image.svg',s=>s.creatures=[]]){const s=structuredClone(data.DEFAULT_SCENES[0]);mutate(s);assert.equal(validateScene(s),false);}
 assert.equal(validImage('/api/media/12'),true);assert.equal(validImage('//evil.org/img.png'),false);assert.equal(validImage('/calm-critters/../secret.webp'),false);
});
test('without a configured database the complete built-in catalogue remains available',async()=>{const scenes=await getScenes();assert.equal(scenes.length,7);});

const noise=load('lib/calm-critters-noise.ts');
const motion=load('lib/calm-critters-motion.ts');
const population=load('lib/calm-critters-population.ts',{'./calm-critters-motion':motion});
function playNoise(level,seconds,state=noise.calmNoise(),retreatMode=true){let retreats=0;for(let i=0;i<Math.ceil(seconds*10);i++){const result=noise.advanceNoise(state,level,24,.1,retreatMode);state=result.state;retreats+=Number(result.retreat);}return {state,retreats};}
test('a dropped-book spike is tolerated, sustained talking triggers flight',()=>{
 const spike=playNoise(95,.1);assert.equal(spike.retreats,0);assert.equal(spike.state.tooLoud,false);
 const talking=playNoise(95,1);assert.equal(talking.retreats,1);assert.equal(talking.state.tooLoud,true);
});
test('continued noise causes repeated retreats and quiet recovers without another retreat',()=>{
 const noisy=playNoise(95,12);assert.equal(noisy.retreats,3);
 const settling=playNoise(0,2.8,noisy.state);assert.equal(settling.state.tooLoud,true);
 const quiet=playNoise(0,.4,settling.state);assert.equal(quiet.state.tooLoud,false);assert.equal(quiet.retreats,0);
});
test('pause-only mode never removes animals',()=>{assert.equal(playNoise(95,20,noise.calmNoise(),false).retreats,0);});
test('departing animals remain rendered until flight completes; re-entry cancels the old departure',()=>{
 const creature=data.DEFAULT_SCENES[0].creatures[0];
 const retained=motion.reconcileActors([{creature,leaving:false}],[],true);assert.equal(retained.length,1);assert.equal(retained[0].leaving,true);
 const reentered=motion.reconcileActors(retained,[creature],false);assert.equal(reentered.length,1);assert.equal(reentered[0].leaving,false);
 assert.equal(motion.reconcileActors(reentered,[],false).length,0);
});
test('the same species can arrive 150 times with independent identities and valid scene placement',()=>{
 const world=data.DEFAULT_SCENES[0];const items=Array.from({length:150},(_,i)=>population.spawnCreature(world,'instance-'+i,()=>0));
 assert.equal(items.length,150);assert.equal(new Set(items.map(a=>a.id)).size,150);assert.equal(new Set(items.map(a=>a.creatureId)).size,1);
 for(const item of items){assert.ok(item.left>0&&item.left<100);assert.ok(item.top>=15&&item.top<=90);assert.ok(item.size>0);}
 assert.equal(population.populationDiscoveries({meadow:items}).length,1);
});
test('animal proportions distinguish insects, small mammals and larger animals',()=>{
 const world=data.DEFAULT_SCENES.find(s=>s.id==='meadow');const size=name=>world.creatures.find(c=>c.name===name).size;
 assert.ok(size('Ladybird')<size('Rabbit'));assert.ok(size('Rabbit')<size('Fox'));assert.ok(size('Fox')<size('Deer'));
 const scene=structuredClone(world);scene.creatures[0].size=1.5;scene.creatures[0].motion='fly';assert.equal(validateScene(scene),true);scene.creatures[0].motion='teleport';assert.equal(validateScene(scene),false);
});
