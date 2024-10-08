import { db } from "@/db";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
    const { id } = searchParams;

    return (
        <p>{id}</p>
    )
};

export default Page;
