const fs = require("fs");
const { join } = require("path");

const filePath = join(__dirname, "posts.json");

const getPosts = () => {
  const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : [];

  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const savePost = (posts) =>
  fs.writeFileSync(filePath, JSON.stringify(posts, null, "\t"));

const postRoute = (app) => {
  app
    .route("/posts/:id?")
    .get((req, res) => {
      const posts = getPosts();

      res.send({ posts });
    })
    .post((req, res) => {
      const posts = getPosts();

      posts.push(req.body);
      savePost(posts);

      res.status(201).send("OK!");
    })
    .put((req, res) => {
      const posts = getPosts();

      savePost(
        posts.map((post) => {
          if (post.id === req.params.id) {
            return {
              ...post,
              ...req.body,
            };
          }

          return post;
        })
      );

      res.status(200).send("OK!");
    })
    .delete((req, res) => {
      const post = getPosts();

      savePost(post.filter((post) => post.id !== req.params.id));
      res.status(200).send("OK!");
    });
};

module.exports = postRoute;
