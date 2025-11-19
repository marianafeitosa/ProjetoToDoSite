import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Inicializa o Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Listar tarefas
app.get("/tasks", async (req, res) => {
  const snapshot = await db.collection("tasks").get();
  const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(tasks);
});

// ✅ Criar nova tarefa
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Título obrigatório" });

  const docRef = await db.collection("tasks").add({
    title,
    description: description || "",
    done: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const doc = await docRef.get();
  res.status(201).json({ id: doc.id, ...doc.data() });
});

// ✅ Atualizar tarefa
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const docRef = db.collection("tasks").doc(id);
  await docRef.update(updates);
  const updated = await docRef.get();

  res.json({ id: updated.id, ...updated.data() });
});

// ✅ Deletar tarefa
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.status(204).send();
});

// 🚀 Rodar servidor
app.listen(4000, () => console.log("Servidor rodando na porta 4000 🚀"));
