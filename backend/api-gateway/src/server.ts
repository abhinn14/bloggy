import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Service URLs
const USER_SERVICE = process.env.USER_SERVICE!;
const BLOG_SERVICE = process.env.BLOG_SERVICE!;
const AUTHOR_SERVICE = process.env.AUTHOR_SERVICE!;

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "API Gateway running" });
});


// USER SERVICE => /api/user/*
app.post("/api/user/login", (req, res) =>
  axios
    .post(`${USER_SERVICE}/api/user/login`, req.body)
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data))
);

app.get("/api/user/myprofile", (req, res) =>
  axios
    .get(`${USER_SERVICE}/api/user/myprofile`, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.get("/api/user/getuser/:id", (req, res) =>
  axios
    .get(`${USER_SERVICE}/api/user/getuser/${req.params.id}`)
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data))
);

app.put("/api/user/update", (req, res) =>
  axios
    .put(`${USER_SERVICE}/api/user/update`, req.body, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);


// BLOG SERVICE => /api/blog/*
app.get("/api/blog/all", async (_req, res) => {
  try {
    const { data: blogs } = await axios.get(
      `${BLOG_SERVICE}/api/blog/all`
    );

    const enrichedBlogs = await Promise.all(
      blogs.map(async (blog: any) => {
        const { data: author } = await axios.get(
          `${USER_SERVICE}/api/user/getuser/${blog.author}`
        );
        return { ...blog, author };
      })
    );

    res.json(enrichedBlogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

app.get("/api/blog/:id", (req, res) =>
  axios
    .get(`${BLOG_SERVICE}/api/blog/${req.params.id}`)
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 404).json(e.response?.data))
);

app.post("/api/blog/comment/:id", (req, res) =>
  axios
    .post(`${BLOG_SERVICE}/api/blog/comment/${req.params.id}`, req.body, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.get("/api/blog/comment/:id", (req, res) =>
  axios
    .get(`${BLOG_SERVICE}/api/blog/comment/${req.params.id}`)
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data))
);

app.delete("/api/blog/comment/:commentid", (req, res) =>
  axios
    .delete(
      `${BLOG_SERVICE}/api/blog/comment/${req.params.commentid}`,
      { headers: req.headers }
    )
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.post("/api/blog/save/:blogid", (req, res) =>
  axios
    .post(
      `${BLOG_SERVICE}/api/blog/save/${req.params.blogid}`,
      {},
      { headers: req.headers }
    )
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.get("/api/blog/saved/all", (req, res) =>
  axios
    .get(`${BLOG_SERVICE}/api/blog/saved/all`, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

// AUTHOR SERVICE => /api/blog/*

app.post("/api/blog/create", (req, res) =>
  axios
    .post(`${AUTHOR_SERVICE}/api/blog/create`, req.body, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.put("/api/blog/update/:id", (req, res) =>
  axios
    .put(`${AUTHOR_SERVICE}/api/blog/update/${req.params.id}`, req.body, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.delete("/api/blog/delete/:id", (req, res) =>
  axios
    .delete(`${AUTHOR_SERVICE}/api/blog/delete/${req.params.id}`, {
      headers: req.headers,
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 401).json(e.response?.data))
);

app.post("/api/blog/ai/grammarcheck", (req, res) =>
  axios
    .post(`${AUTHOR_SERVICE}/api/blog/ai/grammarcheck`, req.body)
    .then(r => res.json(r.data))
    .catch(e => res.status(e.response?.status || 500).json(e.response?.data))
);

// API gateway server start
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
