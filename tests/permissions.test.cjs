const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('QLDACNTTnhom10/wwwroot/js/permissions.js','utf8');
function permissions(role,path='/dashboard.html') {
  const navigations=[];
  const context={window:{FitManageAuth:{current:()=>role?{role,username:'test-user'}:null}},document:{readyState:'loading',documentElement:{classList:{add(){}},dataset:{}},addEventListener(){}},location:{pathname:path,replace:path=>navigations.push(path)},Set};
  vm.runInNewContext(source,context);
  return {...context.window.FitManagePermissions,navigations};
}
test('permissions fail closed for unknown roles and capabilities',()=>{
  const policy=permissions('Staff');
  for(const role of ['Trainer','Member','Root',undefined]) assert.equal(policy.allowed(role,'operations'),false);
  assert.equal(policy.allowed('Admin','unknown'),false);
  assert.equal(policy.allowed('Staff','administration'),false);
  assert.equal(policy.allowed('Admin','administration'),true);
  assert.equal(policy.allowed('Staff','operations'),true);
});
test('Staff cannot open management reports by entering their URL',()=>{
  for(const page of ['/retention-report.html','/data-tools.html'])assert.deepEqual(permissions('Staff',page).navigations,['/dashboard.html?access=restricted']);
  assert.deepEqual(permissions('Admin','/retention-report.html').navigations,[]);
  assert.deepEqual(permissions(null).navigations,['/login.html']);
  assert.deepEqual(permissions('Member').navigations,['/account.html']);
});
