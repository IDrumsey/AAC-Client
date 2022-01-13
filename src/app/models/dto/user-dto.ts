import { User } from "../local/user";
import { UserRoles } from "../local/user-roles";

export class UserDTO {
    UserId: number;
    username: string;
    role: string;

    mapToLocal(): User {
        let localUser = new User();
        localUser.id = this.UserId;
        localUser.username = this.username;
        localUser.role = this.roleStringToUserRole();

        return localUser;
    }

    roleStringToUserRole() {
        switch(this.role){
            case "Manager": return UserRoles.Manager;
            case "Employee": return UserRoles.Employee;
            default: return UserRoles.Unknown;
        }
    }
}
