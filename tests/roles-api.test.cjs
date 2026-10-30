const {test,before}=require('node:test');
const assert=require('node:assert/strict');
const base=process.env.FITMANAGE_TEST_URL||'http://127.0.0.1:5213';
const roles=['Admin','Staff','Trainer','Member'];
const enabled=roles.every(role=>process.env[`FITMANAGE_TEST_${role.toUpperCase()}_PASSWORD`]);
const sessions=new Map();
const normal=value=>Array.isArray(value)?value.map(normal):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key[0].toLowerCase()+key.slice(1),normal(item)])):value;
before(async()=>{
  if(!enabled)return;
  for(const role of roles) {
    const response=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({Username:`fit_test_${role.toLowerCase()}`,Password:process.env[`FITMANAGE_TEST_${role.toUpperCase()}_PASSWORD`]})});
    assert.equal(response.status,200,role+' login');
    const session=await response.json();
    assert.equal(session.role,role);
    sessions.set(role,session.token);
  }
});
async function request(role,path,method='GET',body) {
  return fetch(base+path,{method,headers:{...(role?{Authorization:`Bearer ${sessions.get(role)}`} :{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
}
const options={skip:!enabled};
test('operational endpoints require authentication',options,async()=>{
  for(const route of ['/api/dashboard/operations','/api/dashboard/management','/api/AiPredictions','/api/Trainers','/api/Classes/schedules','/api/Reports/revenue'])
    assert.equal((await request(null,route)).status,401,route);
});
test('Staff can read operations without receiving financial fields',options,async()=>{
  for(const route of ['/api/Members','/api/Contracts','/api/Trainers','/api/Classes/schedules','/api/AiPredictions'])
    assert.equal((await request('Staff',route)).status,200,route);
  const response=await request('Staff','/api/dashboard/operations');
  assert.equal(response.status,200);
  const result=normal(await response.json());
  assert.equal(typeof result.summary.todayCheckIns,'number');
  assert.ok(Array.isArray(result.classes));
  assert.ok(Array.isArray(result.careQueue));
  function check(value) {
    if(Array.isArray(value))return value.forEach(check);
    if(!value||typeof value!=='object')return;
    for(const [key,item]of Object.entries(value)) { assert.doesNotMatch(key,/revenue|commission|salary|amount|price/i);check(item); }
  }
  check(result);
});
test('Staff cannot read management reports or export whole member datasets',options,async()=>{
  for(const route of ['/api/dashboard/management','/api/Reports/dashboard','/api/Reports/revenue','/api/Reports/export-revenue','/api/Reports/export-members','/api/retention/stats','/api/Packages?onlyActive=false'])
    assert.equal((await request('Staff',route)).status,403,route);
});
test('Staff cannot invoke administrative writes, AI scans or email jobs',options,async()=>{
  for(const [method,route]of [['POST','/api/Packages'],['PUT','/api/Packages/-2147483000'],['DELETE','/api/Packages/-2147483000'],['DELETE','/api/Members/-2147483000'],['POST','/api/Classes'],['POST','/api/Classes/schedules'],['PUT','/api/Classes/schedules/-2147483000'],['DELETE','/api/Classes/-2147483000'],['POST','/api/AiPredictions/analyze/-2147483000'],['POST','/api/AiPredictions/analyze-all'],['POST','/api/Contracts/trigger-email-cronjob']])
    assert.equal((await request('Staff',route,method,method==='DELETE'?undefined:{})).status,403,route);
});
test('Staff cannot import member files',options,async()=>{
  const form=new FormData();
  form.set('file',new Blob(['test'],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),'role-check.xlsx');
  const response=await fetch(base+'/api/Reports/import-members',{method:'POST',headers:{Authorization:'Bearer '+sessions.get('Staff')},body:form});
  assert.equal(response.status,403);
});
test('Staff cannot apply arbitrary contract discounts',options,async()=>{
  const payload={MemberID:-2147483000,PackageID:-2147483000,PaymentMethod:'Cash',DiscountAmount:1};
  assert.equal((await request('Staff','/api/Contracts','POST',payload)).status,403);
  assert.equal((await request('Staff','/api/Contracts/-2147483000/renew','POST',payload)).status,403);
  payload.DiscountAmount=0;
  assert.equal((await request('Staff','/api/Contracts','POST',payload)).status,400);
  assert.equal((await request('Staff','/api/Contracts/-2147483000/renew','POST',payload)).status,404);
});
test('Staff can handle predictions, without touching a real record',options,async()=>{
  assert.equal((await request('Staff','/api/AiPredictions/-2147483000/handle','PUT')).status,404);
});
test('Admin dashboard uses real financial data for every supported period',options,async()=>{
  for(const period of ['current','prev','quarter','year']) {
    const response=await request('Admin',`/api/dashboard/management?period=${period}`);
    assert.equal(response.status,200,period);
    const data=normal(await response.json());
    assert.equal(typeof data.summary.revenue,'number');
    for(const collection of ['revenue','registrations','packages','checkIns'])assert.ok(Array.isArray(data[collection]),collection);
  }
  assert.equal((await request('Admin','/api/dashboard/management?period=invalid')).status,400);
  assert.equal((await request('Admin','/api/Reports/revenue')).status,200);
});
test('Trainer and Member cannot access center management',options,async()=>{
  for(const role of ['Trainer','Member']) {
    for(const route of ['/api/dashboard/operations','/api/dashboard/management','/api/Members','/api/AiPredictions','/api/Trainers'])
      assert.equal((await request(role,route)).status,403,`${role}: ${route}`);
    assert.equal((await request(role,'/api/Classes/schedules')).status,200);
  }
});
test('editing the role inside a JWT does not grant Admin access',options,async()=>{
  const parts=sessions.get('Staff').split('.');
  const payload=JSON.parse(Buffer.from(parts[1],'base64url').toString());
  payload.role='Admin';
  payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']='Admin';
  parts[1]=Buffer.from(JSON.stringify(payload)).toString('base64url');
  const response=await fetch(base+'/api/dashboard/management',{headers:{Authorization:'Bearer '+parts.join('.')}});
  assert.equal(response.status,401);
});
