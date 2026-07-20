import { personalColorEnum } from "@repo/common";

export interface UserInfoType {
  id: number;
  name?: string;
  address?: string;
  postal_code?: number;
  password?: string;
  personal_color?: personalColorEnum;
  is_active?: boolean;
  is_admin?: boolean;
}
