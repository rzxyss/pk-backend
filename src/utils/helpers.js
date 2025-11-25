module.exports = {
    formatResponse: (data, message = 'Success', status = 200) => {
        return {
            status,
            message,
            data
        };
    },
    handleError: (error, res) => {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    },
    validateInput: (input, schema) => {
        const { error } = schema.validate(input);
        return error ? error.details[0].message : null;
    }
};