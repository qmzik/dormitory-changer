class HttpError extends Error {
    public status: number = 500;

    constructor(msg: string = 'Internal server error') {
        super(msg);
    }
}

export default HttpError;
