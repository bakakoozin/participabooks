import Library from "../models/library.model.js"

const getAll = async (req, res, next) => {
    try {
        const [response] = await Library.findAll();

        if (response.length) {
            sendResponse(res, 'Ouvrages récupérés.', 200, response);
            return;
        }
        sendResponse(res, "Aucun ouvrage récupéré.", 400);
        return;
    } catch (error) {
        next(error);
    }
};