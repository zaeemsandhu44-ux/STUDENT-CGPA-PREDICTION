const form = document.querySelector("#predictor-form");
const result = document.querySelector("#result");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function readAnswers(formData) {
  const answers = Object.fromEntries(formData.entries());
  for (const [key, value] of Object.entries(answers)) {
    if (key !== "gender" && key !== "course" && key !== "stress_level" &&
        key !== "sleep_quality" && key !== "internet_quality" && key !== "burnout_level") {
      answers[key] = Number(value);
    }
  }
  return answers;
}

function getSuggestions(answers) {
  const suggestions = [];

  if (answers.daily_study_hours < 2) {
    suggestions.push("Build a consistent timetable with a little more focused study time each day.");
  }
  if (answers.attendance_percentage < 75) {
    suggestions.push("Prioritize attending classes and make a plan to improve your attendance.");
  }
  if (answers.assignment_marks < 21) {
    suggestions.push("Practice assignment questions and ask for feedback on areas to improve.");
  }
  if (answers.midterm_marks < 21) {
    suggestions.push("Review midterm topics and use practice questions to check your understanding.");
  }
  if (answers.final_marks < 28) {
    suggestions.push("Set aside regular revision time and try timed practice tests for your final exam.");
  }
  if (answers.daily_sleep_hours < 7) {
    suggestions.push("Try to maintain a regular sleep routine and make room for enough rest.");
  }
  if (answers.stress_score >= 7 || answers.anxiety_score >= 7 || answers.depression_score >= 7) {
    suggestions.push("Consider manageable study goals, regular breaks, and talking with someone you trust.");
  }
  if (answers.physical_activity_hours < 0.5) {
    suggestions.push("Consider adding a short walk or another light physical activity to your routine.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Keep up your study routine, revisit challenging topics, and track your progress.");
  }

  return suggestions;
}

function renderResult(answers) {
  const totalMarks = answers.assignment_marks + answers.midterm_marks + answers.final_marks;
  const estimatedCgpa = clamp(totalMarks / 25, 0, 4);
  const band = estimatedCgpa < 2
    ? "Room to grow"
    : estimatedCgpa < 3
      ? "Building momentum"
      : "Strong progress";

  document.querySelector("#score-value").textContent = estimatedCgpa.toFixed(2);
  document.querySelector("#result-band").textContent = band;
  document.querySelector("#result-description").textContent =
    `Your assessment marks add up to ${totalMarks.toFixed(1)} out of 100. Keep using your course's official grading policy for final results.`;
  document.querySelector("#marks-value").textContent = `${totalMarks.toFixed(1)} / 100`;
  document.querySelector("#marks-fill").style.width = `${clamp(totalMarks, 0, 100)}%`;

  const suggestionList = document.querySelector("#suggestion-list");
  suggestionList.replaceChildren();
  for (const suggestion of getSuggestions(answers)) {
    const item = document.createElement("li");
    item.textContent = suggestion;
    suggestionList.append(item);
  }

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  renderResult(readAnswers(new FormData(form)));
});

form.addEventListener("reset", () => {
  result.hidden = true;
});
