import { getCurrentUserFromSession } from "@/app/(auth)/_actions/auth";
import { PageHeader } from "@/components/PageHeader";
import db from "@/db/db";
import ProfileForm from "./_components/ProfileForm";
import { User } from "@prisma/client";

export default async function ProfilePage() {
   const session = await getCurrentUserFromSession();

   const user = await db.user.findUnique({
      where: {
         id: session?.userId as string,
      },
   });

   return (
      <>
         <PageHeader className="text-center">Profile</PageHeader>
         <ProfileForm user={user as User} />
      </>
   );
}
