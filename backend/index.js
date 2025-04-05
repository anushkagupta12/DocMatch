const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Document Matching System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Reset daily credits at midnight
cron.schedule('0 0 * * *', async () => {
    await User.updateMany({}, { dailyScans: 0, lastScanDate: new Date() });
    console.log('Daily credits reset for all users');
});


app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).send('User  already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).send('User  registered');
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

const users = [];
const upload = multer({ dest: 'uploads/' });

app.get('/profile', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ username: user.username, email: user.email });
});


// const fetchUser Profile = async () => {
//     const token = localStorage.getItem('token');
//     const response = await axios.get('http://localhost:5000/profile', {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     console.log(response.data);
// };

 //  Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}
// Upload file (deduct 1 credit)
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  const user = users.find((u) => u.email === req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.credits <= 0) {
    return res.status(402).json({ message: 'Insufficient credits' });
  }

  user.credits -= 1;

  const content = fs.readFileSync(req.file.path, 'utf-8');
  fs.unlinkSync(req.file.path); // clean up

  res.json({
    filename: req.file.originalname,
    wordCount: content.split(/\s+/).length,
    preview: content.slice(0, 200) + '...',
    message: 'File scanned successfully'
  });
});

const logout = () => {
    localStorage.removeItem('token');
    setUser (null);
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});