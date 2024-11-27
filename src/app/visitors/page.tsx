"use server";
import DataTable from "@/components/data-table";
import ExportButton from "@/components/export-button";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar";
import { Card } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Visitors({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const { getUser,getPermission } = getKindeServerSession();
  const user = await getUser();
  console.log("Hey aman user is here", user);

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }

  const query = searchParams?.query || "";
  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14 mt-4 flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold tracking-tighter">Visitors</h1>
        <div className="flex justify-between items-center">
          <SearchBar />
          <ExportButton />
        </div>
        <Card>
          <DataTable query={query} />
        </Card>
      </section>
    </>
  );
}
