// src/pages/admin/AdminProblemDetailsPage
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function AdminProblemDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Problem Details: {id}
        </h1>
        <Link to="/admin/problems">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Problems
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Information</CardTitle>
          <CardDescription>Details for problem ID: {id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will display the full details of the problem with ID:{" "}
            <strong>{id}</strong>.
          </p>
          <p className="mt-2 text-muted-foreground">
            (Implementation for fetching and displaying problem details will go
            here.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
