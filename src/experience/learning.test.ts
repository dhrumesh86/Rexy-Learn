import test from "node:test";
import assert from "node:assert/strict";
import {
  questions,
  tutorReply,
  plantOutcome,
  planActivities,
  storyPages,
} from "./learning.ts";

test("all practice questions have valid answers and helpful explanations", () => {
  for (const bank of Object.values(questions)) {
    assert.equal(bank.length, 5);
    for (const q of bank) {
      assert.ok(
        Number.isInteger(q.correct) &&
          q.correct >= 0 &&
          q.correct < q.answers.length,
      );
      assert.equal(new Set(q.answers).size, q.answers.length);
      assert.ok(q.hint.length > 15 && q.explain.length > 15);
    }
  }
  assert.equal(questions.math[0].answers[questions.math[0].correct], "3");
  assert.equal(questions.math[1].answers[questions.math[1].correct], "18");
});
test("tutor distinguishes correct answers, incorrect answers and requests for help", () => {
  assert.match(tutorReply("3"), /^Yes!/);
  assert.match(tutorReply("three more"), /^Yes!/);
  assert.match(tutorReply("18", "ten"), /^Yes!/);
  for (const wrong of ["13", "3 is wrong", "I have no idea", "8"])
    assert.doesNotMatch(tutorReply(wrong), /^Yes!/);
  assert.doesNotMatch(tutorReply("118", "ten"), /^Yes!/);
  assert.match(tutorReply("help", "ten"), /Split 12/);
});
test("plant experiment responds to light and watering changes", () => {
  assert.equal(plantOutcome(65, 55).healthy, true);
  assert.match(plantOutcome(65, 100).title, /soggy/);
  assert.match(plantOutcome(65, 0).title, /thirsty/);
  assert.match(plantOutcome(0, 55).title, /light/);
  assert.ok(plantOutcome(65, 55).height > plantOutcome(0, 55).height);
});
test("weekly default session totals sixty minutes and the story has eight pages", () => {
  assert.equal(
    planActivities.reduce((total, a) => total + a.minutes, 0),
    60,
  );
  assert.equal(storyPages.length, 8);
});
