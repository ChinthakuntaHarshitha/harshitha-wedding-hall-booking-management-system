fetch("/api/halls/available")
.then(r=>r.json())
.then(halls=>{
    const list=document.getElementById("hallList");
    if(!halls.length){list.innerHTML="<p>No halls are currently available.</p>";return;}
    halls.forEach(h=>{
        const card=document.createElement("div");
        card.className="hall-card";
        card.innerHTML=`
            <h2>${h.hall_name}</h2>
            <p><b>Location:</b> ${h.location}</p>
            <p><b>Capacity:</b> ${h.capacity} guests</p>
            <p><b>Price:</b> ₹${Number(h.price).toLocaleString("en-IN")}</p>
            <p><b>Facilities:</b> ${h.facilities || "Not specified"}</p>
            <span class="status">${h.status}</span><br>
            <a class="btn" href="booking.html?hall_id=${h.hall_id}">Book Now</a>`;
        list.appendChild(card);
    });
})
.catch(()=>document.getElementById("hallList").innerHTML="<p>Unable to load halls. Check the server and database.</p>");