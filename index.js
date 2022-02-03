const express = require("express");

const db = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();

// expressJS config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints \

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/questions", async (req, res) => {
  const questions = await db.select().from("questions");
  res.json(questions);
});

app.get("/question-answers/:questionId", async (req, res) => {
  const question = await db
    .select()
    .from("questions")
    .where("id", req.params.questionId);

  const answers = await db
    .select()
    .from("answer")
    .where("question_id", req.params.questionId);


    const tags = await db
    .select()
    .from("tag")
    .where("questions_id", req.params.questionId);

  res.json({
    question: question,
    answers: answers,
    tags: tags
  });
});

app.get("/tags", async (req, res) => {
  const tag = await db.select().from("tag");
  res.json(tag);
});

app.post("/question", async (req, res) => {
  const question = await db("questions")
    .insert({ question: req.body.question, comments: [] })
    .returning("*");

  //add this question to tag record in tags  table

  req.body.tags.forEach(async (tag) => {
    await db("tag")
      .where("id", tag)
      .update({
        question_id: db.raw("array_append(questions_id)", [question.id]),
      })
      .returning("*");
  });
  res.json(question);
});

app.post("/tag", async (req, res) => {
    req.body.tags.forEach(async tag =>{
         await db("tag")
        .insert({ tag_name: tag, questions_id: req.body.question_id })
        .returning("*");
    })

    const question = await db
    .select()
    .from("questions")
    .where("id", req.body.question_id);

    const tags = await db
    .select()
    .from("tag")
    .where("questions_id", req.body.question_id);

  res.json({
      question: question , 
      tags: tags
  });
});

app.post("/answer", async (req, res) => {
  const tag = await db("answer")
    .insert({
      answer: req.body.answer,
      question_id: req.body.question_id,
      comments: [],
    })
    .returning("*");
  res.json(tag);
});

app.post("/add-comment-to-answer", async (req, res) => {
  const answer = await db("answer")
    .where("id", req.body.answerId)
    .update({
      comments: db.raw("array_append(comments)", [req.body.comment]),
    })
    .returning("*");

  res.json(answer);
});

app.post("/add-comment-to-question", async (req, res) => {
  const question = await db("question")
    .where("id", req.body.questionId)
    .update({
      comments: db.raw("array_append(comments)", [req.body.comment]),
    })
    .returning("*");

  res.json(question);
});


// Run App
app.listen(PORT, () => console.log(`App Running Port :${PORT}`));
