import {ROLES_VALUES} from "./roles";
import {
    TICKET_STATUS_ASSIGN,
    TICKET_STATUS_CLOSED,
    TICKET_STATUS_NEW,
    TICKET_STATUS_PROCESSING,
    TICKET_STATUS_SOLVED, TICKETS_STATUS_LABElS
} from "./statusTickets";

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
export const GET_COLOR_TICKET_STATUS = (statusID) => {
    switch (statusID){
        case TICKET_STATUS_ASSIGN:
            return 'blue';
        case TICKET_STATUS_PROCESSING:
            return 'gold';
        case TICKET_STATUS_SOLVED:
            return 'green';
        case TICKET_STATUS_CLOSED:
            return 'red';
        default:
            return 'gray';
    }
}
export const GET_TCIKET_LABELS = (statusID) => TICKETS_STATUS_LABElS[statusID]