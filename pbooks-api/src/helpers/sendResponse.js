export default async (res, message, status = 200, data = null) => {
    
    const response = { status: status < 400 ? "success" : "error", message };
    if (data) {
        response.datas = data;
    }
    res.status(status).json(response);
};