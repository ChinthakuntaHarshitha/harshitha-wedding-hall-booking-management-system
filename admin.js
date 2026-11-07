async function loadBookings(){
const res=await fetch("/api/bookings");
const data=await res.json();
const body=document.getElementById("bookingsBody");
const stats=document.getElementById("stats");
const pending=data.filter(x=>x.status==="Pending").length;
const confirmed=data.filter(x=>x.status==="Confirmed").length;
const total=data.reduce((s,x)=>s+Number(x.total_amount),0);
stats.innerHTML=`<div class="stat">Bookings<b>${data.length}</b></div><div class="stat">Confirmed<b>${confirmed}</b></div><div class="stat">Booking Value<b>₹${total.toLocaleString("en-IN")}</b></div>`;
body.innerHTML="";
data.forEach(b=>{
const tr=document.createElement("tr");
tr.innerHTML=`<td>#${b.booking_id}</td><td>${b.customer_name}<br>${b.phone}</td><td>${b.hall_name}</td><td>${b.event_name}</td><td>${b.event_date}</td><td>${b.start_time} - ${b.end_time}</td><td>₹${Number(b.total_amount).toLocaleString("en-IN")}</td><td>${b.status}</td><td><select class="select-small" onchange="updateStatus(${b.booking_id},this.value)"><option ${b.status==="Pending"?"selected":""}>Pending</option><option ${b.status==="Confirmed"?"selected":""}>Confirmed</option><option ${b.status==="Cancelled"?"selected":""}>Cancelled</option><option ${b.status==="Completed"?"selected":""}>Completed</option></select></td>`;
body.appendChild(tr);
});
}
async function updateStatus(id,status){
const res=await fetch(`/api/bookings/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
if(!res.ok) alert("Unable to update status");
loadBookings();
}
loadBookings();