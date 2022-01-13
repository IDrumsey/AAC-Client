import { UserDTO } from "./user-dto";

export class AuthenticatedUserDTO {
    token: string;
    User: UserDTO;
}
