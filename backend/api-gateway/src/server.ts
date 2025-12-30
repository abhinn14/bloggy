import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());

app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.startsWith("multipart/form-data")) {
    next(); // let streams pass through untouched
  } else {
    express.json()(req, res, next);
  }
});

async function forwardRequest(
  req: express.Request,
  res: express.Response,
  targetUrl: string
) {
  const contentType = req.headers["content-type"] || "";

  const isMultipart = contentType.startsWith("multipart/form-data");

  try {
    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      data: isMultipart ? req : req.body,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization || "",
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: () => true,
    });

    res.status(response.status).json(response.data);
  } catch {
    res.status(502).json({ message: "API Gateway error" });
  }
}


// Service URLs
const USER_SERVICE = process.env.USER_SERVICE!;
const BLOG_SERVICE = process.env.BLOG_SERVICE!;
const AUTHOR_SERVICE = process.env.AUTHOR_SERVICE!;

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "API Gateway running" });
});

// USER SERVICE
app.post("/api/user/login", async (req, res) => {
  try {
    const r = await axios.post(`${USER_SERVICE}/api/user/login`, req.body);
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

app.get("/api/user/myprofile", async (req, res) => {
  try {
    const r = await axios.get(`${USER_SERVICE}/api/user/myprofile`, {
      headers: { authorization: req.headers.authorization },
    });
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.get("/api/user/getuser/:id", async (req, res) => {
  try {
    const r = await axios.get(
      `${USER_SERVICE}/api/user/getuser/${req.params.id}`
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

app.put("/api/user/update", async (req, res) => {
  try {
    const r = await axios.put(
      `${USER_SERVICE}/api/user/update`,
      req.body,
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.put("/api/user/update/pfp", (req, res) =>
  forwardRequest(
    req,
    res,
    `${USER_SERVICE}/api/user/update/pfp`
  )
);



// BLOG SERVICE
app.get("/api/blog/all", async (req, res) => {
  try {
    const r = await axios.get(`${BLOG_SERVICE}/api/blog/all`, {
      params: {
        searchQuery: req.query.searchQuery,
        category: req.query.category,
      },
    });
    res.json(r.data);
  } catch {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

app.get("/api/blog/:id", async (req, res) => {
  try {
    const r = await axios.get(
      `${BLOG_SERVICE}/api/blog/${req.params.id}`
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 404).json(e.response?.data);
  }
});

app.get("/api/blog/comment/:id", async (req, res) => {
  try {
    const r = await axios.get(
      `${BLOG_SERVICE}/api/blog/comment/${req.params.id}`
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

app.post("/api/blog/comment/:id", async (req, res) => {
  try {
    const r = await axios.post(
      `${BLOG_SERVICE}/api/blog/comment/${req.params.id}`,
      req.body,
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.delete("/api/blog/comment/:commentid", async (req, res) => {
  try {
    const r = await axios.delete(
      `${BLOG_SERVICE}/api/blog/comment/${req.params.commentid}`,
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.post("/api/blog/save/:blogid", async (req, res) => {
  try {
    const r = await axios.post(
      `${BLOG_SERVICE}/api/blog/save/${req.params.blogid}`,
      {},
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.get("/api/blog/saved/all", async (req, res) => {
  try {
    const r = await axios.get(
      `${BLOG_SERVICE}/api/blog/saved/all`,
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});



// AUTHOR SERVICE
app.post("/api/blog/create", (req, res) =>
  forwardRequest(req, res, `${AUTHOR_SERVICE}/api/blog/create`)
);


app.put("/api/blog/update/:id", (req, res) =>
  forwardRequest(
    req,
    res,
    `${AUTHOR_SERVICE}/api/blog/update/${req.params.id}`
  )
);


app.delete("/api/blog/delete/:id", async (req, res) => {
  try {
    const r = await axios.delete(
      `${AUTHOR_SERVICE}/api/blog/delete/${req.params.id}`,
      { headers: { authorization: req.headers.authorization } }
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 401).json(e.response?.data);
  }
});

app.post("/api/blog/ai/grammarcheck", async (req, res) => {
  try {
    const r = await axios.post(
      `${AUTHOR_SERVICE}/api/blog/ai/grammarcheck`,
      req.body
    );
    res.status(r.status).json(r.data);
  } catch (e: any) {
    res.status(e.response?.status || 500).json(e.response?.data);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
