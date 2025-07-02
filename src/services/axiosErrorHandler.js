module.exports = function handleAxiosError(error, serviceName = 'API externa') {
    if (error.response) {
        // Error de la API (respuesta recibida con código de error)
        const apiMsg = error.response.data && (error.response.data.message || error.response.data.error?.message);
        return new Error(`${serviceName} API error: ${error.response.status} - ${apiMsg || error.response.statusText}`);
    } else if (error.request || error.message === 'Network Error') {
        // No hubo respuesta de la API
        return new Error(`No response from ${serviceName}`);
    } else {
        // Otro error
        return new Error(`Error in ${serviceName} service: ${error.message}`);
    }
}; 