import type { Metadata } from "next";
import { MagazineExperience } from "./magazine-experience";

export const metadata: Metadata = {
  title: "Monereen Magazine | Issue 01",
  description:
    "The Pivotal Loop, Monereen Magazine Issue 01. A study of cloth, colour, personal expression, and the house taking shape.",
};

export default function MagazinePage() {
  return <MagazineExperience />;
}
