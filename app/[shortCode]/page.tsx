import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ shortCode: string }>;
};

export default async function ShortRedirect({ params }: Props) {

  const { shortCode } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${shortCode}`,
    {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
    }
  );

  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get("location");
    if (location) redirect(location);
  }
  notFound();
}