import Question from "./models/Question";

const question: Question = await Question.getByUUID("a5a5021a-96df-4f7d-952b-12e599a28b58");

console.log(question);


