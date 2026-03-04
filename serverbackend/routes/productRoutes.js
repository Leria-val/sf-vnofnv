import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get('/', productController.getAll)
productRouter.get('/:id', productController.getById)
productRouter.post('/', productController.create)
productRouter.put('/:id', productController.update)
productRouter.delete('/:id', productController.delete)

export default productRouter;