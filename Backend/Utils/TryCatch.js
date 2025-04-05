export const TryCatch = (handlerFunction) => {
    return async (req, res,next) => {
        try {
            await handlerFunction(req, res,next);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
