import { buttonVariants } from "@/components/ui/Button"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: 'login required',
            description: 'you need to be logged in ',
            variant: 'destructive',
            action: (
                <Link href='/sign-in' className={buttonVariants({ variant: 'outline' })} onClick={() => dismiss()}>login</Link>
            )
        })
    }
    return { loginToast }
}


