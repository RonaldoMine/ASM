import {ROLES_VALUES} from "./roles";

export const GET_ROUTE_WITH_ROLE = (role) => {
    let route_role = 'agent';
    ROLES_VALUES.forEach((role_val) => {
        const {type, value} = role_val
        if (type === role) {
            route_role = value;
        }
    })
    return route_role;
}