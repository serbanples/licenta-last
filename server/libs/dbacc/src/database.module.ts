import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema, AccountType } from './schema/account.schema';
import { AccountModel } from './models/account.model';
import { UserSchema, UserType } from './schema/user.schema';
import { UserModel } from './models/user.model';
import { ConversationSchema, ConversationType, FriendRequestSchema, FriendRequestType, MessageSchema, MessageType, NotificationScheam, NotificationType } from './schema';
import { ConversationModel, FriendRequestModel, MessageModel, NotificationModel } from './models';
import { ConfService } from '@app/conf';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (conf: ConfService) => ({
        uri: conf.getOrDefault<string>('mongodb.uri'),
      }),
      inject: [ConfService]
    }),
    MongooseModule.forFeature([
      { name: AccountType.name, schema: AccountSchema },
      { name: UserType.name, schema: UserSchema },
      { name: ConversationType.name, schema: ConversationSchema },
      { name: MessageType.name, schema: MessageSchema },
      { name: FriendRequestType.name, schema: FriendRequestSchema },
      { name: NotificationType.name, schema: NotificationScheam },
    ]),
  ],
  providers: [AccountModel, UserModel, ConversationModel, MessageModel, FriendRequestModel, NotificationModel],
  exports: [AccountModel, UserModel, ConversationModel, MessageModel, FriendRequestModel, NotificationModel],
})
export class DatabaseModule {}
