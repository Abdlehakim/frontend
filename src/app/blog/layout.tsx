import HeaderBlog from "@/components/menu/blog/HeaderBlog";
import Footer from "@/components/menu/Footer";
import Providers from "@/components/Providers";
import GoogleIdentityLoader from "@/components/GoogleIdentityLoader";
import ClientShell from "@/components/ClientShell";

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Providers>
        <ClientShell>
          <HeaderBlog />
          {children}
          <Footer />
        </ClientShell>
      </Providers>
      <GoogleIdentityLoader />
    </div>
  );
};

export default SubLayout;
