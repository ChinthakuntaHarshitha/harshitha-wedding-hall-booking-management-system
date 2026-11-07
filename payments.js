fetch("/api/payments").then(r=>r.json()).then(data=>{
const body=document.getElementById("paymentsBody");
if(!data.length){body.innerHTML="<tr><td colspan='7'>No payment records found.</td></tr>";return;}
data.forEach(p=>{
const tr=document.createElement("tr");
tr.innerHTML=`<td>${p.payment_id}</td><td>#${p.booking_id}</td><td>${p.customer_name}</td><td>${p.hall_name}</td><td>₹${Number(p.amount).toLocaleString("en-IN")}</td><td>${p.payment_date}</td><td>${p.payment_status}</td>`;
body.appendChild(tr);
});
}).catch(()=>document.getElementById("paymentsBody").innerHTML="<tr><td colspan='7'>Unable to load payments.</td></tr>");