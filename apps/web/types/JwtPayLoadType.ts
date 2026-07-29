import { personalColorEnum } from "@repo/common";

export interface jwtPayloadType {
  id: number;
  email: string;
  isAdmin: boolean;
  tone: personalColorEnum;
}
