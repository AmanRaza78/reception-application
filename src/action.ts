"use server";
import prisma from "./lib/db";
import { createObjectCsvStringifier } from "csv-writer";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from "./lib/utils";
import { LoginCredentials } from "./lib/auth-types";
import { account } from "./lib/appwrite.config";
import { cookies } from "next/headers";
import { Models } from "appwrite";
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
  purpose: z.string().min(3),
});

const checkoutSchema = z.object({
  visitorId: z.string(),
});

export async function createVisitor(formdata: FormData) {
  const name = formdata.get("name") as string;
  const email = formdata.get("email") as string;
  const phone = formdata.get("phone") as string;
  const purpose = formdata.get("purpose") as string;

  const token = await generateToken();

  try {
    await prisma.visitor.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        purpose: purpose,
        token: token,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}

export async function getVisitors(query: string) {
  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
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

export async function login(credentials: LoginCredentials) {
  try {
    const session = await account.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );

    // Store the session token in a secure HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set("appwrite_session", session.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true, session };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Invalid credentials",
    };
  }
}

export async function getCurrentUser() {
  try {
    const user = (await account.get()) as Models.User<Models.Preferences>;
    return {
      id: user.$id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    try {
      // Try to delete the current session from Appwrite
      await account.deleteSession("current");
    } catch (error) {
      // If session deletion fails, we'll just continue with local cleanup
      console.log("Session already invalid or expired:", error);
    }

    // Always clear the local cookie, regardless of Appwrite session status
    const cookieStore = cookies();
    cookieStore.delete("appwrite_session");

    // Redirect to login page
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if something goes wrong, we should clear the cookie and redirect
    const cookieStore = cookies();
    cookieStore.delete("appwrite_session");
    redirect("/login");
  }
}
