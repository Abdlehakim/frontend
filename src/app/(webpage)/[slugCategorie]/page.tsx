// src/app/(webpage)/[slugCategorie]/page.tsx


export const revalidate = 60;



type PageParams = { slugCategorie: string };

export default async function CategoriePage({

}: {
  params: Promise<PageParams>;
}) {





  return (
    <div className="flex flex-col gap-[24px]">
hello
    </div>
  );
}
