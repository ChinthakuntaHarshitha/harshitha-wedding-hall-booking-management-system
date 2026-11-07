const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/halls", (req, res) => {
    db.query("SELECT * FROM halls ORDER BY hall_id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/api/halls/available", (req, res) => {
    db.query("SELECT * FROM halls WHERE status = 'Available' ORDER BY hall_id DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post("/api/customers", (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Name, email and phone are required." });

    db.query(
        "INSERT INTO customers (name,email,phone,address) VALUES (?,?,?,?)",
        [name, email, phone, address || ""],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Customer added successfully", customer_id: result.insertId });
        }
    );
});

app.post("/api/bookings", (req, res) => {
    const { customer_id, hall_id, event_name, event_date, start_time, end_time, total_amount } = req.body;
    if (!customer_id || !hall_id || !event_name || !event_date || !start_time || !end_time || total_amount === undefined) {
        return res.status(400).json({ error: "All booking fields are required." });
    }

    const checkSql = `
        SELECT booking_id FROM booking
        WHERE hall_id = ? AND event_date = ?
        AND status <> 'Cancelled'
        AND start_time < ? AND end_time > ?
    `;

    db.query(checkSql, [hall_id, event_date, end_time, start_time], (checkErr, conflicts) => {
        if (checkErr) return res.status(500).json({ error: checkErr.message });
        if (conflicts.length > 0) return res.status(409).json({ error: "This hall is already booked for the selected date and time." });

        const sql = `
            INSERT INTO booking
            (customer_id,hall_id,event_name,event_date,start_time,end_time,total_amount,status)
            VALUES (?,?,?,?,?,?,?,'Pending')
        `;

        db.query(sql, [customer_id, hall_id, event_name, event_date, start_time, end_time, total_amount], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Booking created successfully", booking_id: result.insertId });
        });
    });
});

app.get("/api/bookings", (req, res) => {
    const sql = `
        SELECT b.booking_id, c.name AS customer_name, c.phone, h.hall_name,
               h.location, b.event_name, b.event_date, b.start_time, b.end_time,
               b.total_amount, b.status
        FROM booking b
        JOIN customers c ON b.customer_id = c.customer_id
        JOIN halls h ON b.hall_id = h.hall_id
        ORDER BY b.event_date DESC, b.start_time DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.patch("/api/bookings/:id/status", (req, res) => {
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid booking status." });

    db.query("UPDATE booking SET status = ? WHERE booking_id = ?", [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Booking status updated." });
    });
});

app.post("/api/payments", (req, res) => {
    const { booking_id, amount, payment_date, payment_status } = req.body;
    if (!booking_id || amount === undefined || !payment_date) {
        return res.status(400).json({ error: "Booking ID, amount and payment date are required." });
    }

    db.query(
        "INSERT INTO payments (booking_id,amount,payment_date,payment_status) VALUES (?,?,?,?)",
        [booking_id, amount, payment_date, payment_status || "Paid"],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Payment recorded successfully", payment_id: result.insertId });
        }
    );
});

app.get("/api/payments", (req, res) => {
    const sql = `
        SELECT p.payment_id, p.booking_id, c.name AS customer_name,
               h.hall_name, p.amount, p.payment_date, p.payment_status
        FROM payments p
        JOIN booking b ON p.booking_id = b.booking_id
        JOIN customers c ON b.customer_id = c.customer_id
        JOIN halls h ON b.hall_id = h.hall_id
        ORDER BY p.payment_id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});