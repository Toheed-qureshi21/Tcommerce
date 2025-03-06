export const TryCatch = (handlerFunction) => {
    return async (req, res) => {
        try {
            await handlerFunction(req, res);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
