import EventsHero from "@/components/events/EventsHero";
import EventsFeature from "@/components/events/EventsFeature";
import EventCalendar from "@/components/events/EventCalendar";
import EventsHouse from "@/components/events/EventsHouse";
import EventsInfo from "@/components/events/EventsInfo";
import EventsClosing from "@/components/events/EventsClosing";

export const metadata = {
  title: "Events | The Rook & Reed Juicery",
  description:
    "Music, chess, books, conversation and gatherings at The House in Kilimani.",
};

export default function EventsPage() {
  return (
    <main>
      <EventsHero />
      <EventsFeature />
      <EventCalendar />
      <EventsHouse />
      <EventsInfo />
      <EventsClosing />
    </main>
  );
}