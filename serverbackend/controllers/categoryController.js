import Category from "../models/Category.js";
import Product from "../models/Product.js";

const categoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: {
          model: Product,
          as: "products",
        },
      });

      return res.status(200).json({
        success: true,
        data: categories,
        message: "alguma coisa deu certo"
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: {
          model: Product,
          as: "products",
        },
      });

      if (!category) {
        return res.status(404).json({ 
          success: false,
          data: null,
          message: "Categoria não encontrada" });
      }

      return res.status(200).json({
        success: true, 
        data: category,
        message: "categoria alguma coisa ta bom"
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        data: null,
        message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      
          if (!name || !description) {
        return res.status(400).json({ 
        success: false,
        data: null,
        message: "nome e descrição são obrigatórios" });
      }

      const category = await Category.create({
        name,
        description,
      });


      return res.status(201).json({
        success: true,
        data: category,
        message: "criasse alguma coisa com sucesso"
      });
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
      const { name, description } = req.body;

       if (!name || !description) {
        return res.status(400).json({ 
        success: false,
        data: null,
        message: "nome e descrição são obrigatórios" });
      }

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ 
          success: false,
          data: null,
          message: "Categoria não encontrada" });
      }

      let nomeAtt = name || category.name
      await category.update({ nomeAtt, description });

      return res.status(200).json({
        success: true,
        data: category,
        message: "atualizou certo"
      });
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

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ 
          success: false,
          data: null,
          message: "Categoria não encontrada" });
      }

      await category.destroy();

      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: error.message });
    }
  },
};
export default categoryController;
