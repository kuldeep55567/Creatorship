import jwt from 'jsonwebtoken';
const generateToken = (id) => {
    const secret = process.env.SECRET_AUTH;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};
export { generateToken };
