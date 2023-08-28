import { Avatar, AvatarFallback, AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import { FunctionComponent } from "react";
import Image from "next/image";
import { Icons } from "./Icons";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar: FunctionComponent<UserAvatarProps> = ({ user, ...props }) => {
    return <Avatar {...props}>
        {user.image ? (
            <div >
                <Image
                   width={30}
                   height={30}
                
                    src={user.image}
                    alt='profile picture'
                   
                />
            </div>
        ) : (
            <AvatarFallback><span className="sr-only">{user?.name}</span><Icons.user className="h-4 w-4" /></AvatarFallback>

        )}
    </Avatar>;
}

export default UserAvatar;