const joi = require('joi');
const usuariosSchema = joi.object({
    /*Construir a validação de contrato */
    usuarios: joi.array().items({
        nome: joi.string(),
        email: joi.string(),
        password: joi.string(),
        administrador: joi.string(), 
        _id: joi.string()
    }),
    quantidade: joi.number(), /*Essa é a quantidade de itens da lista */
})

export default usuariosSchema; /*Exportando o schema para ser utilizado no teste*/