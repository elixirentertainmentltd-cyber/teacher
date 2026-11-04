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
