const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const scripts = path.resolve(__dirname, '../QLDACNTTnhom10/wwwroot/js');
function storage() {
  const values = new Map();
  return { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,String(v)), removeItem: k => values.delete(k) };
}
function token(role, exp = Date.now()/1000+3600) {
  const payload = { exp, unique_name: 'nguyen', role };
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}
function session() {
  const context = vm.createContext({ window:{}, localStorage:storage(), sessionStorage:storage(), TextDecoder, Uint8Array, atob, Date, location:{replace(){}} });
  vm.runInContext(fs.readFileSync(path.join(scripts,'auth-session.js'),'utf8'),context);
  return { context, auth:context.window.FitManageAuth };
}
test('JWT role controls destination, never the editable role cache', () => {
  for (const role of ['Admin','Staff','Trainer','Member']) {
    const {context,auth}=session();
    auth.save(token(role));
    context.localStorage.setItem('role','Admin');
    assert.equal(auth.current().role,role);
    assert.equal(auth.destination(),['Admin','Staff'].includes(role)?'/dashboard.html':'/account.html');
  }
});
test('expired, corrupt and unsupported tokens clear the session', () => {
  for(const jwt of ['bad',token('Admin',1),token('Root')]) {
    const {context,auth}=session();
    context.localStorage.setItem('token',jwt);
    context.localStorage.setItem('role','Admin');
    assert.equal(auth.current(),null);
    assert.equal(context.localStorage.getItem('token'),null);
    assert.equal(context.localStorage.getItem('role'),null);
  }
});
function screen({register=false,fetch,fields={}}={}) {
  const nodes=new Map();
  const node=id=>{
    if(!nodes.has(id)) nodes.set(id,{id,hidden:true,checked:id==='signup-consent',textContent:'Submit',value:'',dataset:{},classList:{toggle(){}},setAttribute(){},removeAttribute(){},focus(){},querySelector(){return this},addEventListener(){}});
    return nodes.get(id);
  };
  const handlers={};
  const form={reportValidity:()=>true,addEventListener:(name,fn)=>handlers[name]=fn,setAttribute(){},removeAttribute(){},reset(){form.resetCalled=true}};
  const navigations=[];
  const context=vm.createContext({
    document:{body:{dataset:{authPage:register?'register':'login'}},documentElement:{},querySelector:()=>form,querySelectorAll:()=>[],getElementById:node,addEventListener(){}},
    localStorage:storage(),sessionStorage:storage(),translations:{vi:{heading_signin:'Hello',subheading_signin:'Welcome'}},
    location:{search:'',assign:p=>navigations.push(p),replace:p=>navigations.push(p)},history:{replaceState(){}},
    FitManageAuth:{save:t=>{context.savedToken=t},destination:()=>'/dashboard.html'},
    FormData:class {get(k){return fields[k]??null}},fetch,AbortSignal,TextEncoder,URLSearchParams,Date
  });
  vm.runInContext(fs.readFileSync(path.join(scripts,'auth.js'),'utf8'),context);
  return {context,node,form,navigations,submit:()=>handlers.submit({preventDefault(){}})};
}
const credentials={Username:' nguyen ',Password:'Valid-password!'};
test('login sends API payload, accepts token and navigates',async()=>{
  let sent;
  const ui=screen({fields:credentials,fetch:async(url,options)=>{sent={url,payload:JSON.parse(options.body)};return{ok:true,text:async()=>JSON.stringify({token:'jwt'})}}});
  await ui.submit();
  assert.deepEqual(sent,{url:'/api/auth/login',payload:{Username:'nguyen',Password:'Valid-password!'}});
  assert.equal(ui.context.savedToken,'jwt');
  assert.deepEqual(ui.navigations,['/dashboard.html']);
  assert.equal(ui.node('auth-submit').disabled,false);
});
test('error responses display safely and restore submit state',async()=>{
  for(const [status,body,expected] of [[401,'Sai tài khoản','Sai tài khoản'],[400,JSON.stringify({errors:{Email:['Invalid email']}}),'Invalid email'],[500,'<html>private stack</html>','Hệ thống đang bận']]) {
    const ui=screen({fields:credentials,fetch:async()=>({ok:false,status,text:async()=>body})});
    await ui.submit();
    assert.ok(ui.node('auth-message').textContent.includes(expected));
    assert.equal(ui.node('auth-message').hidden,false);
    assert.equal(ui.node('auth-submit').disabled,false);
    assert.deepEqual(ui.navigations,[]);
  }
});
test('network errors are actionable and do not navigate',async()=>{
  const ui=screen({fields:credentials,fetch:async()=>{throw new TypeError('Failed to fetch')}});
  await ui.submit();
  assert.match(ui.node('auth-message').textContent,/Không kết nối/);
  assert.equal(ui.node('auth-submit').disabled,false);
});
const signup={...credentials,FullName:' Nguyễn Văn A ',Phone:'0901234567',Email:'member@example.com',DateOfBirth:'2000-01-01',gender:'Nam',ConfirmPassword:credentials.Password};
test('registration checks confirmation before any API request',async()=>{
  let called=false;
  const ui=screen({register:true,fields:{...signup,ConfirmPassword:'different'},fetch:async()=>{called=true}});
  await ui.submit();
  assert.equal(called,false);
  assert.match(ui.node('auth-message').textContent,/không trùng khớp/);
});
test('registration submits complete Member profile and returns to sign in',async()=>{
  let payload;
  const ui=screen({register:true,fields:signup,fetch:async(url,options)=>{assert.equal(url,'/api/auth/register');payload=JSON.parse(options.body);return{ok:true,text:async()=>'{}'}}});
  await ui.submit();
  assert.equal(payload.RoleID,4);
  assert.equal(payload.FullName,'Nguyễn Văn A');
  assert.equal(payload.Phone,signup.Phone);
  assert.equal(payload.Gender,'Nam');
  assert.equal(payload.ConfirmPassword,undefined);
  assert.equal(ui.form.resetCalled,true);
  assert.deepEqual(ui.navigations,['/login.html?registered=1']);
});
test('a pending submission cannot trigger a duplicate request',async()=>{
  let release,calls=0;
  const ui=screen({fields:credentials,fetch:()=>{calls++;return new Promise(resolve=>release=resolve)}});
  const first=ui.submit();
  await ui.submit();
  assert.equal(calls,1);
  assert.equal(ui.node('auth-submit').disabled,true);
  release({ok:false,status:401,text:async()=>'Invalid'});
  await first;
  assert.equal(ui.node('auth-submit').disabled,false);
});
