export const personalColorEnum = {
  WARM: "WARM",
  COOL: "COOL",
  SPRINGWARM: "SPRINGWARM",
  SUMMERCOOL: "SUMMERCOOL",
  FALLWARM: "FALLWARM",
  WINTERCOOL: "WINTERCOOL",
  FALLDEEP: "FALLDEEP",
  WINTERDEEP: "WINTERDEEP",
  SUMMERMUTE: "SUMMERMUTE",
  FALLMUTE: "FALLMUTE",
} as const;

export type personalColorEnum =
  (typeof personalColorEnum)[keyof typeof personalColorEnum];
