
// @Injectable()
export class ChatService {
    // constructor(
    //     @InjectRepository(Blacklist) 
    //     private blacklistRepository: Repository<Blacklist>,
    //     @InjectRepository(Channels)
    //     private channelRepository: Repository<Channels>,
    //     @InjectRepository(Messages) 
    //     private messagesRepository: Repository<Messages>,
    //     @InjectRepository(User) 
    //     private userRepository: Repository<User>,
    //   ) {}

    // /** MESSAGES **/
    // async getChannelMessages(channelID: number): Promise<Messages[]> {
    //     return await this.messagesRepository.createQueryBuilder('messages')
    //         .leftJoinAndSelect('messages.channel', 'channel')
    //         .where('channel.id', {id: channelID})
    //         .getMany()
    // }

    // async addMessage(channelID: number, login: string, content: string) {
    //     const count = await this.messagesRepository.count();
    //     const message = new Messages()

    //     message.author = await this.userRepository.createQueryBuilder('users')
    //         .where('user.login', {login: login}).getOne()
    //     message.channel = await this.channelRepository.createQueryBuilder('channels')
    //     .where('channels.id', {id: channelID}).getOne()
    //     message.content = content
    //     message.date = new Date();
    //     message.id = count;
    //     await this.messagesRepository.save(message)
    // }

    // /** CHANNELS **/
    // async createChannel(password: string, creator: string) {
    //     const [channels, count] = await this.channelRepository.findAndCount();
    //     const channel = new Channels()
    //     const user = await this.userRepository.createQueryBuilder('users')
    //         .where('users.login', {login: creator})
    //         .getOne()

    //     channel.id = count
    //     channel.members[0] = user
    //     if (password === "")
    //         channel.type = "public"
    //     else
    //         channel.type = "private"
    //     channel.password = password
    //     channel.admin[0] = user
    //     channel.owner = user
    //     this.channelRepository.save(channel)
    // }

    // async createDMChannel(from: string, to: string) {
    //     const [channels, count] = await this.channelRepository.findAndCount();
    //     const channel = new Channels()
    //     const from_user = await this.userRepository.createQueryBuilder('users')
    //         .where('users.login', {login: from})
    //         .getOne()
    //     const to_user = await this.userRepository.createQueryBuilder('users')
    //         .where('users.login', {login: to})
    //         .getOne()

    //     channel.id = count
    //     channel.members[0] = from_user
    //     channel.members[1] = to_user
    //     channel.type = "dm"
    //     this.channelRepository.save(channel)
    // }

    //     // type: dm, private, public
    // async   getJoinedChannels(user: string, type: string): Promise<Channels[]> {
    //     return await this.channelRepository.createQueryBuilder('channels')
    //         .leftJoinAndSelect('channels.members', 'members')
    //         .where('members.login', {login: user})
    //         .andWhere('channels.type', {type: type})
    //         .getMany()
    // }

    //     // get all channels that are not dms
    // async   getAllChannels(): Promise<Channels[]> {
    //     return await this.channelRepository.createQueryBuilder('channels')
    //         .where('channels.type', {type: "private"})
    //         .orWhere('channels.type', {type: "public"})
    //         .getMany()
    // }

    // /** CHANNEL PASSWORD **/
    // async setChannelPassword(channelID: number, password: string){
    //     const channel = await this.channelRepository.createQueryBuilder('channels')
    //         .where('channel.id', {id: channelID})
    //         .getOne()

    //     if (channel.type === "public")
    //         await this.channelRepository.createQueryBuilder()
    //             .update(Channels)
    //             .set({password: password, type: "private"})
    //             .where('id = :id', {id: channelID})
    //             .execute()
    //     else
    //         await this.channelRepository.createQueryBuilder()
    //             .update(Channels)
    //             .set({password: password})
    //             .where('id = :id', {id: channelID})
    //             .execute()
    // }

    // async deleteChannelPassword(channelID: number){
    //     const channel = await this.channelRepository.createQueryBuilder('channels')
    //         .where('channel.id', {id: channelID})
    //         .getOne()

    //     if (channel.type === "private")
    //         await this.channelRepository.createQueryBuilder()
    //             .update(Channels)
    //             .set({password: "", type: "public"})
    //             .where('id = :id', {id: channelID})
    //             .execute()
    //     else
    //         await this.channelRepository.createQueryBuilder()
    //             .update(Channels)
    //             .set({password: ""})
    //             .where('id = :id', {id: channelID})
    //             .execute()
    // }

    // /** ADMIN **/
    // async addAdmin(login: string, channelID: number) {
    //     const user = await this.userRepository.createQueryBuilder('users')
    //         .where('users.login', {login: login})
    //         .getOne()
    //     const admins: User[] = (await this.channelRepository.createQueryBuilder('channels')
    //         .where('channels.id', {id: channelID})
    //         .getOne()).admin
    //     admins[admins.length] = user
    //     await this.channelRepository.createQueryBuilder()
    //         .update(Channels)
    //         .set({admin: admins})
    //         .where('id = :id', {id: channelID})
    //         .execute()
    // }

    // async removeAdmin(login: string) {
    
    // }

    // add user to channel

    // remove user from channel ; is owner leaves, remove owner

    // ban user from channel (for limited time)
    // unban user from channel

    // mute user from channel (for limited time)
    // unmute user from channel

}
