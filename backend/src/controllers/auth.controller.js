const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const { name, mobile, email, password, language } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Name, mobile and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { mobile } });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        mobile,
        email,
        passwordHash,
        language: language ? language.toUpperCase() : 'ENGLISH',
      },
    });

    res.status(201).json({ id: user.id, name: user.name, mobile: user.mobile, role: user.role });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const prisma = req.app.locals.prisma;
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { mobile } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, mobile: user.mobile, role: user.role, language: user.language } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
