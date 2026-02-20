async function login(){
 await supabaseClient.auth.signInWithPassword({
  email:email.value,
  password:password.value
 })
 dashboard.style.display="block"
 loadSummary()
 loadUsers()
}

async function loadSummary(){
 const today=new Date().toISOString().split("T")[0]

 const {data:lunch}=await supabaseClient.from("meal_requests").select("*").eq("date",today).eq("meal_type","lunch").eq("status","YES")
 const {data:dinner}=await supabaseClient.from("meal_requests").select("*").eq("date",today).eq("meal_type","dinner").eq("status","YES")

 lunchYes.innerText=lunch.length
 dinnerYes.innerText=dinner.length
}

async function loadUsers(){
 const {data}=await supabaseClient.from("users").select("*")
 users.innerHTML=data.map(u=>`${u.email} — Used:${u.used_meals}`).join("<br>")
}