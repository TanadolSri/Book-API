const express = require('express');
const app = express();
const PORT = 3000;

// จำลองฐานข้อมูลไว้ใน memory (หายเมื่อปิดเซิร์ฟเวอร์)
let users = [];

app.use(express.json());

// 🔧 Register
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.status(200).json({ message: "User registered successfully." });
});

// 🔐 Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find(user =>
        user.username === username && user.password === password
    );

    if (foundUser) {
        res.status(200).json({ message: "Login successful." });
    } else {
        res.status(401).json({ message: "Invalid username or password." });
    }
});

// ข้อมูลจำลองเก็บรีวิว
let reviews = []; // [{ username, bookId, reviewText }]

app.post("/review", (req, res) => {
    const { username, bookId, reviewText } = req.body;

    if (!username || !bookId || !reviewText) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const existingReview = reviews.find(r => r.username === username && r.bookId === bookId);

    if (existingReview) {
        existingReview.reviewText = reviewText;
        res.status(200).json({ message: "Review updated successfully." });
    } else {
        reviews.push({ username, bookId, reviewText });
        res.status(201).json({ message: "Review added successfully." });
    }
});

app.delete("/review", (req, res) => {
    const { username, bookId } = req.body;

    if (!username || !bookId) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const reviewIndex = reviews.findIndex(
        (r) => r.username === username && r.bookId === bookId
    );

    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found." });
    }

    reviews.splice(reviewIndex, 1);
    res.status(200).json({ message: "Review deleted successfully." });
});

// ข้อมูลจำลองหนังสือ
let books = [
    { id: "101", title: "Node.js for Beginners", author: "Jane Doe" },
    { id: "102", title: "Advanced JavaScript", author: "John Smith" },
];

// Endpoint: GET /books (Task 10)
app.get("/books", async (req, res) => {
    try {
        setTimeout(() => {
            res.status(200).json(books);
        }, 500); // จำลอง async delay
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

// 📚 Search book by ISBN using Promises (Task 11)
app.get("/books/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = books.find(b => b.id === isbn);
        if (book) {
            resolve(book);
        } else {
            reject("Book not found.");
        }
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// 📚 Search book by author using async/await
app.get("/books/author/:author", async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = books.filter(book =>
            book.author.toLowerCase().includes(author)
        );

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No books found for the author." });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});
// 🔎 Search book by title
app.get("/books/title/:title", (req, res) => {
    const titleQuery = req.params.title.toLowerCase();

    const result = books.filter(book =>
        book.title.toLowerCase().includes(titleQuery)
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No books found with the given title." });
    }
});
