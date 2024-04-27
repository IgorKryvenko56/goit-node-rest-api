function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function validateBody(schema) {
    return async (req, res, next) => {
        try {
            const { error } = await schema.validate(req.body);
            if (error) {
                throw new Error(error.details[0].message);
            }

            if (req.body.email && !isValidEmail(req.body.email)) {
                throw new Error("Invalid email format");
            }

            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}
