const express = require('express');
const app = express();
app.use(express.json());
let books = [
  { id:1,title: "god of fury", price: 300, author: "rina kent" },
  { id:2,title: "god of malice", price: 250, author: "rina kent" },
  { id:3,title: "twisted games", price: 280, author: "ana huang" },
  { id:4,title: "the annhilator", price: 280, author: "ruNyx" }
];

const users = {
  'user1': { name: 'yasaswi', history: ['1'] },
  'user2': { name: 'manaswi', history: ['2'] }
};

app.get('/books', (req, res) => {
  res.json(books);
});

app.post('/users/subscribe', (req, res) => {
  const { userId, name } = req.body;
  if (!userId || !name) return res.status(400).send('Missing userId or name');
  users[userId] = { name, history: [] };
  res.send(`User ${name} subscribed`);
});

app.delete('/users/unsubscribe', (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) return res.status(404).send('User not found');
  delete users[userId];
  res.send(`User ${userId} unsubscribed`);
});

app.post('/borrow', (req, res) => {
  const { userId, bookId } = req.body;
  if (!users[userId]) return res.status(404).send('User not found');
  users[userId].history.push(bookId);
  res.send(`User ${userId} borrowed book ${bookId}`);
});

app.post('/return', (req, res) => {
  const { userId, bookId } = req.body;
  if (!users[userId]) return res.status(404).send('User not found');
  users[userId].history = users[userId].history.filter(id => id !== bookId);
  res.send(`User ${userId} returned book ${bookId}`);
});

app.get('/books/:Id', (req, res) => {
  const book = books.find(b => b.id === req.params.bookId);
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

app.get('/users/:Id/history', (req, res) => {
  const user = users[req.params.userId];
  if (!user) return res.status(404).send('User not found');
  const borrowedBooks = user.history.map(id => books.find(b => b.id === id));
  res.json({ user: user.name, borrowedBooks });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Library API running on port ${PORT}`);
});
