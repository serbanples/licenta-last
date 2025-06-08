import { Inject, Injectable } from "@nestjs/common";
import { CORE_SERVER_NAME } from "./clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { UserContextType, WithContext } from "@app/types";
import { UserBrowseFilter, UserCreateType, UserDeleteType, UserUpdateType } from "@app/types/types/user";
import { notificationBrowse, notificationUpdateSeen, userBrowse, userCreate, userFindById, userSuggest, userUpdate } from "./messages.constants";

@Injectable()
export class CoreProxyService {
    constructor(@Inject(CORE_SERVER_NAME) private readonly proxy: ClientProxy) {}

    browseUsers(payload: WithContext<UserBrowseFilter>) {
        return this.proxy.send(userBrowse, payload)
    }

    findByIdUser(paylaod: WithContext<string>) {
        return this.proxy.send(userFindById, paylaod);
    }

    createUser(payload: WithContext<UserCreateType>) {
        return this.proxy.send(userCreate, payload)
    }

    updateUser(payload: WithContext<UserUpdateType>) {
        return this.proxy.send(userUpdate, payload)
    }

    deleteUser(payload: WithContext<UserDeleteType>) {
        return this.proxy.send(userBrowse, payload)
    }

    suggestUser(payload: WithContext<UserBrowseFilter>) {
        return this.proxy.send(userSuggest, payload)
    }
    
    getNotifications(payload: WithContext<undefined>) {
        return this.proxy.send(notificationBrowse, payload)
    }

    updateSeenNotifications(payload: WithContext<undefined>) {
        return this.proxy.send(notificationUpdateSeen, payload)
    }
}