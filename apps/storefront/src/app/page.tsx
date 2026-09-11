import type { Metadata } from "next";
import { MagazineExperience } from "./magazine/magazine-experience";

export const metadata: Metadata = {
  title: "Monereen | The Pivotal Loop",
  description:
    "Enter Monereen through The Pivotal Loop, a study of cloth, colour, personal expression, and a house taking shape.",
};

export default function Home() {
  return <MagazineExperience />;
}
