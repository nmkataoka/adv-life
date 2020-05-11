import { useState } from "react";

let globalArrowId = 0;

// Generates a unique id for the arrow to ensure css id is always unique on page
export default function useArrowId(): number {
  const [arrowId] = useState(++globalArrowId);
  return arrowId;
}
