'use client'
import { cn } from "@/lib/utils";
import { FunctionComponent, useState } from "react";
import { signIn } from 'next-auth/react'
import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {

}

const UserAuthForm: FunctionComponent<UserAuthFormProps> = ({ className, ...props }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()
    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn('google')
        } catch (error) {
            toast({
                title: 'there was a problem',
                description: 'there  was an error logging in ',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button onClick={loginWithGoogle} size='sm' className="w-full" isLoading={isLoading}>
                {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
            </Button>
        </div>);
}

export default UserAuthForm;