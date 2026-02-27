import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    shortCode: string;
  };
};

export default async function ShortRedirect({ params }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${params.shortCode}`,
    {
      method: "GET",
      redirect: "manual", 
      cache: "no-store",
    }
  );

  // Backend sends 302 redirect
  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get("location");

    if (location) {
      redirect(location);
    }
  }

  // If short code not found
  if (res.status === 404) {
    notFound();
  }

  // fallback
  notFound();
}