"use server";
import { getVisitors, updateCheckOut } from "@/action";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import CheckoutButton from "./checkout-button";

export default async function DataTable({ query }: { query: string }) {
  const data = await getVisitors(query);
  return (
    <Table>
      <TableCaption>A list of your recent Visitors.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Token</TableHead>
          <TableHead>Check-In</TableHead>
          <TableHead>Check-out</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.phone}</TableCell>
            <TableCell>{item.purpose}</TableCell>
            <TableCell>{item.token}</TableCell>
            <TableCell>{item.checkIn.toLocaleString()}</TableCell>
            <TableCell>
              {item.checkOut ? item.checkOut.toLocaleString() : "Checked-In"}
            </TableCell>
            <TableCell>
              <CheckoutButton itemId={item.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
