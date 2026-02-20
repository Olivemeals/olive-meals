let userId
const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

if ("serviceWorker" in navigator) {
 navigator.serviceWorker.register("sw.js")
}

async function signup(){
 const email=email.value
 const password=password.value

 const {data}=await supabaseClient.auth.signUp({email,password})
 userId=data.user.id

 await supabaseClient.from("users").insert({
  id:userId,email,used_meals:0,plan_meals:56
 })
}

async function login(){
 const {data}=await supabaseClient.auth.signInWithPassword({
  email:email.value,
  password:password.value
 })

 userId=data.session.user.id
 userEmail.innerText=email.value

 loadSummary()
 generateWeek()
 loadHistory()
}

async function loadSummary(){
 const {data}=await supabaseClient.from("users").select("*").eq("id",userId).single()
 used.innerText=data.used_meals
 remaining.innerText=data.plan_meals-data.used_meals
}

async function generateWeek(){
 calendar.innerHTML=""
 const today=new Date()

 for(let i=0;i<7;i++){
  const d=new Date()
  d.setDate(today.getDate()+i)

  const date=d.toISOString().split("T")[0]
  const dayName=days[d.getDay()]

  calendar.innerHTML+=`
  <div class="day">
  <b>${dayName} (${date})</b><br>
  Lunch:
  <button onclick="mealPoll('${date}','lunch','YES')">YES</button>
  <button onclick="mealPoll('${date}','lunch','NO')">NO</button><br>
  Dinner:
  <button onclick="mealPoll('${date}','dinner','YES')">YES</button>
  <button onclick="mealPoll('${date}','dinner','NO')">NO</button>
  </div>`
 }
}

async function mealPoll(date,type,status){
 await supabaseClient.from("meal_requests").delete().eq("user_id",userId).eq("date",date).eq("meal_type",type)

 await supabaseClient.from("meal_requests").insert({
  user_id:userId,date,meal_type:type,status
 })

 if(status==="YES"){
  const {data}=await supabaseClient.from("users").select("*").eq("id",userId).single()
  await supabaseClient.from("users").update({used_meals:data.used_meals+1}).eq("id",userId)
 }

 loadSummary()
 loadHistory()
}

async function loadHistory(){
 const {data}=await supabaseClient.from("meal_requests").select("*").eq("user_id",userId).order("date",{ascending:false}).limit(10)
 history.innerHTML=data.map(r=>`${r.date} ${r.meal_type} ${r.status}`).join("<br>")
}

async function logout(){
 await supabaseClient.auth.signOut()
 location.reload()
}