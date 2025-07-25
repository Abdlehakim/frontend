
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";
import StoreProviders from "@/components/Provider/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col" >
      <StoreProviders>
        <Header />
        {children}
        <Footer />
      </StoreProviders>
    </div>
  );
};

export default SubLayout;