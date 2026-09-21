import ProcessStage from "@/components/juice/ProcessStage";

const stages = [
  {
    number: "01",
    eyebrow: "FIRST MOVE",
    title: "SELECT",
    description:
      "The process begins with the ingredients themselves. We choose the fruit, vegetables, herbs and other ingredients that become part of the day's menu.",
    image: "/images/process/select.jpg",
    video: "/videos/process/select.mp4",
    caption: "Whole ingredients. The starting point.",
  },
  {
    number: "02",
    eyebrow: "CLEAN MOVE",
    title: "WASH",
    description:
      "Ingredients are washed before preparation. Clean handling is part of the process, not an afterthought.",
    image: "/images/process/wash.jpg",
    video: "/videos/process/wash.mp4",
    caption: "Clean ingredients. Clean preparation.",
    reverse: true,
  },
  {
    number: "03",
    eyebrow: "PREPARATION",
    title: "PREPARE",
    description:
      "Peeling, cutting, trimming and portioning happen before the ingredients reach the press or blender.",
    image: "/images/process/prepare.jpg",
    video: "/videos/process/prepare.mp4",
    caption: "The knife. The board. The ingredients.",
  },
  {
    number: "04",
    eyebrow: "THE MAIN MOVE",
    title: "PRESS / BLEND",
    description:
      "Ingredients are pressed or blended according to the drink. This is where the individual ingredients become the composition.",
    image: "/images/process/press.jpg",
    video: "/videos/process/press.mp4",
    caption: "Press. Blend. Transform.",
    reverse: true,
  },
  {
    number: "05",
    eyebrow: "FINAL MOVE",
    title: "POUR",
    description:
      "The finished drink is poured fresh. What you receive is the result of the moves that came before it.",
    image: "/images/process/pour.jpg",
    video: "/videos/process/pour.mp4",
    caption: "Freshly made. Ready for the first sip.",
  },
  {
    number: "06",
    eyebrow: "RESET",
    title: "CLEAN",
    description:
      "The final move is cleaning and resetting the preparation space so the next order begins from a clean starting point.",
    image: "/images/process/clean.jpg",
    video: "/videos/process/clean.mp4",
    caption: "Clean the space. Start again.",
    reverse: true,
  },
];

export default function ProcessStages() {
  return (
    <div>
      {stages.map((stage) => (
        <ProcessStage key={stage.number} {...stage} />
      ))}
    </div>
  );
}