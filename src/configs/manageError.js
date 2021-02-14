// 400 = Bad request, 401 = Unauthorized, 404 = Not found, 422 = Unprocessable Entity

export const getErrorMessage = (code) => {
    switch (code) {
        case 400:
            return 'Este recurso no esta disponible en este momento, intentelo mas tarde';
        case 401:
            return 'Su email o su contraseña no son correctos, por favor intentelo de nuevo';
        case 404:
            return 'Este recurso no esta disponible en este momento, intentelo mas tarde';
        case 422:
            return 'Algunos de los datos ingresados no tiene el formato correcto, por favor intentelo de nuevo';
        default:
            return 'Error en el sistema. Intentelo en otro momento';
    }
}