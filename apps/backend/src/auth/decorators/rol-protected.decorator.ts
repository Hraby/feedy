import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export const META_ROLES = "role"

export const RolProtected = (...args: Role[]) => {
    return SetMetadata(META_ROLES, args)
};