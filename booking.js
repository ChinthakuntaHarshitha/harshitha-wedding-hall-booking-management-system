const hallSelect=document.getElementById("hall_id");
const amountEl=document.getElementById("total_amount");
const message=document.getElementById("message");
let halls=[];

fetch("/api/halls/available").then(r=>r.json()).then(data=>{
    halls=data;
    data.forEach(h=>{
        const o=document.createElement("option");
        o.value=h.hall_id;
        o.textContent=`${h.hall_name} — ₹${Number(h.price).toLocaleString("en-IN")}`;
        o.dataset.price=h.price;
        hallSelect.appendChild(o);
    });
    const id=new URLSearchParams(location.search).get("hall_id");
    if(id) hallSelect.value=id;
    updateAmount();
});

hallSelect.addEventListener("change",updateAmount);
function updateAmount(){
    const h=halls.find(x=>String(x.hall_id)===String(hallSelect.value));
    amountEl.textContent=h ? `₹${Number(h.price).toLocaleString("en-IN",{minimumFractionDigits:2})}` : "₹0.00";
}

document.getElementById("bookingForm").addEventListener("submit",async e=>{
    e.preventDefault();
    message.textContent="Submitting booking...";
    message.className="message";

    try{
        const customerRes=await fetch("/api/customers",{
            method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                name:document.getElementById("name").value,
                email:document.getElementById("email").value,
                phone:document.getElementById("phone").value,
                address:document.getElementById("address").value
            })
        });
        const customer=await customerRes.json();
        if(!customerRes.ok) throw new Error(customer.error);

        const hall=halls.find(x=>String(x.hall_id)===String(hallSelect.value));
        const bookingRes=await fetch("/api/bookings",{
            method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                customer_id:customer.customer_id,
                hall_id:hall.hall_id,
                event_name:document.getElementById("event_name").value,
                event_date:document.getElementById("event_date").value,
                start_time:document.getElementById("start_time").value,
                end_time:document.getElementById("end_time").value,
                total_amount:hall.price
            })
        });
        const booking=await bookingRes.json();
        if(!bookingRes.ok) throw new Error(booking.error);

        message.textContent=`Booking created successfully. Booking ID: ${booking.booking_id}`;
        message.style.color="#23652f";
        e.target.reset();
        amountEl.textContent="₹0.00";
    }catch(err){
        message.textContent=err.message;
        message.style.color="#a52d2d";
    }
});