/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import prisma from "./lib/db";
import { createObjectCsvStringifier } from "csv-writer";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from "./lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const visitorSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  address:z.string().min(3,{message:"Address is required"}).max(255,{message:"Address is too long"}),
  tomeet:z.string().optional(),
  purpose: z.string().min(3),
});

const checkoutSchema = z.object({
  visitorId: z.string(),
});

export async function createVisitor(prevState:any, formdata: FormData) {
  const { getUser,getPermission } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }


  const parsedFields = visitorSchema.safeParse({
    name: formdata.get('name'),
    email: formdata.get('email'),
    phone: formdata.get('phone'),
    address: formdata.get('address'),
    tomeet: formdata.get('tomeet'),
    purpose: formdata.get('purpose'),
  })

  if (!parsedFields.success) {
    const state: State = {
      status: "error",
      errors: parsedFields.error.flatten().fieldErrors,
      message: "Oops!! Something Wrong with the input fields.",
    };
    return state;
  }

  const token = await generateToken();

  try {
    await prisma.visitor.create({
      data: {
        name: parsedFields.data.name,
        email: parsedFields.data.email,
        phone: parsedFields.data.phone,
        address: parsedFields.data.address,
        visitingTo: parsedFields.data.tomeet,
        purpose: parsedFields.data.purpose,
        token: token
      },
    });
    const state: State ={
      status: "success",
      message: "Welcome to Joboxhire!",
    }
    return state;
  } catch (error) {
    console.log(error);
  }
}

export async function getVisitors(query: string) {
  const { getUser,getPermission } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }

  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        checkIn: "desc",
      },
    });
    return visitors;
  } catch (error) {
    console.log(error);
  }
}

export async function exportVisitorsToCSV() {
  const { getUser,getPermission } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }

  try {
    // Fetch all visitors from the database
    const visitors = await prisma.visitor.findMany({
      orderBy: {
        checkIn: "desc",
      },
    });

    // Prepare CSV fields
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "name", title: "Name" },
        { id: "email", title: "Email" },
        { id: "phone", title: "Phone" },
        { id: "purpose", title: "Purpose" },
        { id: "token", title: "Token" },
        { id: "checkIn", title: "Check-In" },
        { id: "checkOut", title: "Check-Out" },
      ],
    });

    // Format the CSV data
    const csvHeader = csvStringifier.getHeaderString();
    const csvBody = csvStringifier.stringifyRecords(visitors);

    const csvContent = `${csvHeader}${csvBody}`;

    // Return a response with CSV content
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=visitors.csv",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to export visitors", { status: 500 });
  }
}

export async function updateCheckOut(prevState: any, formdata: FormData) {
  const { getUser,getPermission } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const requiredPermission = await getPermission("create:visitor");
  console.log("Hey permissions are here", requiredPermission);
  if (!requiredPermission?.isGranted) {
    redirect("/");
  }

  try {
    const parsedFields = checkoutSchema.safeParse({
      visitorId: formdata.get("visitorId"),
    });

    if (!parsedFields.success) {
      const state: State = {
        status: "error",
        errors: parsedFields.error.flatten().fieldErrors,
        message: "Oops! Something Went wrong.",
      };
      return state;
    }

    await prisma.visitor.update({
      where: {
        id: parsedFields.data.visitorId,
      },
      data: {
        checkOut: new Date(),
      },
    });

    const state: State = {
      status: "success",
      message: "Thankyou for visiting!",
    };

    return state;
  } catch (error) {
    console.log(error);
  }
}
