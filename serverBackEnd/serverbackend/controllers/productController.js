import Product from "../models/Product.js";
import Category from "../models/Category.js";

const productController = {
  getAll: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: {
          model: Category,
          as: "category",
        },
      });

      return res.status(200).json({
        success: true,
        data: products,
        message: "sucesso de alguma coisa"
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: {
          model: Category,
          as: "category",
        },
      });

      if (!product) {
        return res.status(404).json({ 
          success: false,
          data: null,
          message: "Produto não encontrado" });
      }

      return res.status(200).json({
        success: true,
        data: product,
        message: "Produto encontrado"});
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { name, price, categoryId } = req.body;

     if (!name || !price) {
        return res.status(400).json({ 
        success: false,
        data: null,
        message: "nome e preço são obrigatórios" });
      }

       // Verifica se a categoria existe
      const category = await Category.findByPk(categoryId);

      if (!category) {
        return res.status(400).json({ 
        success: false,
        data: null,
        message: "Categoria inválida" });
      }

      const product = await Product.create({
        name,
        price,
        categoryId,
      });

      return res.status(201).json({
        success: true,
        data: product,
        message: "Produto criado com successo"});
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, categoryId } = req.body;

      
     if (!name || !price) {
        return res.status(400).json({ 
        success: false,
        data: null,
        message: "nome e preço são obrigatórios" });
      }

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ 
          success: false,
          data: null,
          message: "Produto não encontrado" 
        });
      }

      // Se estiver alterando categoria, valida
      if (categoryId) {
        const category = await Category.findByPk(categoryId);

        if (!category) {
          return res.status(400).json({ 
            success: false,
            data: null,
            message: "Categoria inválida" });
        } 
      }

      await product.update({ name, price, categoryId });

      return res.status(200).json({
        success: true,
        data: product,
        message: "Produto atualizado com successo"});
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
        success: false,
        data: null,
        message: "Produto não encontrado" });
      }

      await product.destroy();

      return res.status(204).send() 
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },

   list: async (req, res) => {
    try {
      const { category, minPrice, maxPrice, order } = req.query;
      const where = {};
      const Op = require("sequelize").Op;

      if (category) where.category = category;

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = Number(minPrice);
        if (maxPrice) where.price[Op.lte] = Number(maxPrice);
      }
      const products = await Product.findAll({
        where,
        order: [["price", order === "desc" ? "DESC" : "ASC"]]
      });
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};
export default productController;
