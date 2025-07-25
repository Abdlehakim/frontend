
import HeaderBlog from "@/components/menu/blog/HeaderBlog";
import Footer from "@/components/menu/Footer";

const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col" >
        <HeaderBlog />
        {children}
        <Footer />
    </div>
  );
};

export default SubLayout;