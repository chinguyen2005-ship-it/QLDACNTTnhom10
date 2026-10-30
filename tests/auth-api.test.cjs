// Run against an isolated preview host, never a shared database.
// Every POST below must be rejected before reaching SQL Server.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const base = process.env.AUTH_REVIEW_URL || 'http://127.0.0.1:5213';
async function post(path, body) {
  return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
}
test('auth pages and local artwork are served by ASP.NET',async()=>{
  for(const file of ['/login.html','/register.html','/js/auth.js','/assets/auth/member-login.jpg','/assets/auth/member-register.jpg']) {
    const response=await fetch(base+file);
    assert.equal(response.status,200,file);
    assert.ok((await response.arrayBuffer()).byteLength>0,file);
  }
});
test('login rejects missing fields before opening a DB connection',async()=>{
  assert.equal((await post('/api/auth/login',{})).status,400);
});
const member={Username:'auth_review',Password:'Valid-password!',Email:'auth-review@example.com',FullName:'Review Member',Phone:'0901234567',Gender:'Nam',RoleID:4};
test('public registration rejects privilege escalation',async()=>{
  for(const RoleID of [1,2,3]) {
    const response=await post('/api/auth/register',{...member,RoleID});
    assert.equal(response.status,400);
    assert.match(await response.text(),/hội viên/);
  }
});
test('registration validates profile, dates, email and bcrypt byte limit',async()=>{
  for(const overrides of [{FullName:''},{Email:'invalid'},{Phone:'bad'},{DateOfBirth:'2999-01-01'},{Password:'a'.repeat(7)},{Password:'ậ'.repeat(30)}]) {
    const response=await post('/api/auth/register',{...member,...overrides});
    assert.equal(response.status,400,JSON.stringify(overrides));
  }
});
test('protected member API rejects requests without a valid JWT',async()=>{
  assert.equal((await fetch(base+'/api/Members')).status,401);
  assert.equal((await fetch(base+'/api/Members',{headers:{Authorization:'Bearer invalid'}})).status,401);
});
