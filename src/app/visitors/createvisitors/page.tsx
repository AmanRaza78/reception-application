import CreateVisitorForm from "@/components/create-visitor-form";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateVisitor() {
  const { getUser, getPermission } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }
  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14 mt-4">
        <Card>
          <CreateVisitorForm />
        </Card>
      </section>
    </>
  );
}
