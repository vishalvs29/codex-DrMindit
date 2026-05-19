import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/sessions/${slug}`);
}
