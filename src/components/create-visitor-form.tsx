import { createVisitor } from "@/action";
import SubmitButton from "./submit-button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function CreateVisitorForm() {
  return (
    <form action={createVisitor}>
    <CardHeader>
      <CardTitle>
        Welcome
        <span className="text-xl tracking-tighter text-primary">
          Jobox Hire
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="title">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Name of the Visitor"
          required
          minLength={3}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="smalldescription">Email</Label>
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="Email of the Visitor"
          required
          minLength={3}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="smalldescription">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="text"
          placeholder="Phone Number"
          required
          minLength={3}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="smalldescription">Purpose</Label>
        <Input
          id="purpose"
          name="purpose"
          type="text"
          placeholder="Purpose of Visiting"
          required
          minLength={3}
        />
      </div>
    </CardContent>
    <CardFooter>
      <SubmitButton title="Check-In" />
    </CardFooter>
  </form>

  )}