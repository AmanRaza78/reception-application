import CreateVisitorForm from "@/components/create-visitor-form";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";

export default async function Home() {
  return (
    <>
    <Navbar/>

    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14 mt-4">
    <Card>
      <CreateVisitorForm />
    </Card>
  </section>
  </>
  );
}
