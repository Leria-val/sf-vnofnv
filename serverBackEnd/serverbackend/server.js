import express, { json } from "express";
import { connect, sequelize } from "./database/sqlConnection.js";
import categoryRouter from "./routes/categoryRouter.js";
import productRouter from "./routes/productRoutes.js";

import 'dotenv/config'
import Category from "./models/Category.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(json());
app.use('/categories', categoryRouter)
app.use('/products', productRouter)

app.get("/sync", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    const cat = await Category.create({
    name: "roupas",
    description: "roupas, roupas"
});

await Product.create({
  name: "blusa esteril",
  price: 850,
  categoryId: cat.id 
});

res.json({ message: "Banco sincronizado e dados criados!" });
} catch (err) {
  console.log(err);
  res.status(500).json({ error: "erro ao sincronizar" })
}
});

app.get("/categories", async (req, res) => {
  const categories = await Category.findAll({
    include: "products" });
    res.json(categories);
});


app.listen(PORT, () => {
  connect();
  console.log(`Servidor rodando no link http://localhost:${PORT}`);
});
