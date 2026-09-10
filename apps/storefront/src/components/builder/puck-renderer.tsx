"use client";

import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@monereen/page-builder";

interface PuckRendererProps {
  data: Data;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  return <Render config={puckConfig} data={data} />;
}
