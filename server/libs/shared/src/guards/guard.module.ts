import { Global, Module } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AutzGuard } from "./autz.guard";

@Global()
@Module({
    providers: [AuthGuard, AutzGuard],
    exports: [AuthGuard, AutzGuard],
})
export class GuardModule {
}